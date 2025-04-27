import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { userId, height, timestamp } = body;

    // Validate that userId exists
    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    // Simulate some backend processing with a delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real application, you would:
    // - Validate the height input value
    // - Store the height in a database
    // - Use height to calculate other body metrics (BMI, etc.)
    // - Potentially combine with other measurements

    // Generate mock measurement data using the provided height if available
    const userHeight = height || 175 + Math.floor(Math.random() * 10);
    const baseWeight = height ? (userHeight - 100) * 0.9 : 70 + Math.floor(Math.random() * 10);

    const mockMeasurements = {
      height: userHeight, // cm
      weight: baseWeight, // kg
      chest: 95 + Math.floor(Math.random() * 5), // cm
      waist: 80 + Math.floor(Math.random() * 5), // cm
      hips: 100 + Math.floor(Math.random() * 5), // cm
      bmi: baseWeight / (userHeight / 100) ** 2, // kg/m²
    };

    // Return a response with the processed data
    return NextResponse.json({
      success: true,
      message: `Body measurements processed successfully for user ${userId}${height ? ' with height: ' + height + ' cm' : ''}`,
      userId,
      height: userHeight,
      timestamp,
      processedAt: new Date().toISOString(),
      measurements: mockMeasurements,
    });
  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process body measurements' },
      { status: 500 }
    );
  }
}
