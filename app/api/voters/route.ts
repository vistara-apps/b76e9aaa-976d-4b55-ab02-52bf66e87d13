import { NextRequest, NextResponse } from 'next/server';
import { Voter, VoterStatus } from '../../../lib/types';
import { generateId } from '../../../lib/utils';
import { addVoter, getVoters, updateVoter } from '../../../lib/store/data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid') || undefined;
    const status = searchParams.get('status') || undefined;

    const filteredVoters = getVoters(fid, status);

    return NextResponse.json({
      success: true,
      data: filteredVoters
    });
  } catch (error) {
    console.error('Error fetching voters:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch voters' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, walletAddress, displayName, statusTags } = body;

    // Validate required fields
    if (!fid) {
      return NextResponse.json(
        { success: false, error: 'Farcaster ID (fid) is required' },
        { status: 400 }
      );
    }

    // Check if voter already exists
    const existingVoters = getVoters(fid);
    if (existingVoters.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Voter with this Farcaster ID already exists' },
        { status: 409 }
      );
    }

    // Create new voter
    const newVoter: Voter = {
      voterId: generateId(),
      fid,
      walletAddress: walletAddress || undefined,
      displayName: displayName || `User ${fid}`,
      statusTags: statusTags || ['registered'],
    };

    // Save voter
    addVoter(newVoter);

    return NextResponse.json({
      success: true,
      data: newVoter
    });
  } catch (error) {
    console.error('Error creating voter:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create voter' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { voterId, ...updates } = body;

    if (!voterId) {
      return NextResponse.json(
        { success: false, error: 'voterId is required' },
        { status: 400 }
      );
    }

    const updatedVoter = updateVoter(voterId, updates);
    if (!updatedVoter) {
      return NextResponse.json(
        { success: false, error: 'Voter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedVoter
    });
  } catch (error) {
    console.error('Error updating voter:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update voter' },
      { status: 500 }
    );
  }
}
