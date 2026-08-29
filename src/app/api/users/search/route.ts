import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { authenticateRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    // Search by name or email, excluding the current user
    const query = {
      _id: { $ne: user._id },
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const users = await User.find(query).select("firstName lastName email profilePicture _id").limit(10);

    return NextResponse.json(users);
  } catch (error) {
    console.error("Search users error:", error);
    return NextResponse.json({ error: "Failed to search users" }, { status: 500 });
  }
}
