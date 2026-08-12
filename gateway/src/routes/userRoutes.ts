import {FastifyInstance} from "fastify";
import {createUser} from "../controllers/userController.js";

export async function userRoutes(fastify: FastifyInstance) {
    fastify.post("/user", createUser);
}
