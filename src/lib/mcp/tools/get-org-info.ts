import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "get_org_info",
  title: "Get organization info",
  description:
    "Return public information about World Changers Mental Health Care Organisation: mission, contact email, website, and social links.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const info = {
      name: "World Changers Mental Health Care Organisation",
      mission:
        "Providing accessible mental health care, community outreach, and advocacy across South Africa.",
      website: "https://world-changers-org.lovable.app",
      contact_email: "info@worldchangersmh.org",
      focus_areas: [
        "Mental health care and counselling",
        "Community outreach and philanthropy",
        "Youth development and advocacy",
      ],
    };
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
