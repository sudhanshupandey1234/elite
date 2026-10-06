import { NextRequest, NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { getAuthenticatedUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_IMAGE_MB = 8;
const MAX_VIDEO_MB = 100;

/**
 * Generates short-lived tokens for direct browser → Vercel Blob uploads.
 * Needed because Vercel serverless functions cap request bodies at ~4.5MB,
 * so product videos must be uploaded straight from the browser.
 *
 * Requires BLOB_READ_WRITE_TOKEN env var.
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

  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        let kind = 'image';
        try {
          kind = JSON.parse(clientPayload || '{}').kind || 'image';
        } catch {
          /* default */
        }
        const isVideo = kind === 'video';
        return {
          allowedContentTypes: isVideo ? VIDEO_TYPES : IMAGE_TYPES,
          maximumSizeInBytes: (isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB) * 1024 * 1024,
          tokenPayload: JSON.stringify({ kind, userId: user.id }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        try {
          const meta = JSON.parse(tokenPayload || '{}');
          await prisma.mediaFile.create({
            data: {
              fileName: blob.pathname.split('/').pop() || 'upload',
              fileUrl: blob.url,
              fileType: blob.contentType || 'application/octet-stream',
              fileSize: 0,
              uploadedBy: meta.userId || null,
            },
          });
        } catch (e) {
          console.error('Failed to log uploaded media:', e);
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload failed.' }, { status: 400 });
  }
}
