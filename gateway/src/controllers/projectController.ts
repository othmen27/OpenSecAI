import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";

interface CreateProjectRequestBody {
    name: string;
    files?: string[];
    notes?: string[];
}

interface UpdateProjectRequestBody {
    name?: string;
    files?: string[];
    notes?: string[];
}

export async function createProject(
    request: FastifyRequest<{ Body: CreateProjectRequestBody }>,
    reply: FastifyReply
) {
    try {
        const { name, files, notes } = request.body;
        if (!name || typeof name !== "string") {
            return reply.status(400).send({ error: "Project name is required" });
        }
        const project = await prisma.project.create({
            data: {
                name,
                files: files ?? [],
                notes: notes ?? [],
                userId: request.userId,
            },
        });
        return reply.status(201).send({ project });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}

export async function getProjects(request: FastifyRequest, reply: FastifyReply) {
    try {
        const projects = await prisma.project.findMany({
            where: { userId: request.userId },
            orderBy: { createdAt: "desc" },
        });
        return reply.status(200).send({ projects });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}

export async function getProjectById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    try {
        const { id } = request.params;
        const project = await prisma.project.findFirst({
            where: { id, userId: request.userId },
        });
        if (!project) {
            return reply.status(404).send({ error: "Project not found" });
        }
        return reply.status(200).send({ project });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}

export async function updateProject(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateProjectRequestBody }>,
    reply: FastifyReply
) {
    try {
        const { id } = request.params;
        const { name, files, notes } = request.body;
        const existing = await prisma.project.findFirst({
            where: { id, userId: request.userId },
        });
        if (!existing) {
            return reply.status(404).send({ error: "Project not found" });
        }
        const project = await prisma.project.update({
            where: { id },
            data: {
                ...(name !== undefined ? { name } : {}),
                ...(files !== undefined ? { files } : {}),
                ...(notes !== undefined ? { notes } : {}),
            },
        });
        return reply.status(200).send({ project });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}

export async function deleteProject(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    try {
        const { id } = request.params;
        const existing = await prisma.project.findFirst({
            where: { id, userId: request.userId },
        });
        if (!existing) {
            return reply.status(404).send({ error: "Project not found" });
        }
        await prisma.project.delete({ where: { id } });
        return reply.status(200).send({ message: "Project deleted successfully" });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}