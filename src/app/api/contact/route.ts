import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    // 1. Insert into Supabase
    const { error: dbError } = await supabase.from('messages').insert([
      { name, email, message }
    ]);

    if (dbError) {
      console.error('Supabase Insert Error:', dbError);
      return NextResponse.json({ error: 'Failed to save message to database.' }, { status: 500 });
    }

    // 2. Send Telegram Notification (if configured)
    const text = `🔔 *New Message Received*\n\n*Name:* ${name}\n*Email:* ${email}\n\n*Message:*\n${message}`;
    await sendTelegramNotification(text, "Contact Form");

    return NextResponse.json({ success: true, message: 'Message sent successfully.' });

  } catch (err: any) {
    console.error('Contact API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
