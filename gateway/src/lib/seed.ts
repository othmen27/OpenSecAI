import bcrypt from "bcrypt";
import { prisma } from "./prisma.js";
import { config } from "../config.js";
export async function seed(){
    const admin = await prisma.user.findFirst({
        where: {
            OR: [
                { email: config.ADMIN_EMAIL },
                { username: config.ADMIN_EMAIL }
            ]
        }
    });
    if (admin){
        console.log("Admin user already exists");
        return;
    }
    const hashedPassword = await bcrypt.hash(config.ADMIN_PASSWORD, config.SALTROUNDS);
    await prisma.user.create({
        data: {
            email: config.ADMIN_EMAIL,
            username: config.ADMIN_EMAIL,
            password: hashedPassword,
            displayName: "Admin User",
        }
    });
    console.log("Admin user created");
}
