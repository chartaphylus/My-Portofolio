import { NextResponse } from 'next/server';
import { sendTelegramMenu, sendRawTelegramMessage, answerCallbackQuery, sendTelegramNotification } from '@/lib/telegram';
import { runHealthCheck } from '@/lib/seo-health';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!chatId) {
      console.error("TELEGRAM_CHAT_ID is not defined in environment variables");
      return NextResponse.json({ status: 'error', message: 'Configuration missing' });
    }

    // Security: Only respond to authorized chat ID
    const incomingChatId = body.message?.chat?.id?.toString() || body.callback_query?.from?.id?.toString();
    
    if (incomingChatId !== chatId) {
      console.warn(`Unauthorized access attempt from Chat ID: ${incomingChatId}`);
      return NextResponse.json({ status: 'unauthorized' });
    }

    // 1. Handle Callback Queries (Button Clicks)
    if (body.callback_query) {
      const callbackData = body.callback_query.data;
      const callbackQueryId = body.callback_query.id;

      if (callbackData === 'check_health_portfolio') {
        await answerCallbackQuery(callbackQueryId, "Sedang mengecek kesehatan...");
        const { message } = await runHealthCheck();
        await sendTelegramNotification(message, "Telegram Bot", "system");
      } else if (callbackData === 'other_websites') {
        await answerCallbackQuery(callbackQueryId, "Fitur ini segera hadir!");
        await sendRawTelegramMessage(chatId, "🚧 *Fitur Website Lain* akan segera hadir di update berikutnya.");
      }
      return NextResponse.json({ status: 'success' });
    }

    // 2. Handle Text Commands
    const text = body.message?.text;

    if (text === '/start' || text === '/menu') {
      await sendTelegramMenu(chatId);
    } else if (text === '/health') {
      const { message } = await runHealthCheck();
      await sendTelegramNotification(message, "Telegram Bot", "system");
    } else if (text) {
      await sendRawTelegramMessage(chatId, "Pilih opsi di bawah ini untuk memulai:");
      await sendTelegramMenu(chatId);
    }

    return NextResponse.json({ status: 'success' });
  } catch (err) {
    console.error('Telegram Webhook Error:', err);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
