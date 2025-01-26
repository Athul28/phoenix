import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  const { email, password }: LoginRequestBody = await req.json();

  // Find user in the database
  const user = await prisma.user.findUnique({ where: { email } });

  // Check if user exists and password is correct
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json(
      { message: "Invalid username or password" },
      { status: 401 }
    );
  }

  // Create JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "24h" }
  );

  // Set the token in the response cookies
  const res = NextResponse.json(
    { message: "Login successful" },
    { status: 201 }
  );
  res.cookies.set("token", token, {
    httpOnly: true,
    secure:
      process.env.NODE_ENV === "production" &&
      !(req.headers.get("host") || "").includes("localhost"),
    maxAge: 86400, // 24 hours
    sameSite: "strict",
  });

  return res;
}
