import { NextRequest, NextResponse } from 'next/server';
import { Poll, PollOption } from '../../../lib/types';
import { generateId, validatePollData } from '../../../lib/utils';
import { addPoll, getPolls } from '../../../lib/store/data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizerFid = searchParams.get('organizerFid') || undefined;
    const status = searchParams.get('status') || undefined;

    const filteredPolls = getPolls(organizerFid, status);

    return NextResponse.json({
      success: true,
      data: filteredPolls
    });
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch polls' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, options, organizerFid, eligibleVoters } = body;

    // Validate input
    const validationError = validatePollData(title, options);
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    // Create poll options
    const pollOptions: PollOption[] = options
      .filter((opt: string) => opt.trim())
      .map((opt: string) => ({
        id: generateId(),
        text: opt.trim(),
        votes: 0,
      }));

    // Create new poll
    const newPoll: Poll = {
      pollId: generateId(),
      organizerFid: organizerFid || 'anonymous',
      title: title.trim(),
      description: description?.trim() || '',
      options: pollOptions,
      createdAt: new Date(),
      status: 'active',
      eligibleVoters,
    };

    // Save poll
    addPoll(newPoll);

    return NextResponse.json({
      success: true,
      data: newPoll
    });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create poll' },
      { status: 500 }
    );
  }
}
