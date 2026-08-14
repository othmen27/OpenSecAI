import bcrypt from "bcrypt";
import { prisma } from "./prisma.js";
import { config } from "../config.js";
export async function seed(){
    const admin = await prisma.user.findFirst({
        where: {
            OR: [
                { email: "admin"},
                { username: "admin" }
            ]
        }
    });
    if (admin){
        console.log("Admin user already exists");
        return;
    }
    const hashedPassword = await bcrypt.hash("admin", config.SALTROUNDS);
    await prisma.user.create({
        data: {
            email: "admin",
            username: "admin",
            password: hashedPassword,
            displayName: "Admin User",
        }
    });
    console.log("Admin user created");
}
