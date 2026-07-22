import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const PROGRAMS = [
  {
    name: "Individual Counselling",
    description:
      "One-on-one sessions with qualified mental health professionals, by appointment only.",
  },
  {
    name: "Community Outreach",
    description:
      "Regular outreach programmes serving vulnerable communities with food, clothing, and mental health support.",
  },
  {
    name: "Youth Development",
    description:
      "Workshops and mentorship focused on emotional wellbeing and life skills for young people.",
  },
  {
    name: "Advocacy & Awareness",
    description:
      "Public campaigns that reduce stigma and promote mental health awareness in South Africa.",
  },
];

export default defineTool({
  name: "list_programs",
  title: "List programs",
  description:
    "List the public programmes offered by World Changers Mental Health Care Organisation.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(PROGRAMS, null, 2) }],
    structuredContent: { programs: PROGRAMS },
  }),
});
