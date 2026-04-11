import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { status } = await req.json();

  if (!status || typeof status !== "string") {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid status" },
      { status: 400 }
    );
  }

  const lead = await prisma.lead.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json({ ok: true, lead });
}