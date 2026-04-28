import { NextResponse } from 'next/server';
import { runHealthCheck } from '@/lib/seo-health';
import { sendTelegramNotification } from '@/lib/telegram';

export async function GET() {
  try {
    const { isHealthy, message, report } = await runHealthCheck();
    
    await sendTelegramNotification(message, "Health Check API", "system");

    return NextResponse.json({ 
      status: isHealthy ? 'healthy' : 'degraded',
      report: report 
    });

  } catch (err) {
    console.error('Health Check Route Error:', err);
    return NextResponse.json({ status: 'error', error: 'Internal Server Error' }, { status: 500 });
  }
}
