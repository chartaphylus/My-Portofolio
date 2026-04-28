/**
 * Telegram Utility for Portfolio Notifications & Webhook handling
 */

export async function sendTelegramNotification(message: string, source: string = "System") {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return false;

  const prefix = "🛡️ *SEO Health Monitor Portfolio*";
  const fullMessage = `${prefix}\n*Source:* ${source}\n\n${message}`;

  return sendRawTelegramMessage(chatId, fullMessage);
}

export async function sendTelegramMenu(chatId: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return false;

  const text = "👋 *Halo! Saya Bot Monitor Portfolio Anda.*\n\nSilakan pilih website yang ingin Anda cek:";
  const keyboard = {
    inline_keyboard: [
      [
        { text: "🛡️ Cek Kesehatan Portfolio", callback_data: "check_health_portfolio" }
      ],
      [
        { text: "🌐 Website Lain (Coming Soon)", callback_data: "other_websites" }
      ]
    ]
  };

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
        reply_markup: keyboard
      }),
    });
    return true;
  } catch (error) {
    console.error("Error sending Telegram menu:", error);
    return false;
  }
}

export async function sendRawTelegramMessage(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return false;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
      }),
    });
    return true;
  } catch (error) {
    console.error("Error sending raw Telegram message:", error);
    return false;
  }
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return false;

  try {
    await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text,
      }),
    });
    return true;
  } catch (error) {
    console.error("Error answering callback query:", error);
    return false;
  }
}
