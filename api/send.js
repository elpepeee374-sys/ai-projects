// Serverless function for Vercel in Node.js
function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
  // Set Strict CORS headers
  const allowedOrigins = ['https://cyprus-elite.com', 'https://www.cyprus-elite.com', 'http://localhost:8080'];
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.cyprus-elite.com');
  }
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json; charset=UTF-8');

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed. Use POST.' });
  }

  try {
    const data = req.body;
    
    // Honeypot check (bot trap)
    if (data && data.website) {
      console.log('Bot detected via honeypot');
      return res.status(200).json({ status: 'success', message: 'Lead data processed.' });
    }
    if (!data || !data.phone) {
      return res.status(400).json({ status: 'error', message: 'Phone number is required.' });
    }

    const name = escapeHtml(data.name || '');
    const phone = escapeHtml(data.phone);
    const email = escapeHtml(data.email || '');
    const contactMethod = escapeHtml(data.contact_method || '');
    const source = escapeHtml(data.source || 'Неизвестная форма');
    const quizAnswers = data.quiz_answers || null;
    const lotDetails = data.lot_details || null;
    const lang = data.lang || 'ru';
    const isEn = lang === 'en';

    const dateStr = new Date().toLocaleString(isEn ? 'en-US' : 'ru-RU', { timeZone: 'Europe/Moscow' });

    // 1. Формирование сообщения для Telegram
    let tgMsg = isEn ? `⚡️ <b>NEW LEAD // CyprusElite</b>\n\n` : `⚡️ <b>НОВАЯ ЗАЯВКА // CyprusElite</b>\n\n`;
    if (name) {
      tgMsg += isEn ? `👤 <b>Name:</b> ${name}\n` : `👤 <b>Имя:</b> ${name}\n`;
    }
    tgMsg += isEn ? `📞 <b>Phone:</b> ${phone}\n` : `📞 <b>Телефон:</b> ${phone}\n`;
    if (email) {
      tgMsg += `✉️ <b>Email:</b> ${email}\n`;
    }
    if (contactMethod) {
      const methodFormatted = contactMethod.charAt(0).toUpperCase() + contactMethod.slice(1);
      tgMsg += isEn ? `📲 <b>Contact via:</b> ${methodFormatted}\n` : `📲 <b>Способ связи:</b> ${methodFormatted}\n`;
    }
    tgMsg += isEn ? `🏷️ <b>Source:</b> ${source}\n\n` : `🏷️ <b>Источник:</b> ${source}\n\n`;

    if (quizAnswers && typeof quizAnswers === 'object') {
      tgMsg += isEn ? `📊 <b>Quiz Answers:</b>\n` : `📊 <b>Ответы на квиз:</b>\n`;
      for (const [question, answer] of Object.entries(quizAnswers)) {
        tgMsg += `• <b>${escapeHtml(question)}:</b> ${escapeHtml(answer)}\n`;
      }
      tgMsg += `\n`;
    }

    if (lotDetails) {
      tgMsg += isEn ? `🏢 <b>Lot Details:</b>\n` : `🏢 <b>Детали лота:</b>\n`;
      if (typeof lotDetails === 'object') {
        for (const [k, v] of Object.entries(lotDetails)) {
          tgMsg += `• <b>${escapeHtml(k)}:</b> ${escapeHtml(v)}\n`;
        }
      } else {
        tgMsg += `${escapeHtml(lotDetails)}\n`;
      }
      tgMsg += `\n`;
    }
    tgMsg += isEn ? `⏱️ <b>Sent Time:</b> ${dateStr}` : `⏱️ <b>Время отправки:</b> ${dateStr}`;

    // 2. Формирование HTML для Email
    const emailHeader = isEn ? 'New Lead // CyprusElite' : 'Новая заявка // CyprusElite';
    const labelName = isEn ? 'Name:' : 'Имя:';
    const labelPhone = isEn ? 'Phone:' : 'Телефон:';
    const labelEmail = 'Email:';
    const labelContactMethod = isEn ? 'Contact via:' : 'Способ связи:';
    const labelSource = isEn ? 'Source:' : 'Источник:';
    const labelQuiz = isEn ? 'Quiz Answers:' : 'Результаты квиза:';
    const labelLot = isEn ? 'Lot Details:' : 'Детали лота:';
    const emailFooterText = isEn 
      ? `Sent time: ${dateStr} | Sent automatically by CyprusElite notification system.` 
      : `Время отправки: ${dateStr} | Отправлено автоматически системой уведомлений CyprusElite.`;

    let emailHtml = `
    <div style='background-color:#0a1628; padding:30px; font-family:sans-serif; color:#ffffff; max-width:600px; margin:0 auto; border-radius:12px; border:1px solid rgba(255,255,255,0.1);'>
        <h2 style='color:#c9a84c; font-weight:normal; margin-top:0; border-bottom:1px solid rgba(201,168,76,0.2); padding-bottom:15px; text-transform:uppercase;'>${emailHeader}</h2>
        <table style='width:100%; border-collapse:collapse; margin-top:15px; margin-bottom:20px;'>`;
    
    if (name) {
      emailHtml += `<tr><td style='padding:8px 0; color:rgba(255,255,255,0.6); width:120px;'>${labelName}</td><td style='padding:8px 0; font-weight:bold; color:#ffffff;'>${name}</td></tr>`;
    }
    emailHtml += `<tr><td style='padding:8px 0; color:rgba(255,255,255,0.6); width:120px;'>${labelPhone}</td><td style='padding:8px 0; font-weight:bold; color:#ffffff;'>${phone}</td></tr>`;
    if (email) {
      emailHtml += `<tr><td style='padding:8px 0; color:rgba(255,255,255,0.6);'>${labelEmail}</td><td style='padding:8px 0; font-weight:bold; color:#ffffff;'>${email}</td></tr>`;
    }
    if (contactMethod) {
      const methodFormatted = contactMethod.charAt(0).toUpperCase() + contactMethod.slice(1);
      emailHtml += `<tr><td style='padding:8px 0; color:rgba(255,255,255,0.6);'>${labelContactMethod}</td><td style='padding:8px 0; font-weight:bold; color:#ffffff;'>${methodFormatted}</td></tr>`;
    }
    emailHtml += `<tr><td style='padding:8px 0; color:rgba(255,255,255,0.6);'>${labelSource}</td><td style='padding:8px 0; color:#c9a84c;'>${source}</td></tr>`;
    emailHtml += `</table>`;

    if (quizAnswers && typeof quizAnswers === 'object') {
      emailHtml += `<h3 style='color:#e2c77f; font-weight:normal; border-top:1px solid rgba(255,255,255,0.1); padding-top:15px; margin-top:15px;'>${labelQuiz}</h3><ul style='padding-left:20px; color:rgba(255,255,255,0.8); line-height:1.6;'>`;
      for (const [question, answer] of Object.entries(quizAnswers)) {
        emailHtml += `<li style='margin-bottom:8px;'><b>${escapeHtml(question)}:</b> ${escapeHtml(answer)}</li>`;
      }
      emailHtml += `</ul>`;
    }

    if (lotDetails) {
      emailHtml += `<h3 style='color:#e2c77f; font-weight:normal; border-top:1px solid rgba(255,255,255,0.1); padding-top:15px; margin-top:15px;'>${labelLot}</h3><ul style='padding-left:20px; color:rgba(255,255,255,0.8); line-height:1.6;'>`;
      if (typeof lotDetails === 'object') {
        for (const [k, v] of Object.entries(lotDetails)) {
          emailHtml += `<li style='margin-bottom:8px;'><b>${escapeHtml(k)}:</b> ${escapeHtml(v)}</li>`;
        }
      } else {
        emailHtml += `<li style='margin-bottom:8px;'>${escapeHtml(lotDetails)}</li>`;
      }
      emailHtml += `</ul>`;
    }

    emailHtml += `
        <div style='font-size:11px; color:rgba(255,255,255,0.4); border-top:1px solid rgba(255,255,255,0.1); padding-top:15px; margin-top:25px;'>
            ${emailFooterText}
        </div>
    </div>`;

    // 3. Отправка в Telegram
    let telegramSent = false;
    const tgToken = process.env.TELEGRAM_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;

    if (tgToken && tgChatId) {
      const chatIds = tgChatId.split(',');
      for (let chatId of chatIds) {
        chatId = chatId.trim();
        if (!chatId) continue;

        try {
          const tgRes = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: tgMsg,
              parse_mode: 'HTML'
            })
          });
          if (tgRes.ok) telegramSent = true;
        } catch (tgErr) {
          console.error('Telegram send error:', tgErr);
        }
      }
    }

    // 4. Отправка на Email через Resend
    let emailSent = false;
    const resendKey = process.env.RESEND_API_KEY;
    const emailTo = process.env.EMAIL_TO || 'info@cypruselite.com, av.studio.sup@gmail.com';
    const emailFrom = process.env.EMAIL_FROM || 'noreply@cypruselite.com';

    if (resendKey) {
      const toEmails = emailTo.split(',').map(e => e.trim()).filter(Boolean);
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendKey}`
          },
          body: JSON.stringify({
            from: `CyprusElite <${emailFrom}>`,
            to: toEmails,
            subject: isEn ? `New lead from CyprusElite website - ${phone}` : `Новая заявка с сайта CyprusElite - ${phone}`,
            html: emailHtml
          })
        });
        if (resendRes.ok) emailSent = true;
      } catch (emailErr) {
        console.error('Email send error:', emailErr);
      }
    }

    return res.status(200).json({
      status: 'success',
      telegram_sent: telegramSent,
      email_sent: emailSent,
      message: 'Lead data processed.'
    });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error.' });
  }
}
