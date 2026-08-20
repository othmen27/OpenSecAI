import { FastifyReply, FastifyRequest } from "fastify";
import { createReadStream } from "node:fs";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { prisma } from "../lib/prisma.js";

const UPLOADS_RELATIVE = path.join("uploads", "attachments").replace(/\\/g, "/");
const UPLOADS_DIR = path.resolve(process.cwd(), UPLOADS_RELATIVE);

const withAttachments = {
    attachments: {
        orderBy: { createdAt: "asc" as const },
    },
};

async function getOwnedNote(id: string, userId: string) {
    return prisma.note.findFirst({
        where: { id, project: { userId } },
    });
}

function resolveStoredPath(stored: string): string {
    return path.resolve(process.cwd(), stored);
}

function safeFileName(name: string): string {
    return path.basename(name).replace(/["\\\r\n]/g, "_");
}

export async function uploadNoteAttachment(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    try {
        const { id } = request.params;
        const note = await getOwnedNote(id, request.userId);
        if (!note) {
            return reply.status(404).send({ error: "Note not found" });
        }
        const data = await request.file();
        if (!data) {
            return reply.status(400).send({ error: "No file uploaded" });
        }
        const buffer = await data.toBuffer();
        const ext = path.extname(data.filename);
        const storedName = `${randomUUID()}${ext}`;
        const storedPath = `${UPLOADS_RELATIVE}/${storedName}`;
        await mkdir(UPLOADS_DIR, { recursive: true });
        await writeFile(resolveStoredPath(storedPath), buffer);
        const attachment = await prisma.noteAttachment.create({
            data: {
                noteId: id,
                filePath: storedPath,
                originalName: data.filename,
                mimeType: data.mimetype || "application/octet-stream",
            },
        });
        const updated = await prisma.note.findUnique({
            where: { id },
            include: withAttachments,
        });
        return reply.status(200).send({ note: updated, attachment });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}

export async function getNoteAttachmentFile(
    request: FastifyRequest<{
        Params: { id: string; attachmentId: string };
        Querystring: { download?: string };
    }>,
    reply: FastifyReply
) {
    try {
        const { id, attachmentId } = request.params;
        const note = await getOwnedNote(id, request.userId);
        if (!note) {
            return reply.status(404).send({ error: "Note not found" });
        }
        const attachment = await prisma.noteAttachment.findFirst({
            where: { id: attachmentId, noteId: id },
        });
        if (!attachment) {
            return reply.status(404).send({ error: "File not found" });
        }
        const download = request.query.download === "1";
        const stream = createReadStream(resolveStoredPath(attachment.filePath));
        return reply
            .header(
                "Content-Disposition",
                download
                    ? `attachment; filename="${safeFileName(attachment.originalName || attachment.filePath)}"`
                    : "inline",
            )
            .type(attachment.mimeType || "application/octet-stream")
            .send(stream);
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}

export async function deleteNoteAttachment(
    request: FastifyRequest<{ Params: { id: string; attachmentId: string } }>,
    reply: FastifyReply
) {
    try {
        const { id, attachmentId } = request.params;
        const note = await getOwnedNote(id, request.userId);
        if (!note) {
            return reply.status(404).send({ error: "Note not found" });
        }
        const attachment = await prisma.noteAttachment.findFirst({
            where: { id: attachmentId, noteId: id },
        });
        if (!attachment) {
            return reply.status(404).send({ error: "File not found" });
        }
        try {
            await unlink(resolveStoredPath(attachment.filePath));
        } catch (error) {
            console.error("Failed to remove file:", error);
        }
        await prisma.noteAttachment.delete({ where: { id: attachmentId } });
        const updated = await prisma.note.findUnique({
            where: { id },
            include: withAttachments,
        });
        return reply.status(200).send({ note: updated });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}