import { FastifyInstance } from "fastify";
import {
    chat,
    createConversation,
    createMessage,
    deleteConversation,
    getConversation,
    getConversations,
    listMessages,
} from "../controllers/conversationController.js";
import { userAuth } from "../middlewares/userAuth.js";

export async function conversationRoutes(fastify: FastifyInstance) {
    fastify.post("/projects/:projectId/conversations", { preHandler: userAuth, handler: createConversation });
    fastify.get("/projects/:projectId/conversations", { preHandler: userAuth, handler: getConversations });
    fastify.get("/conversations/:id", { preHandler: userAuth, handler: getConversation });
    fastify.delete("/conversations/:id", { preHandler: userAuth, handler: deleteConversation });
    fastify.get("/conversations/:id/messages", { preHandler: userAuth, handler: listMessages });
    fastify.post("/conversations/:id/messages", { preHandler: userAuth, handler: createMessage });
    fastify.post("/conversations/:id/chat", { preHandler: userAuth, handler: chat });
}