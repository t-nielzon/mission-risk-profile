import { MRPFormData, MRPResults, MDALevel, RiskLevel } from "../types";
import { questions } from "../data/questions";

export function calculateMRPScores(formData: MRPFormData): MRPResults {
  let picScore = 0;
  let cpScore = 0;

  // process regular question answers
  questions.forEach((question) => {
    const answer = formData.answers[question.id];
    if (!answer || (!answer.answered && !answer.skipped)) return;

    // handle override scores first
    if (answer.overrideScore !== undefined) {
      if (question.type === "individual") {
        picScore += answer.overrideScore;
        cpScore += answer.overrideScore;
      } else if (question.type === "shared") {
        picScore += answer.overrideScore;
        cpScore += answer.overrideScore;
      }
      return;
    }

    // handle normal scoring
    if (question.type === "individual") {
      if (answer.picAnswer !== undefined) {
        picScore += answer.picAnswer;
      }
      if (answer.cpAnswer !== undefined) {
        cpScore += answer.cpAnswer;
      }
    } else if (question.type === "shared") {
      if (answer.sharedAnswer !== undefined) {
        picScore += answer.sharedAnswer;
        cpScore += answer.sharedAnswer;
      }
    }
  });

  // add custom hazard scores
  Object.entries(formData.customHazards).forEach(([key, hazard]) => {
    if (hazard) {
      if (key === "pic_other") {
        picScore += hazard.riskLevel;
      } else if (key === "cp_other") {
        cpScore += hazard.riskLevel;
      } else {
        // shared custom hazards affect both pilots
        picScore += hazard.riskLevel;
        cpScore += hazard.riskLevel;
      }
    }
  });

  return {
    scores: {
      pic: picScore,
      cp: cpScore,
    },
    mda: {
      pic: getMDALevel(picScore),
      cp: getMDALevel(cpScore),
    },
  };
}

export function getMDALevel(score: number): MDALevel {
  if (score <= 8) return "PIC";
  if (score <= 15) return "SUP";
  if (score <= 20) return "SC";
  return "CMDT";
}

export function getRiskLevelColor(level: RiskLevel): string {
  switch (level) {
    case 0:
      return "bg-green-500 text-white";
    case 1:
      return "bg-yellow-500 text-black";
    case 2:
      return "bg-red-500 text-white";
    default:
      return "bg-gray-300 text-black";
  }
}

export function getRiskLevelText(level: RiskLevel): string {
  switch (level) {
    case 0:
      return "Green (0 pts)";
    case 1:
      return "Yellow (1 pt)";
    case 2:
      return "Red (2 pts)";
    default:
      return "Not Set";
  }
}

export function getMDAColor(mda: MDALevel): string {
  switch (mda) {
    case "PIC":
      return "bg-green-500 text-white";
    case "SUP":
      return "bg-yellow-500 text-black";
    case "SC":
      return "bg-orange-500 text-white";
    case "CMDT":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-300 text-black";
  }
}
