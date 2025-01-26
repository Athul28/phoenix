import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

interface SignupRequestBody {
  username: string;
  email: string;
  password: string;
}

export async function POST(req: Request) {
  console.log(req);
  const { username, email, password }: SignupRequestBody = await req.json();
  const hashedpassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: hashedpassword,
    },
  });
  return Response.json({ message: "User Registered", user });
}
