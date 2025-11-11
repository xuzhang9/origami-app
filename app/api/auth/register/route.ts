import { NextRequest, NextResponse } from 'next/server';
import { verifyFamilyCode, generateDeviceToken } from '@/lib/auth';
import { createDevice } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { familyCode, deviceName } = await request.json();

    // Verify family code
    if (!verifyFamilyCode(familyCode)) {
      return NextResponse.json(
        { error: 'Invalid family code. Please check and try again!' },
        { status: 401 }
      );
    }

    // Generate device token
    const deviceToken = generateDeviceToken();

    // Create device in database
    try {
      await createDevice(deviceToken, deviceName);
    } catch (dbError) {
      console.error('Database error:', dbError);
      // If database fails, still return token (app can work without DB)
      return NextResponse.json({
        success: true,
        deviceToken,
        message: 'Device registered successfully (local mode)',
      });
    }

    return NextResponse.json({
      success: true,
      deviceToken,
      message: 'Device registered successfully!',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register device. Please try again.' },
      { status: 500 }
    );
  }
}
