import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string[];
  subject: string;
  documentBuffer: Buffer;
  fileName: string;
  missionDetails: {
    callsign: string;
    pic_name: string;
    cp_name: string;
    lesson: string;
    date_time: string;
  };
}

export async function sendMRPDocument(options: EmailOptions): Promise<boolean> {
  try {
    const { to, subject, documentBuffer, fileName, missionDetails } = options;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Mission Risk Profile Document</h2>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Mission Details:</h3>
          <ul style="color: #6b7280;">
            <li><strong>Callsign:</strong> ${missionDetails.callsign}</li>
            <li><strong>PIC:</strong> ${missionDetails.pic_name}</li>
            <li><strong>CP:</strong> ${missionDetails.cp_name}</li>
            <li><strong>Lesson:</strong> ${missionDetails.lesson}</li>
            <li><strong>Date & Time:</strong> ${missionDetails.date_time}</li>
          </ul>
        </div>

        <p style="color: #6b7280;">
          Please find the completed Mission Risk Profile document attached to this email.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #9ca3af; font-size: 14px;">
          This email was generated automatically by the Mission Risk Profile Planner.<br>
          Philippine Air Force Flying School - 101st Pilot Training Squadron
        </p>
      </div>
    `;

    const result = await resend.emails.send({
      from: "MRP Planner <onboarding@resend.dev>",
      to: ["nielzon.t@gmail.com"], // Free plan limitation - only send to verified email
      subject: `${subject} - Recipients: ${to.join(", ")}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Mission Risk Profile Report</h2>
          <p><strong>Note:</strong> This email was sent to the verified sender address due to Resend free plan limitations.</p>
          <p><strong>Original Recipients:</strong> ${to.join(", ")}</p>
          <hr style="margin: 20px 0;">
          ${htmlContent}
          <hr style="margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            To send emails to other recipients, please verify a domain at resend.com/domains.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: fileName,
          content: documentBuffer,
        },
      ],
    });

    console.log("Email sent successfully:", result);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

export function generateEmailSubject(missionDetails: {
  callsign: string;
  lesson: string;
  date_time: string;
}): string {
  const date = new Date(missionDetails.date_time).toLocaleDateString();
  return `Mission Risk Profile - ${missionDetails.callsign} - ${missionDetails.lesson} - ${date}`;
}

export function generateFileName(missionDetails: {
  callsign: string;
  date_time: string;
}): string {
  const date = new Date(missionDetails.date_time).toISOString().split("T")[0];
  return `MRP_${missionDetails.callsign}_${date}.docx`;
}
