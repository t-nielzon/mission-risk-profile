import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { MRPFormData, MRPResults } from "@/types";
import fs from "fs";
import path from "path";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { questions } from "@/data/questions";

// Gmail SMTP configuration
const SMTP_CONFIG = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail app password
  },
};

export async function POST(request: NextRequest) {
  try {
    const {
      formData,
      results,
      emails,
    }: {
      formData: MRPFormData;
      results: MRPResults;
      emails: string[];
    } = await request.json();

    if (!emails || emails.length === 0) {
      return NextResponse.json(
        { error: "No email addresses provided" },
        { status: 400 }
      );
    }

    // generate the Word document
    const templatePath = path.join(
      process.cwd(),
      "templates",
      "mrp_template.docx"
    );

    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        { error: "Template file not found" },
        { status: 404 }
      );
    }

    const templateBuffer = fs.readFileSync(templatePath);
    const zip = new PizZip(templateBuffer);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // prepare template data
    const templateData = prepareTemplateData(formData, results);

    // render the document
    doc.render(templateData);

    // generate the final document
    const documentBuffer = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    // create Nodemailer transporter
    const transporter = nodemailer.createTransport(SMTP_CONFIG);

    // generate filename
    const fileName = `MRP_${formData.missionDetails.callsign}_${
      new Date().toISOString().split("T")[0]
    }.docx`;

    // prepare HTML email content
    const htmlContent = generateEmailHTML(formData, results);

    // send email with attachment using Nodemailer
    const mailOptions = {
      from: `"Mission Risk Profile System" <${process.env.GMAIL_USER}>`,
      to: emails.join(", "),
      subject: `Mission Risk Profile Complete - ${formData.missionDetails.callsign} - ${formData.missionDetails.lesson}`,
      html: htmlContent,
      attachments: [
        {
          filename: fileName,
          content: documentBuffer,
          contentType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
      ],
    };

    const response = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully with attachment:", response.messageId);

    return NextResponse.json({
      message: "Email sent successfully with attachment",
      messageId: response.messageId,
    });
  } catch (error) {
    console.error("Error sending email with attachment:", error);
    return NextResponse.json(
      { error: "Failed to send email with attachment" },
      { status: 500 }
    );
  }
}

function prepareTemplateData(
  formData: MRPFormData,
  results: MRPResults
): Record<string, string | number> {
  const data: Record<string, string | number> = {};

  // add mission details
  Object.entries(formData.missionDetails).forEach(([key, value]) => {
    data[key] = value || "";
  });

  // process question answers and map to placeholders
  questions.forEach((question) => {
    const answer = formData.answers[question.id];

    if (question.type === "individual") {
      // handle individual questions
      if (question.placeholders.pic) {
        data[question.placeholders.pic] = answer?.picAnswer?.toString() || "0";
      }
      if (question.placeholders.cp) {
        data[question.placeholders.cp] = answer?.cpAnswer?.toString() || "0";
      }
    } else if (question.type === "shared") {
      // handle shared questions
      if (question.placeholders.shared) {
        data[question.placeholders.shared] =
          answer?.sharedAnswer?.toString() || "0";
      }
    } else if (question.type === "custom") {
      // handle custom hazards
      if (question.placeholders.shared) {
        const hazardKey = question.placeholders
          .shared as keyof typeof formData.customHazards;
        const hazard = formData.customHazards[hazardKey];
        data[question.placeholders.shared] =
          hazard?.riskLevel.toString() || "0";
      }
      if (question.placeholders.pic) {
        const hazard = formData.customHazards.pic_other;
        data[question.placeholders.pic] = hazard?.riskLevel.toString() || "0";
      }
      if (question.placeholders.cp) {
        const hazard = formData.customHazards.cp_other;
        data[question.placeholders.cp] = hazard?.riskLevel.toString() || "0";
      }
    }
  });

  // add calculated scores and MDA
  data.pic_mrp = results.scores.pic.toString();
  data.cp_mrp = results.scores.cp.toString();
  data.pic_mda = results.mda.pic;
  data.cp_mda = results.mda.cp;

  // add comments
  data.comments = formData.comments || "";

  return data;
}

// generate HTML email content
function generateEmailHTML(formData: MRPFormData, results: MRPResults): string {
  return `
    <div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1e40af 0%, #0891b2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Mission Risk Profile</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Assessment Complete</p>
      </div>

      <!-- Content -->
      <div style="padding: 30px 20px;">
        
        <!-- Mission Details Section -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e40af; font-size: 18px; margin: 0 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Mission Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 30%;">Callsign:</td>
              <td style="padding: 8px 0; color: #1f2937;">${
                formData.missionDetails.callsign
              }</td>
            </tr>
            <tr style="background-color: #f9fafb;">
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Aircraft:</td>
              <td style="padding: 8px 0; color: #1f2937;">${
                formData.missionDetails.ac_nr
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">PIC:</td>
              <td style="padding: 8px 0; color: #1f2937;">${
                formData.missionDetails.pic_name
              }</td>
            </tr>
            <tr style="background-color: #f9fafb;">
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">CP:</td>
              <td style="padding: 8px 0; color: #1f2937;">${
                formData.missionDetails.cp_name
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Lesson:</td>
              <td style="padding: 8px 0; color: #1f2937;">${
                formData.missionDetails.lesson
              }</td>
            </tr>
            <tr style="background-color: #f9fafb;">
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Area:</td>
              <td style="padding: 8px 0; color: #1f2937;">${
                formData.missionDetails.area_assignment
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Date/Time:</td>
              <td style="padding: 8px 0; color: #1f2937;">${
                formData.missionDetails.date_time
              }</td>
            </tr>
          </table>
        </div>

        <!-- Risk Assessment Results -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #dc2626; font-size: 18px; margin: 0 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Risk Assessment Results</h2>
          
          <div style="display: flex; gap: 20px; margin-bottom: 20px;">
            <!-- PIC Results -->
            <div style="flex: 1; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
              <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">Pilot-in-Command</h3>
              <div style="font-size: 24px; font-weight: bold; color: #1e40af; margin-bottom: 5px;">${
                results.scores.pic
              } points</div>
              <div style="background-color: #2563eb; color: white; padding: 6px 12px; border-radius: 20px; display: inline-block; font-size: 12px; font-weight: bold;">MDA: ${
                results.mda.pic
              }</div>
            </div>
            
            <!-- CP Results -->
            <div style="flex: 1; background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #16a34a;">
              <h3 style="color: #15803d; margin: 0 0 10px 0; font-size: 16px;">Co-Pilot</h3>
              <div style="font-size: 24px; font-weight: bold; color: #15803d; margin-bottom: 5px;">${
                results.scores.cp
              } points</div>
              <div style="background-color: #16a34a; color: white; padding: 6px 12px; border-radius: 20px; display: inline-block; font-size: 12px; font-weight: bold;">MDA: ${
                results.mda.cp
              }</div>
            </div>
          </div>
        </div>

        <!-- Comments Section -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #7c2d12; font-size: 18px; margin: 0 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Comments & Remarks</h2>
          <div style="background-color: #fef7ff; border: 1px solid #e9d5ff; border-radius: 6px; padding: 15px; color: #581c87; font-style: italic;">
            ${formData.comments || "No additional comments"}
          </div>
        </div>

        <!-- Document Attachment Notice -->
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 6px; padding: 15px; text-align: center;">
          <p style="margin: 0; color: #0c4a6e; font-weight: bold;">📎 Complete Mission Risk Profile document is attached to this email</p>
        </div>

      </div>

      <!-- Footer -->
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 0 0 8px 8px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #6b7280; font-size: 12px;">Generated by Mission Risk Profile Planner</p>
        <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 12px; font-weight: bold;">Philippine Air Force Flying School - 101st Pilot Training Squadron</p>
      </div>

    </div>
  `;
}
