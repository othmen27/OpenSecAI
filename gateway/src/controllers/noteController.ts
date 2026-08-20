import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";

interface CreateNoteRequestBody {
    content: string;
}

interface UpdateNoteRequestBody {
    content?: string;
}

const withAttachments = {
    attachments: {
        orderBy: { createdAt: "asc" as const },
    },
};

async function getOwnedProject(projectId: string, userId: string) {
    return prisma.project.findFirst({
        where: { id: projectId, userId },
        select: { id: true },
    });
}

export async function createNote(
    request: FastifyRequest<{ Params: { projectId: string }; Body: CreateNoteRequestBody }>,
    reply: FastifyReply
) {
    try {
        const { projectId } = request.params;
        const { content } = request.body;
        if (typeof content !== "string") {
            return reply.status(400).send({ error: "Note content is required" });
        }
        const project = await getOwnedProject(projectId, request.userId);
        if (!project) {
            return reply.status(404).send({ error: "Project not found" });
        }
        const note = await prisma.note.create({
            data: { content, projectId },
            include: withAttachments,
        });
        return reply.status(201).send({ note });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}

export async function getNotes(
    request: FastifyRequest<{ Params: { projectId: string } }>,
    reply: FastifyReply
) {
    try {
        const { projectId } = request.params;
        const project = await getOwnedProject(projectId, request.userId);
        if (!project) {
            return reply.status(404).send({ error: "Project not found" });
        }
        const notes = await prisma.note.findMany({
            where: { projectId },
            orderBy: { createdAt: "desc" },
            include: withAttachments,
        });
        return reply.status(200).send({ notes });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}

export async function getNoteById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    try {
        const { id } = request.params;
        const note = await prisma.note.findFirst({
            where: { id, project: { userId: request.userId } },
            include: withAttachments,
        });
        if (!note) {
            return reply.status(404).send({ error: "Note not found" });
        }
        return reply.status(200).send({ note });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}

export async function updateNote(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateNoteRequestBody }>,
    reply: FastifyReply
) {
    try {
        const { id } = request.params;
        const { content } = request.body;
        const existing = await prisma.note.findFirst({
            where: { id, project: { userId: request.userId } },
        });
        if (!existing) {
            return reply.status(404).send({ error: "Note not found" });
        }
        const note = await prisma.note.update({
            where: { id },
            data: { ...(content !== undefined ? { content } : {}) },
            include: withAttachments,
        });
        return reply.status(200).send({ note });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}

export async function deleteNote(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    try {
        const { id } = request.params;
        const existing = await prisma.note.findFirst({
            where: { id, project: { userId: request.userId } },
        });
        if (!existing) {
            return reply.status(404).send({ error: "Note not found" });
        }
        await prisma.note.delete({ where: { id } });
        return reply.status(200).send({ message: "Note deleted successfully" });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}