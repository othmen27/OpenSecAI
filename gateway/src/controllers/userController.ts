import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";


const userController = (fastify: Fastify) => {