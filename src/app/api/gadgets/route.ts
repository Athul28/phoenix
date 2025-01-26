import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface DecodedToken {
  id?: string;
  email?: string;
  exp?: number;
  [key: string]: any;
}

const isValidToken = (token: string): boolean => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      console.error("Token expired");
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error invalid token", err);
    return false;
  }
};

export async function GET(req: Request) {
  const cookies = req.headers
    .get("cookie")
    ?.split("; ")
    .reduce((acc, cookie) => {
      const [name, value] = cookie.split("=");
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);
  console.log("Credentials : ", cookies?.token);

  if (!cookies?.token || !isValidToken(cookies?.token)) {
    return new Response(JSON.stringify("Unauthorized"), { status: 401 });
  }

  const gadgets = await prisma.gadget.findMany();
  return new Response(JSON.stringify(gadgets));
}

export async function POST(req: Request) {
  const name = faker.word.noun();
  const res = await prisma.gadget.create({
    data: {
      name: name,
    },
  });
  return new Response(JSON.stringify("New Gadged added successfully"));
}

export async function DELETE(req: Request) {
  const body = await req.json();
  if (!body || !body.id) {
    return new Response(JSON.stringify("Request body is null or missing id"), {
      status: 400,
    });
  }
  const res = await prisma.gadget.delete({
    where: {
      id: body.id,
    },
  });
  return new Response(JSON.stringify("Item deleted"));
}

export async function PATCH(req: Request) {
  const body = await req.json();
  if (!body || !body.id) {
    return new Response(
      JSON.stringify("Request body is null or missing data"),
      {
        status: 400,
      }
    );
  }
  const res = await prisma.gadget.update({
    where: { id: body.id },
    data: {
      name: body.name,
      status: body.status,
    },
  });
  return new Response(JSON.stringify("Item updated"));
}
