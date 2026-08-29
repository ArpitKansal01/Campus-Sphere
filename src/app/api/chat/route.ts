import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Chat from "@/models/Chat";
import User from "@/models/User";
import Message from "@/models/Message";
import { authenticateRequest } from "@/lib/auth";

// Fetch all chats for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const chats = await Chat.find({ users: { $elemMatch: { $eq: user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    // Populate sender of the latest message
    const populatedChats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "firstName lastName profilePicture email",
    });

    return NextResponse.json(populatedChats);
  } catch (error) {
    console.error("Fetch chats error:", error);
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
  }
}

// Create or fetch a 1-on-1 chat, OR create a Group chat
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { userId, isGroupChat, chatName, users } = body;

    // Handle Direct Message (1-on-1)
    if (!isGroupChat) {
      if (!userId) return NextResponse.json({ error: "UserId param not sent" }, { status: 400 });

      let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
        .populate("users", "-password")
        .populate("latestMessage");

      isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "firstName lastName profilePicture email",
      });

      if (isChat.length > 0) {
        return NextResponse.json(isChat[0]);
      } else {
        const chatData = {
          chatName: "sender",
          isGroupChat: false,
          users: [user._id, userId],
        };

        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
        return NextResponse.json(FullChat);
      }
    } 
    // Handle Group Chat
    else {
      if (!users || !chatName) {
        return NextResponse.json({ error: "Please fill all fields" }, { status: 400 });
      }

      let parsedUsers = typeof users === 'string' ? JSON.parse(users) : users;

      if (parsedUsers.length < 1) {
        return NextResponse.json({ error: "More than 1 user is required for a group chat" }, { status: 400 });
      }

      parsedUsers.push(user._id);

      const groupChat = await Chat.create({
        chatName: chatName,
        users: parsedUsers,
        isGroupChat: true,
        groupAdmin: user._id,
      });

      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      return NextResponse.json(fullGroupChat);
    }
  } catch (error) {
    console.error("Create chat error:", error);
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 });
  }
}
