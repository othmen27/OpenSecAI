import {FastifyInstance} from "fastify";
import {createUser, getUserById, getUsers, loginUser,checkMe} from "../controllers/userController.js";
import {userAuth} from "../middlewares/userAuth.js";
export async function userRoutes(fastify: FastifyInstance) {
    fastify.post("/user", createUser);
    fastify.get("/users", { preHandler: userAuth,handler: getUsers });
    fastify.get("/user/:id", { preHandler: userAuth, handler: getUserById });
    fastify.get("/me", { preHandler: userAuth, handler: checkMe });
    fastify.post("/login", loginUser);
}
