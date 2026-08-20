import { FastifyInstance } from "fastify";
import {
    createNote,
    deleteNote,
    getNoteById,
    getNotes,
    updateNote,
} from "../controllers/noteController.js";
import {
    deleteNoteAttachment,
    getNoteAttachmentFile,
    uploadNoteAttachment,
} from "../controllers/fileController.js";
import { userAuth } from "../middlewares/userAuth.js";

export async function noteRoutes(fastify: FastifyInstance) {
    fastify.post("/projects/:projectId/notes", { preHandler: userAuth, handler: createNote });
    fastify.get("/projects/:projectId/notes", { preHandler: userAuth, handler: getNotes });
    fastify.get("/notes/:id", { preHandler: userAuth, handler: getNoteById });
    fastify.put("/notes/:id", { preHandler: userAuth, handler: updateNote });
    fastify.delete("/notes/:id", { preHandler: userAuth, handler: deleteNote });
    fastify.post("/notes/:id/attachments", { preHandler: userAuth, handler: uploadNoteAttachment });
    fastify.get("/notes/:id/attachments/:attachmentId/file", { preHandler: userAuth, handler: getNoteAttachmentFile });
    fastify.delete("/notes/:id/attachments/:attachmentId", { preHandler: userAuth, handler: deleteNoteAttachment });
}