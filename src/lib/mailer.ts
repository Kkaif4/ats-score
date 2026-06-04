import nodemailer from "nodemailer";

const ADMIN_EMAIL = process.env.EMAIL || "igkraken1@gmail.com";

interface FeedbackEmailData {
  name: string;
  email: string;
  message: string;
  telemetry: {
    ip: string;
    userAgent: string;
    os: string;
    browser: string;
    fingerprint?: {
      browserFingerprint?: string;
      screenResolution?: string;
      language?: string;
      timezone?: string;
    };
  };
}

let transporterInstance: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (transporterInstance) {
    return transporterInstance;
  }

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;


  if (host && port && user && pass) {
    // Standard SMTP connection configuration
    transporterInstance = nodemailer.createTransport({
      host,
      port: parseInt(port, 10),
      secure: port === "465", // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });
    console.log("Nodemailer SMTP Transporter initialized successfully with credentials.");
  } else {
    // Ethereal SMTP fallback (Free testing SMTP service)
    console.warn("SMTP credentials not found in env. Creating a free Ethereal Email test account...");
    const testAccount = await nodemailer.createTestAccount();
    transporterInstance = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`Ethereal Email test account created. User: ${testAccount.user}`);
  }

  return transporterInstance;
}

export async function sendFeedbackEmail(data: FeedbackEmailData): Promise<{ messageId: string; previewUrl?: string | false }> {
  const transporter = await getTransporter();

  const mailOptions = {
    from: `"ATS Feedback Agent" <${process.env.SMTP_USER || "feedback@ats-scorer.local"}>`,
    to: ADMIN_EMAIL,
    subject: `New Feedback Submitted by ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f9fafb;">
        <h2 style="color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">New Feedback Received</h2>

        <div style="margin-top: 15px;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p style="white-space: pre-wrap; background: #ffffff; padding: 12px; border-left: 4px solid #3b82f6; border-radius: 4px;">${data.message}</p>
        </div>

        <h3 style="color: #4b5563; border-bottom: 1px solid #d1d5db; padding-bottom: 6px; margin-top: 25px;">Client Systemic Telemetry</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr style="background-color: #f3f4f6;">
            <th style="text-align: left; padding: 8px; border: 1px solid #e5e7eb;">Parameter</th>
            <th style="text-align: left; padding: 8px; border: 1px solid #e5e7eb;">Value</th>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">IP Address</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace;">${data.telemetry.ip}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Operating System</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.telemetry.os}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Browser</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${data.telemetry.browser}</td>
          </tr>
          <tr style="background-color: #f9fafb;">
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">User Agent</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 11px; font-family: monospace; word-break: break-all;">${data.telemetry.userAgent}</td>
          </tr>
          ${data.telemetry.fingerprint ? `
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Browser Fingerprint ID</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace;">${data.telemetry.fingerprint.browserFingerprint || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">Device Environment</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px;">
              <strong>Resolution:</strong> ${data.telemetry.fingerprint.screenResolution || 'N/A'}<br/>
              <strong>Language:</strong> ${data.telemetry.fingerprint.language || 'N/A'}<br/>
              <strong>Timezone:</strong> ${data.telemetry.fingerprint.timezone || 'N/A'}
            </td>
          </tr>
          ` : ''}
        </table>

        <p style="margin-top: 25px; font-size: 12px; color: #9ca3af; text-align: center;">
          Sent automatically at ${new Date().toISOString()}
        </p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  // Retrieve the test preview URL if using Ethereal account
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`[TEST EMAIL SENT] View message details: ${previewUrl}`);
  }

  return {
    messageId: info.messageId,
    previewUrl,
  };
}
