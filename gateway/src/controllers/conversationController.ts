import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { config } from "../config.js";

interface CreateMessageRequestBody {
    role: string;
    content: string;
}

interface ChatRequestBody {
    content: string;
}

async function getOwnedProject(projectId: string, userId: string) {
    return prisma.project.findFirst({
        where: { id: projectId, userId },
        select: { id: true },
    });
}

async function callAiService(prompt: string): Promise<string> {
    const response = await fetch(`${config.AI_SERVICE_URL}/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal: AbortSignal.timeout(60_000),
    });
    if (!response.ok) {
        throw new Error(`ai-service responded with ${response.status}`);
    }
    const data = (await response.json()) as { response?: string };
    if (!data.response) {
        throw new Error("ai-service returned an empty response");
    }
    return data.response;
}

export async function createConversation(
    request: FastifyRequest<{ Params: { projectId: string } }>,
    reply: FastifyReply
) {
    try {
        const { projectId } = request.params;
        const project = await getOwnedProject(projectId, request.userId);
        if (!project) {
            return reply.status(404).send({ error: "Project not found" });
        }
        const conversation = await prisma.conversation.create({
            data: { projectId },
        });
        return reply.status(201).send({ conversation });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}

export async function getConversations(
    request: FastifyRequest<{ Params: { projectId: string } }>,
    reply: FastifyReply
) {
    try {
        const { projectId } = request.params;
        const project = await getOwnedProject(projectId, request.userId);
        if (!project) {
            return reply.status(404).send({ error: "Project not found" });
        }
        const conversations = await prisma.conversation.findMany({
            where: { projectId },
            orderBy: { updatedAt: "desc" },
            include: { _count: { select: { messages: true } } },
        });
        return reply.status(200).send({ conversations });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}

export async function getConversation(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    try {
        const { id } = request.params;
        const conversation = await prisma.conversation.findFirst({
            where: { id, project: { userId: request.userId } },
            include: { messages: { orderBy: { createdAt: "asc" } } },
        });
        if (!conversation) {
            return reply.status(404).send({ error: "Conversation not found" });
        }
        return reply.status(200).send({ conversation });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}

export async function deleteConversation(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    try {
        const { id } = request.params;
        const existing = await prisma.conversation.findFirst({
            where: { id, project: { userId: request.userId } },
        });
        if (!existing) {
            return reply.status(404).send({ error: "Conversation not found" });
        }
        await prisma.conversation.delete({ where: { id } });
        return reply.status(200).send({ message: "Conversation deleted successfully" });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}

export async function listMessages(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    try {
        const { id } = request.params;
        const conversation = await prisma.conversation.findFirst({
            where: { id, project: { userId: request.userId } },
        });
        if (!conversation) {
            return reply.status(404).send({ error: "Conversation not found" });
        }
        const messages = await prisma.message.findMany({
            where: { conversationId: id },
            orderBy: { createdAt: "asc" },
        });
        return reply.status(200).send({ messages });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}

export async function createMessage(
    request: FastifyRequest<{ Params: { id: string }; Body: CreateMessageRequestBody }>,
    reply: FastifyReply
) {
    try {
        const { id } = request.params;
        const { role, content } = request.body;
        if (!role || typeof role !== "string" || !content || typeof content !== "string") {
            return reply.status(400).send({ error: "role and content are required" });
        }
        const conversation = await prisma.conversation.findFirst({
            where: { id, project: { userId: request.userId } },
        });
        if (!conversation) {
            return reply.status(404).send({ error: "Conversation not found" });
        }
        const message = await prisma.message.create({
            data: { conversationId: id, role, content },
        });
        return reply.status(201).send({ message });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}

export async function chat(
    request: FastifyRequest<{ Params: { id: string }; Body: ChatRequestBody }>,
    reply: FastifyReply
) {
    try {
        const { id } = request.params;
        const { content } = request.body;
        if (!content || typeof content !== "string") {
            return reply.status(400).send({ error: "content is required" });
        }
        const conversation = await prisma.conversation.findFirst({
            where: { id, project: { userId: request.userId } },
        });
        if (!conversation) {
            return reply.status(404).send({ error: "Conversation not found" });
        }
        const userMessage = await prisma.message.create({
            data: { conversationId: id, role: "user", content },
        });
        const contextMessages = await prisma.message.findMany({
            where: { conversationId: id, id: { not: userMessage.id } },
            orderBy: { createdAt: "asc" },
            take: 10,
        });
        const prompt = contextMessages
            .map((message: { role: string; content: string }) => `${message.role}: ${message.content}`)
            .concat(`user: ${content}`)
            .join("\n");
        try {
            const assistantText = await callAiService(prompt);
            const assistantMessage = await prisma.message.create({
                data: { conversationId: id, role: "assistant", content: assistantText },
            });
            return reply.status(200).send({ userMessage, assistantMessage });
        } catch (aiError: any) {
            console.error("ai-service error:", aiError);
            return reply.status(502).send({
                error: "Couldn't reach the AI service — your message was still saved.",
                userMessage,
            });
        }
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}