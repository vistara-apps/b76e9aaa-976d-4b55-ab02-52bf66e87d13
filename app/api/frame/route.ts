import { NextRequest, NextResponse } from 'next/server';

// Farcaster Frame API endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { untrustedData, trustedData } = body;

    if (!untrustedData) {
      return NextResponse.json(
        { error: 'Missing untrustedData' },
        { status: 400 }
      );
    }

    const { buttonIndex, inputText, fid, castId } = untrustedData;

    // Handle different frame actions based on buttonIndex
    switch (buttonIndex) {
      case 1: // Create Poll
        return handleCreatePoll(fid);
      case 2: // View Results
        return handleViewResults(fid, castId);
      case 3: // Vote
        return handleVote(fid, castId, inputText);
      default:
        return handleDefault(fid);
    }
  } catch (error) {
    console.error('Frame API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function handleCreatePoll(fid: number) {
  const frameHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image/create-poll" />
        <meta property="fc:frame:button:1" content="Enter Poll Title" />
        <meta property="fc:frame:input:text" content="What's your poll question?" />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame" />
      </head>
    </html>
  `;

  return new NextResponse(frameHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

function handleViewResults(fid: number, castId: any) {
  // Extract poll ID from cast if available
  const pollId = castId?.hash || 'demo-poll';

  const frameHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image/results/${pollId}" />
        <meta property="fc:frame:button:1" content="Vote Now" />
        <meta property="fc:frame:button:2" content="Create New Poll" />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame" />
      </head>
    </html>
  `;

  return new NextResponse(frameHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

function handleVote(fid: number, castId: any, selectedOption?: string) {
  const pollId = castId?.hash || 'demo-poll';

  const frameHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image/vote/${pollId}" />
        <meta property="fc:frame:button:1" content="Option A" />
        <meta property="fc:frame:button:2" content="Option B" />
        <meta property="fc:frame:button:3" content="View Results" />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame" />
      </head>
    </html>
  `;

  return new NextResponse(frameHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

function handleDefault(fid: number) {
  const frameHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image/welcome" />
        <meta property="fc:frame:button:1" content="Create Poll" />
        <meta property="fc:frame:button:2" content="Vote in Poll" />
        <meta property="fc:frame:button:3" content="View Results" />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame" />
      </head>
    </html>
  `;

  return new NextResponse(frameHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

// GET endpoint for initial frame load
export async function GET() {
  const frameHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image/welcome" />
        <meta property="fc:frame:button:1" content="Create Poll" />
        <meta property="fc:frame:button:2" content="Vote in Poll" />
        <meta property="fc:frame:button:3" content="View Results" />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame" />
      </head>
    </html>
  `;

  return new NextResponse(frameHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

