import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getAuthenticatedUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

const MAX_IMAGE_MB = 8;
const MAX_VIDEO_MB = 100;

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

/**
 * Admin-only file upload (product photos & videos).
 * Stores files in Vercel Blob, records metadata in MediaFile,
 * and returns a public URL the admin can attach to a product.
 *
 * Requires BLOB_READ_WRITE_TOKEN env var (Vercel Dashboard → Storage → Blob).
 */
export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'File uploads are not configured yet (missing BLOB_READ_WRITE_TOKEN).' },
      { status: 503 }
    );
  }

  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const kind = (form.get('kind') as string) || 'image'; // 'image' | 'video'

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    const isVideo = kind === 'video';
    const allowed = isVideo ? VIDEO_TYPES : IMAGE_TYPES;
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: isVideo ? 'Only MP4/WebM/MOV videos are allowed.' : 'Only JPG/PNG/WebP/GIF images are allowed.' },
        { status: 400 }
      );
    }

    const maxBytes = (isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB) * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `File too large. Max ${isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB}MB.` },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || (isVideo ? 'mp4' : 'jpg');
    const key = `products/${kind}s/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const blob = await put(key, file, {
      access: 'public',
      contentType: file.type,
    });

    await prisma.mediaFile.create({
      data: {
        fileName: file.name,
        fileUrl: blob.url,
        fileType: file.type,
        fileSize: file.size,
        uploadedBy: user.id,
      },
    });

    return NextResponse.json({ success: true, url: blob.url, type: file.type }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload failed.' }, { status: 500 });
  }
}
