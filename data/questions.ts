import { QuestionDefinition } from "../types";

export const questions: QuestionDefinition[] = [
  // MISSION CATEGORY
  {
    id: "short_notice",
    category: "mission",
    question: "Short notice for Mission Change?",
    type: "individual",
    options: {
      green: "N/A",
      yellow: ">1 hour notice",
      red: "<1 hour notice",
    },
    placeholders: {
      pic: "pic_shortnotice",
      cp: "cp_shortnotice",
    },
  },
  {
    id: "unfamiliar_airfield",
    category: "mission",
    question: "Unfamiliar Airfield?",
    type: "shared",
    options: {
      green: "Both pilots familiar",
      yellow: "1 pilot unfamiliar",
      red: "Both pilots unfamiliar",
    },
    placeholders: {
      shared: "unfamiliar_airfield",
    },
  },
  {
    id: "uncontrolled_field",
    category: "mission",
    question: "Uncontrolled airfield?",
    type: "shared",
    options: {
      green: "N/A",
      yellow: "Yes",
    },
    placeholders: {
      shared: "uncontrolled_airfield",
    },
  },
  {
    id: "area_assignment",
    category: "mission",
    question: "Area Assignment",
    type: "shared",
    options: {
      green: "Overland",
      yellow: "Half Land, Half water",
      red: "Bodies of water not within gliding distance / High Terrain & Obstacles",
    },
    placeholders: {
      shared: "risk_area_assignment",
    },
  },
  {
    id: "test_flight",
    category: "mission",
    question: "Test Flight?",
    type: "shared",
    options: {
      green: "N/A",
      yellow: "FCF/LTF",
      red: "GTF/MTF",
    },
    placeholders: {
      shared: "test_flight",
    },
  },
  {
    id: "lesson_type",
    category: "mission",
    question: "Lesson",
    type: "shared",
    options: {
      green: "N/A",
      yellow: "Taxiing, CP Maneuvers, Instruments",
      red: "Formation, Touch-and-Go, AM",
    },
    placeholders: {
      shared: "risk_lesson",
    },
  },
  {
    id: "other_hazard_mission",
    category: "mission",
    question: "Other identified hazard",
    type: "custom",
    options: {
      green: "Custom input",
    },
    placeholders: {
      shared: "other_hazard_mission",
    },
  },

  // ENVIRONMENT CATEGORY
  {
    id: "clouds_enroute",
    category: "environment",
    question: "Clouds Enroute",
    type: "shared",
    options: {
      green: "CAVOK/Few",
      yellow: "Scattered/Broken",
      red: "Overcast",
    },
    placeholders: {
      shared: "clouds_enroute",
    },
  },
  {
    id: "temperature",
    category: "environment",
    question: "Temperature",
    type: "shared",
    options: {
      green: "<28°C",
      yellow: "29°C to 33°C",
      red: ">34°C",
    },
    placeholders: {
      shared: "temperature",
    },
  },
  {
    id: "gustiness",
    category: "environment",
    question: "Gustiness",
    type: "shared",
    options: {
      green: "No gusts",
      yellow: "≤10 kts",
      red: ">10 kts",
    },
    placeholders: {
      shared: "gustiness",
    },
  },
  {
    id: "crosswind",
    category: "environment",
    question: "Crosswind at Landing Aerodrome",
    type: "shared",
    options: {
      green: "≤5 kts",
      yellow: "6 to 12 kts",
      red: ">12 kts",
    },
    placeholders: {
      shared: "crosswind",
    },
  },
  {
    id: "cloud_ceiling",
    category: "environment",
    question: "Cloud Ceiling at Landing Aerodrome",
    type: "shared",
    options: {
      green: "Unlimited",
      yellow: "≤ 1500' AGL",
      red: "≤ 800' AGL",
    },
    placeholders: {
      shared: "cloud_ceiling",
    },
  },
  {
    id: "visibility",
    category: "environment",
    question: "Visibility",
    type: "shared",
    options: {
      green: "CAVOK",
      yellow: "5 miles",
      red: "≤3 miles",
    },
    placeholders: {
      shared: "visibility",
    },
  },
  {
    id: "runway_condition",
    category: "environment",
    question: "Runway Condition Report",
    type: "shared",
    options: {
      green: "Dry",
      yellow: "Wet",
      red: "Standing Water",
    },
    placeholders: {
      shared: "rwy_condition",
    },
  },
  {
    id: "birds_condition",
    category: "environment",
    question: "Birds Condition",
    type: "shared",
    options: {
      green: "Low",
      yellow: "Medium",
      red: "High",
    },
    placeholders: {
      shared: "birds_condition",
    },
  },
  {
    id: "kites_condition",
    category: "environment",
    question: "Kites Condition",
    type: "shared",
    options: {
      green: "Low",
      yellow: "Medium",
      red: "High",
    },
    placeholders: {
      shared: "kites_condition",
    },
  },
  {
    id: "other_hazard_environment",
    category: "environment",
    question: "Other identified hazard",
    type: "custom",
    options: {
      green: "Custom input",
    },
    placeholders: {
      shared: "other_hazard_environment",
    },
  },

  // HUMAN FACTOR CATEGORY
  {
    id: "last_sortie",
    category: "human_factor",
    question: "Last Sortie",
    type: "individual",
    options: {
      green: "<7 days",
      yellow: "7 to 14 days",
      red: ">14 days",
    },
    placeholders: {
      pic: "pic_last_sortie",
      cp: "cp_last_sortie",
    },
  },
  {
    id: "ip_experience",
    category: "human_factor",
    question: "IP and Student Experience Level",
    type: "individual",
    options: {
      green: ">500 hrs",
      yellow: "100 to 500 hrs",
      red: "≤100 hrs IP",
    },
    placeholders: {
      pic: "pic_ip_hours",
      cp: "cp_ip_hours",
    },
  },
  {
    id: "sorties_flown",
    category: "human_factor",
    question: "Number of sorties flown",
    type: "individual",
    options: {
      green: "0 sortie",
      yellow: "1-2 sorties",
      red: "≥ 3 sorties",
    },
    placeholders: {
      pic: "pic_sorties",
      cp: "cp_sorties",
    },
  },
  {
    id: "sleep_cycle",
    category: "human_factor",
    question: "Sleep Cycle",
    type: "individual",
    options: {
      green: "Well rested (≥8 hours)",
      yellow: "Minimum rest (4 to 8 hours)",
      red: "Sleep deprived (<4 hours)",
    },
    placeholders: {
      pic: "pic_sleep",
      cp: "cp_sleep",
    },
  },
  {
    id: "personal_factor",
    category: "human_factor",
    question: "Personal Factor",
    type: "individual",
    options: {
      green: "None",
      yellow: "At least 1",
      red: "At least 2",
    },
    placeholders: {
      pic: "pic_personal",
      cp: "cp_personal",
    },
  },
  {
    id: "fatigue",
    category: "human_factor",
    question: "Fatigue",
    type: "individual",
    options: {
      green: "Low",
      yellow: "Moderate",
      red: "Extreme",
    },
    placeholders: {
      pic: "pic_fatigue",
      cp: "cp_fatigue",
    },
  },
  {
    id: "stress",
    category: "human_factor",
    question: "Stress",
    type: "individual",
    options: {
      green: "Low",
      yellow: "Moderate",
      red: "Extreme",
    },
    placeholders: {
      pic: "pic_stress",
      cp: "cp_stress",
    },
  },
  {
    id: "other_hazard_human",
    category: "human_factor",
    question: "Other identified hazard",
    type: "custom",
    options: {
      green: "Custom input",
    },
    placeholders: {
      pic: "pic_other",
      cp: "cp_other",
    },
  },

  // AIRCRAFT CATEGORY
  {
    id: "aircraft_type",
    category: "aircraft",
    question: "Aircraft Type & Model",
    type: "individual",
    options: {
      green: "Flown same type/model of AC within the day",
      red: "Flown dissimilar type/model of AC within the day",
    },
    placeholders: {
      pic: "pic_ac_type",
      cp: "cp_ac_type",
    },
  },
  {
    id: "aircraft_collision",
    category: "aircraft",
    question: "Aircraft Collision",
    type: "shared",
    options: {
      green: "Single ship",
      yellow: "Medium (2-ship formation)",
      red: "High (≥2 ship formation)",
    },
    placeholders: {
      shared: "collision",
    },
  },
  {
    id: "previous_discrepancies",
    category: "aircraft",
    question: "Previous Aircraft discrepancies",
    type: "shared",
    options: {
      green: "None",
      yellow: "Radio, Electrical",
      red: "Engine Related discrepancies, Flight Controls",
    },
    placeholders: {
      shared: "previous_discrepancies",
    },
  },
  {
    id: "other_hazard_aircraft",
    category: "aircraft",
    question: "Other identified hazard",
    type: "custom",
    options: {
      green: "Custom input",
    },
    placeholders: {
      shared: "other_hazard_aircraft",
    },
  },
];

// helper functions to organize questions
export const getQuestionsByCategory = (category: string) => {
  return questions.filter((q) => q.category === category);
};

export const getCategoryNames = () => {
  return ["mission", "environment", "human_factor", "aircraft"];
};

export const getCategoryDisplayName = (category: string) => {
  const names = {
    mission: "Mission",
    environment: "Environment",
    human_factor: "Human Factor",
    aircraft: "Aircraft",
  };
  return names[category as keyof typeof names] || category;
};
