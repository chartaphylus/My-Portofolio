import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramBotToken && telegramChatId) {
      const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
      const text = `🔔 *New Message on Portfolio*\n\n*Name:* ${name}\n*Email:* ${email}\n\n*Message:*\n${message}`;

      try {
        await fetch(telegramApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: text,
            parse_mode: 'Markdown'
          })
        });
      } catch (telegramError) {
        // We do not fail the request if Telegram fails, just log it.
        console.error('Telegram API Error:', telegramError);
      }
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully.' });

  } catch (err: any) {
    console.error('Contact API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
