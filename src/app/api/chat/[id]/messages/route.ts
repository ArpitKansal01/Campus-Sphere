import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Message from "@/models/Message";
import Chat from "@/models/Chat";
import User from "@/models/User";
import { authenticateRequest } from "@/lib/auth";

// Fetch all messages for a specific chat
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }

    const chatId = (await params).id;
    if (!chatId) return NextResponse.json({ error: "Chat ID required" }, { status: 400 });

    await connectDB();

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "firstName lastName profilePicture email")
      .populate("chat");

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// Send a new message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }

    const chatId = (await params).id;
    if (!chatId) return NextResponse.json({ error: "Chat ID required" }, { status: 400 });

    await connectDB();
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: "Invalid data passed into request" }, { status: 400 });
    }

    const newMessage = {
      sender: user._id,
      content: content,
      chat: chatId,
    };

    let message = await Message.create(newMessage);

    message = await message.populate("sender", "firstName lastName profilePicture");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "firstName lastName profilePicture email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
