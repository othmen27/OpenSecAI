import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { config } from "../config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const saltRounds = 12;
const jwtSecret = config.JWTSECRET;
interface CreateUserRequestBody {
    email: string;
    username: string;
    password: string;
    displayName?: string;
}
export async function createUser(
    request: FastifyRequest<{ Body: CreateUserRequestBody }>,
    reply: FastifyReply
) {
    try{
        const { email, username, password, displayName } = request.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username },
                ]
            }
        });
        if (existingUser) {
            return reply.status(400).send({ error: "User already exists" });
        }
        const token = jwt.sign({ email, username }, jwtSecret, { expiresIn: "1d" });
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                displayName,
            },
        });
        reply.setCookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60,
            path: "/",
        });
        return reply.status(201).send({ user, token });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: error.message });
    }
}