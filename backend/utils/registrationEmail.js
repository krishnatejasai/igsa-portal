const QRCode = require('qrcode');
const Registration = require('../models/Registration');
const configured = () => Boolean(process.env.RESEND_API_KEY && process.env.EVENT_EMAIL_FROM);
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

// Stored with the registration so delivery survives restarts and does not delay signup.
function emailFields(event) {
  return {
    emailStatus: 'pending', emailNextAttempt: new Date(), emailAttempts: 0,
    emailSnapshot: {
      title: event.title, date: event.date, time: event.time, location: event.location,
      message: event.confirmationMessage || 'Thank you for registering. We look forward to seeing you!',
    },
  };
}

async function buildEmail(registration) {
  const event = registration.emailSnapshot;
  const qr = await QRCode.toBuffer(registration.qrCode, { width: 440, margin: 4, errorCorrectionLevel: 'H' });
  const details = `${event.date} · ${event.time} (Gainesville time)\n${event.location}`;
  return {
    from: process.env.EVENT_EMAIL_FROM,
    to: [registration.email], reply_to: 'igsa.uf@gmail.com',
    subject: `Your IGSA ticket: ${event.title}`.replace(/[\r\n]/g, ' '),
    text: `Hi ${registration.name},\n\nYou're registered for ${event.title}.\n${details}\n\n${event.message}\n\nYour QR ticket is attached. Show it at check-in.\nTicket: ${registration.qrCode}\n\nIGSA UF\nhttps://www.igsauf.us\nigsa.uf@gmail.com`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#003f7d;border-top:6px solid #ff9933;padding:24px"><h1>You're on the list!</h1><p>Hi ${escape(registration.name)},</p><h2>${escape(event.title)}</h2><p>${escape(details).replace(/\n/g, '<br>')}</p><p>${escape(event.message).replace(/\n/g, '<br>')}</p><p>Save the attached QR ticket and show it at check-in.</p><img src="cid:igsa-ticket" width="220" height="220" alt="Your event check-in QR code"><p>Ticket: ${escape(registration.qrCode)}</p><hr><p>IGSA UF · <a href="https://www.igsauf.us">igsauf.us</a><br>Questions? <a href="mailto:igsa.uf@gmail.com">igsa.uf@gmail.com</a></p></div>`,
    attachments: [{ filename: 'IGSA-event-ticket.png', content: qr.toString('base64'), content_type: 'image/png', content_id: 'igsa-ticket' }],
  };
}

let busy = false;
async function processNextEmail() {
  if (busy || !configured()) return;
  busy = true;
  let job;
  try {
    const now = new Date();
    job = await Registration.findOneAndUpdate({
      status: 'registered', emailStatus: { $in: ['pending', 'sending'] },
      emailNextAttempt: { $lte: now },
    }, { $set: { emailStatus: 'sending', emailNextAttempt: new Date(Date.now() + 120000) }, $inc: { emailAttempts: 1 } }, { new: true, sort: { emailNextAttempt: 1 } }).select('+emailSnapshot');
    if (!job) return;
    // Do not retry outside the provider's 24-hour deduplication window.
    if (job.emailAttempts > 8 || (job.emailFirstAttempt && now - job.emailFirstAttempt > 23 * 3600000)) {
      await Registration.updateOne({ _id: job._id }, { $set: { emailStatus: 'failed' } });
      return;
    }
    if (!job.emailFirstAttempt) {
      await Registration.updateOne({ _id: job._id }, { $set: { emailFirstAttempt: now } });
    }
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(15000),
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `registration-${job._id}` },
      body: JSON.stringify(await buildEmail(job)),
    });
    if (!response.ok) throw new Error('Email provider did not accept the ticket');
    await Registration.updateOne({ _id: job._id }, { $set: { emailStatus: 'sent', emailSentAt: new Date() }, $unset: { emailSnapshot: 1 } });
  } catch {
    if (job) await Registration.updateOne({ _id: job._id }, { $set: {
      emailStatus: job.emailAttempts >= 8 ? 'failed' : 'pending',
      emailNextAttempt: new Date(Date.now() + Math.min(3600000, 30000 * 2 ** job.emailAttempts)),
    } }).catch(() => {});
    console.error('Event email delivery deferred; check email configuration and provider logs.');
  } finally { busy = false; }
}

function startEmailWorker() {
  const timer = setInterval(processNextEmail, 2000);
  timer.unref();
}
module.exports = { configured, emailFields, buildEmail, processNextEmail, startEmailWorker };
