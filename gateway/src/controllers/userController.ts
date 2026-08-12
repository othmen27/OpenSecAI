import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";

interface CreateUserRequestBody {
    email: string;
    username: string;
    displayName?: string;
}
export async function createUser(
    request: FastifyRequest<{ Body: CreateUserRequestBody }>,
    reply: FastifyReply
) {
    try{
        const { email, username, displayName } = request.body;
        const user = await prisma.user.create({
            data: {
                email,
                username,
                displayName,
            },
        });
        return reply.status(201).send(user);
    } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: error });
    }
}