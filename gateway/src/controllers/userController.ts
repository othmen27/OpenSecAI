import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { config } from "../config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const saltRounds = config.SALTROUNDS;
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
        return reply.status(500).send({ error: "Internal server error" });
    }
}
// @ts-expect-error
export async function getUsers(request: FastifyRequest, reply: FastifyReply) {
    try{
        const users = await prisma.user.findMany();
        return reply.status(200).send({ users });
    }catch(error: any){
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}
export async function checkMe(request: FastifyRequest, reply: FastifyReply) {
    try{
        const user = await prisma.user.findUnique({
            where: { id: request.userId },
            select: {
                id: true,
                email: true,
                username: true,}
        })
        if (!user) {
            return reply.status(404).send({ error: "User not found" });
        }
        return reply.status(200).send({ user });
    }catch(error){
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}
export async function getUserById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try{
        const { id } = request.params;
        const user = await prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            return reply.status(404).send({ error: "User not found" });
        }
        return reply.status(200).send({ user });
    }catch(error: any){
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}
export async function loginUser(request: FastifyRequest<{ Body: { email: string; password: string; username?: string } }>, reply: FastifyReply) {
    try{
        const { email, password, username } = request.body;
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username },
                ]
            }
        });
        if (!user) {
            return reply.status(401).send({ error: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return reply.status(401).send({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "1d" });
        reply.setCookie("jwt", token, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60,
            path: "/",
        });
        return reply.status(200).send({ user, token });
    } catch (error: any) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
    }
}