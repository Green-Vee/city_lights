import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; // Adjust your DB connection import as needed
import Track from "@/models/Track"; // Adjust your Mongoose Track model import as needed
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid track ID format" },
        { status: 400 },
      );
    }

    await dbConnect();

    const track = await Track.findById(id);

    if (!track) {
      return NextResponse.json(
        { success: false, error: "Track not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: track }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch single track:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const body = await request.json();

    await dbConnect();

    const updatedTrack = await Track.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true },
    );

    if (!updatedTrack) {
      return NextResponse.json(
        { success: false, error: "Track not found" },
        { status: 404 },
      );
    }

    // Refresh the admin cache
    revalidatePath("/admin");

    return NextResponse.json({ success: true, data: updatedTrack });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { success: false, error: "Server update failed" },
      { status: 500 },
    );
  }
}

// --- DELETE TRACK (DELETE) ---
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Track ID is required" },
        { status: 400 },
      );
    }

    await dbConnect();
    const deletedTrack = await Track.findByIdAndDelete(id);

    if (!deletedTrack) {
      return NextResponse.json(
        { success: false, error: "Track not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Track deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, error: "Delete failed" },
      { status: 500 },
    );
  }
}
function connectDB() {
  throw new Error("Function not implemented.");
}
