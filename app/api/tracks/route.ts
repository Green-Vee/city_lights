import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Song from "@/models/Track";
import cloudinary from "@/lib/cloudinary";
import Track from "@/models/Track";

// GET all songs
export async function GET() {
  try {
    await connectDB();
    const songs = await Song.find({}).sort({ createdAt: -1 });
    return NextResponse.json(
      { success: true, count: songs.length, data: songs },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
// Use your existing lib configuration!

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string;
    const genre = (formData.get("genre") as string) || "Afrobeat";
    const description = (formData.get("description") as string) || "";
    const audioFile = formData.get("audio") as File;
    const coverFile = formData.get("cover") as File;

    if (!audioFile || audioFile.size === 0) {
      return NextResponse.json(
        { success: false, error: "Audio file is required" },
        { status: 400 },
      );
    }

    // Helper: Stream file buffer straight to Cloudinary
    const uploadStream = (file: File, resourceType: "auto" | "image") => {
      return new Promise<string>(async (resolve, reject) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        cloudinary.uploader
          .upload_stream(
            { resource_type: resourceType, folder: "city_preset" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result?.secure_url || "");
            },
          )
          .end(buffer);
      });
    };

    // Upload audio
    const audioSrc = await uploadStream(audioFile, "auto");

    // Upload cover art if provided, else use placeholder
    let coverImage = "https://res.cloudinary.com/demo/image/upload/sample.jpg";
    if (coverFile && coverFile.size > 0) {
      coverImage = await uploadStream(coverFile, "image");
    }

    await connectDB();

    // Save to MongoDB
    const newTrack = await Track.create({
      title: title || "Untitled Track",
      artist: artist || "Unknown Artist",
      genre,
      description,
      audioSrc,
      coverImage,
      duration: "3:45",
      plays: 0,
      downloads: 0,
      status: "Published",
    });

    return NextResponse.json(
      { success: true, data: newTrack },
      { status: 201 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Server upload failed" },
      { status: 500 },
    );
  }
}

// --- UPDATE TRACK (PUT) ---
export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string;
    const genre = formData.get("genre") as string;
    const description = formData.get("description") as string;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Track ID is required for updating" },
        { status: 400 },
      );
    }

    await connectDB();
    const track = await Track.findById(id);
    if (!track) {
      return NextResponse.json(
        { success: false, error: "Track not found" },
        { status: 404 },
      );
    }

    // Optional: Update cover or audio if new files are provided
    const audioFile = formData.get("audio") as File;
    const coverFile = formData.get("cover") as File;

    const uploadStream = (file: File, resourceType: "auto" | "image") => {
      return new Promise<string>(async (resolve, reject) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        cloudinary.uploader
          .upload_stream(
            { resource_type: resourceType, folder: "city_preset" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result?.secure_url || "");
            },
          )
          .end(buffer);
      });
    };

    if (audioFile && audioFile.size > 0) {
      track.audioSrc = await uploadStream(audioFile, "auto");
    }
    if (coverFile && coverFile.size > 0) {
      track.coverImage = await uploadStream(coverFile, "image");
    }

    track.title = title || track.title;
    track.artist = artist || track.artist;
    track.genre = genre || track.genre;
    track.description =
      description !== undefined ? description : track.description;

    await track.save();

    return NextResponse.json({ success: true, data: track });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { success: false, error: "Update failed" },
      { status: 500 },
    );
  }
}




