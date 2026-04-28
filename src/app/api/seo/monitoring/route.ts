import { NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(request: Request) {
  try {
    const { event, path, userAgent } = await request.json();

    if (event === '404_DETECTED') {
      const message = `⚠️ *Broken Link Detected (404)*\n\n*Path:* \`${path}\` \n*Device:* ${userAgent}`;
      await sendTelegramNotification(message, "404 Monitor");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Monitoring API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
