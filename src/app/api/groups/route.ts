import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Chat from "@/models/Chat";
import User from "@/models/User";
import { authenticateRequest } from "@/lib/auth";

// GET: Fetch all public groups
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request);
    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }
    await connectDB();

    const groups = await Chat.find({ isGroupChat: true, isPublic: true })
      .populate("groupAdmin", "firstName lastName profilePicture")
      .select("chatName description category image users groupAdmin createdAt isPublic")
      .sort({ createdAt: -1 });

    // Include member count and whether the current user has joined
    const enriched = groups.map((g: any) => ({
      _id: g._id,
      chatName: g.chatName,
      description: g.description,
      category: g.category,
      image: g.image,
      memberCount: g.users.length,
      groupAdmin: g.groupAdmin,
      createdAt: g.createdAt,
      isJoined: g.users.some((uid: any) => uid.toString() === user._id.toString()),
    }));

    const response = NextResponse.json(enriched);
    response.headers.set('Cache-Control', 's-maxage=30, stale-while-revalidate=15');
    return response;
  } catch (err) {
    console.error("Fetch public groups error:", err);
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
  }
}

// POST: Create a public group (president/admin only)
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request);
    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "president" && user.role !== "admin") {
      return NextResponse.json({ error: "Only presidents or admins can create public groups" }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();
    const { chatName, description, category, image } = body;

    if (!chatName) {
      return NextResponse.json({ error: "Group name is required" }, { status: 400 });
    }

    const group = await Chat.create({
      chatName,
      description: description || "",
      category: category || "General",
      image: image || "",
      isGroupChat: true,
      isPublic: true,
      users: [user._id],
      groupAdmin: user._id,
    });

    const populated = await Chat.findById(group._id)
      .populate("groupAdmin", "firstName lastName profilePicture");

    return NextResponse.json(populated);
  } catch (err) {
    console.error("Create public group error:", err);
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 });
  }
}
