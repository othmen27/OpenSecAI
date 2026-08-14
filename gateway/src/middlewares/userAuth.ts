import {config} from '../config.js';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function userAuth(request: FastifyRequest, reply: FastifyReply) {
    const token = request.headers.authorization?.replace('Bearer ', '') || request.cookies.jwt;
    if (!token) {
        return reply.status(401).send({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, config.JWTSECRET) as { userId: string };
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        if (!user) {
            return reply.status(401).send({ error: 'Unauthorized' });
        }
        request.userId = decoded.userId;
    } catch (error) {
        return reply.status(401).send({ error: 'Unauthorized' });
    }
}