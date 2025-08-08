import { NextRequest, NextResponse } from "next/server";
// import { generateDocument } from "@/lib/document-generator";
import { MRPFormData, MRPResults } from "@/types";
import fs from "fs";
import path from "path";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { questions } from "@/data/questions";

export async function POST(request: NextRequest) {
  try {
    const {
      formData,
      results,
    }: { formData: MRPFormData; results: MRPResults } = await request.json();

    // read the template file from the templates folder
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
    const outputBuffer = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    // return the document as a response
    return new NextResponse(new Uint8Array(outputBuffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="MRP_${
          formData.missionDetails.callsign
        }_${new Date().toISOString().split("T")[0]}.docx"`,
      },
    });
  } catch (error) {
    console.error("Error generating document:", error);
    return NextResponse.json(
      { error: "Failed to generate document" },
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
        data[question.placeholders.pic] =
          answer?.overrideScore !== undefined
            ? answer.overrideScore.toString()
            : answer?.picAnswer?.toString() || "0";
      }
      if (question.placeholders.cp) {
        data[question.placeholders.cp] =
          answer?.overrideScore !== undefined
            ? answer.overrideScore.toString()
            : answer?.cpAnswer?.toString() || "0";
      }
    } else if (question.type === "shared") {
      // handle shared questions
      if (question.placeholders.shared) {
        data[question.placeholders.shared] =
          answer?.overrideScore !== undefined
            ? answer.overrideScore.toString()
            : answer?.sharedAnswer?.toString() || "0";
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
