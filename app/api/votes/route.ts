import { NextRequest, NextResponse } from 'next/server';
import { Vote } from '../../../lib/types';
import { generateId } from '../../../lib/utils';
import { addVote, getVotes, hasVoted, getPoll, updatePoll } from '../../../lib/store/data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pollId = searchParams.get('pollId') || undefined;
    const voterFid = searchParams.get('voterFid') || undefined;

    const filteredVotes = getVotes(pollId, voterFid);

    return NextResponse.json({
      success: true,
      data: filteredVotes
    });
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch votes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pollId, voterFid, selectedOption } = body;

    // Validate required fields
    if (!pollId || !voterFid || !selectedOption) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: pollId, voterFid, selectedOption' },
        { status: 400 }
      );
    }

    // Check if voter has already voted in this poll
    if (hasVoted(pollId, voterFid)) {
      return NextResponse.json(
        { success: false, error: 'Voter has already voted in this poll' },
        { status: 409 }
      );
    }

    // Find the poll to validate the option exists
    const poll = getPoll(pollId);
    if (!poll) {
      return NextResponse.json(
        { success: false, error: 'Poll not found' },
        { status: 404 }
      );
    }

    // Validate that the selected option exists in the poll
    const optionExists = poll.options.some((opt: any) => opt.id === selectedOption);
    if (!optionExists) {
      return NextResponse.json(
        { success: false, error: 'Selected option does not exist in this poll' },
        { status: 400 }
      );
    }

    // Create new vote
    const newVote: Vote = {
      voteId: generateId(),
      pollId,
      voterFid,
      selectedOption,
      votedAt: new Date(),
    };

    // Save vote
    addVote(newVote);

    // Update poll vote count
    const updatedOptions = poll.options.map(option =>
      option.id === selectedOption
        ? { ...option, votes: option.votes + 1 }
        : option
    );
    updatePoll(pollId, { options: updatedOptions });

    return NextResponse.json({
      success: true,
      data: newVote
    });
  } catch (error) {
    console.error('Error creating vote:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create vote' },
      { status: 500 }
    );
  }
}
