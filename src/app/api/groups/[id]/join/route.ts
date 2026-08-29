import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Chat from "@/models/Chat";
import { authenticateRequest } from "@/lib/auth";

// POST: Join a public group
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await authenticateRequest(request);
    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const group = await Chat.findOne({ _id: id, isGroupChat: true, isPublic: true });
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const alreadyJoined = group.users.some((uid: any) => uid.toString() === user._id.toString());
    if (alreadyJoined) {
      return NextResponse.json({ message: "Already a member" }, { status: 200 });
    }

    await Chat.findByIdAndUpdate(id, { $push: { users: user._id } });

    return NextResponse.json({ message: "Joined successfully" });
  } catch (err) {
    console.error("Join group error:", err);
    return NextResponse.json({ error: "Failed to join group" }, { status: 500 });
  }
}

// DELETE: Leave a public group
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await authenticateRequest(request);
    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    await Chat.findByIdAndUpdate(id, { $pull: { users: user._id } });

    return NextResponse.json({ message: "Left group successfully" });
  } catch (err) {
    console.error("Leave group error:", err);
    return NextResponse.json({ error: "Failed to leave group" }, { status: 500 });
  }
}
