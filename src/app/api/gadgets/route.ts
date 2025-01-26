import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";


interface DecodedToken {
  id?: string;
  email?: string;
  exp?: number;
  [key: string]: unknown;
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
  const gadgetsWithProbability = gadgets.map(gadget => ({
    ...gadget,
    missionSuccessProbability: `${gadget.name} - ${faker.number.int({ min: 50, max: 100 })}% success probability`
  }));
  return new Response(JSON.stringify(gadgetsWithProbability));
}

export async function POST() {
  const name = faker.word.noun();
  await prisma.gadget.create({
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
  await prisma.gadget.delete({
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
  await prisma.gadget.update({
    where: { id: body.id },
    data: {
      name: body.name,
      status: body.status,
    },
  });
  return new Response(JSON.stringify("Item updated"));
}
