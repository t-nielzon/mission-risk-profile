import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { MRPFormData, MRPResults } from "../types";
import { questions } from "../data/questions";

export async function generateDocument(
  formData: MRPFormData,
  results: MRPResults
): Promise<Buffer> {
  try {
    // read the template file from the templates folder
    const templatePath = "/templates/mrp_template.docx";
    const response = await fetch(templatePath);

    if (!response.ok) {
      throw new Error("Failed to load template file");
    }

    const arrayBuffer = await response.arrayBuffer();
    const zip = new PizZip(arrayBuffer);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // prepare template data
    const templateData = prepareTemplateData(formData, results);

    // render the document
    doc.render(templateData);

    // generate the final document
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    return buf;
  } catch (error) {
    console.error("Error generating document:", error);
    throw new Error("Failed to generate document");
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

// helper function for client-side document generation
export async function generateDocumentClientSide(
  formData: MRPFormData,
  results: MRPResults
): Promise<Blob> {
  try {
    const response = await fetch("/api/generate-document", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ formData, results }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate document");
    }

    return await response.blob();
  } catch (error) {
    console.error("Error generating document:", error);
    throw error;
  }
}
