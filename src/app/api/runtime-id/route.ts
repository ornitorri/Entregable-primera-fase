import { NextResponse } from 'next/server';

const runtimeId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export async function GET() {
  return NextResponse.json({ runtimeId });
}
