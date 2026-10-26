import { auth, defineMcp } from "@lovable.dev/mcp-js";
import echoTool from "./tools/echo";
import getOrgInfoTool from "./tools/get-org-info";
import listProgramsTool from "./tools/list-programs";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "world-changers-org",
  title: "World Changers Org",
  version: "0.2.0",
  instructions:
    "Tools for World Changers Mental Health Care Organisation, available to signed-in users. Use `get_org_info` for mission and contact info, `list_programs` for programme details, and `echo` to verify the connection.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [echoTool, getOrgInfoTool, listProgramsTool],
});
