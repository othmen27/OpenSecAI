import { FastifyInstance } from "fastify";
import {
    createProject,
    deleteProject,
    getProjectById,
    getProjects,
    updateProject,
} from "../controllers/projectController.js";
import { userAuth } from "../middlewares/userAuth.js";

export async function projectRoutes(fastify: FastifyInstance) {
    fastify.post("/projects", { preHandler: userAuth, handler: createProject });
    fastify.get("/projects", { preHandler: userAuth, handler: getProjects });
    fastify.get("/projects/:id", { preHandler: userAuth, handler: getProjectById });
    fastify.put("/projects/:id", { preHandler: userAuth, handler: updateProject });
    fastify.delete("/projects/:id", { preHandler: userAuth, handler: deleteProject });
}