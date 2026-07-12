// CallMeBot WhatsApp sender.
//
// One-time setup (the user has to do this from their own phone — it can't be
// automated): add +34 644 51 95 23 to contacts, send it the WhatsApp message
// "I allow callmebot to send me messages", then CallMeBot replies with an API key.
// Put that key in CALLMEBOT_APIKEY (and the recipient number in CALLMEBOT_PHONE).

const CALLMEBOT_URL = 'https://api.callmebot.com/whatsapp.php';

export interface WhatsAppSendResult {
  ok: boolean;
  status: number;
  body: string;
}

export async function sendWhatsAppMessage(text: string): Promise<WhatsAppSendResult> {
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;

  if (!phone || !apikey) {
    throw new Error('CALLMEBOT_PHONE / CALLMEBOT_APIKEY not configured');
  }

  const url = `${CALLMEBOT_URL}?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`;
  const res = await fetch(url);
  const body = await res.text();
  return { ok: res.ok, status: res.status, body };
}
