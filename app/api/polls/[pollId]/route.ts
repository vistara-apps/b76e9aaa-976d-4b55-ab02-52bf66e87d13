import { NextRequest, NextResponse } from 'next/server';
import { getPoll, updatePoll, deletePoll } from '../../../../lib/store/data';

export async function GET(
  request: NextRequest,
  { params }: { params: { pollId: string } }
) {
  try {
    const poll = getPoll(params.pollId);

    if (!poll) {
      return NextResponse.json(
        { success: false, error: 'Poll not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: poll
    });
  } catch (error) {
    console.error('Error fetching poll:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch poll' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { pollId: string } }
) {
  try {
    const body = await request.json();
    const updatedPoll = updatePoll(params.pollId, body);

    if (!updatedPoll) {
      return NextResponse.json(
        { success: false, error: 'Poll not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedPoll
    });
  } catch (error) {
    console.error('Error updating poll:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update poll' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { pollId: string } }
) {
  try {
    const success = deletePoll(params.pollId);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Poll not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Poll deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting poll:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete poll' },
      { status: 500 }
    );
  }
}

