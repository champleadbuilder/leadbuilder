import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id } = params;
  const body = await request.json();

  const status = body?.status;

  if (!status || typeof status !== "string") {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid status" },
      { status: 400 }
    );
  }

  const lead = await prisma.lead.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ ok: true, lead });
}