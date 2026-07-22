import { defineMcp } from "@lovable.dev/mcp-js";
import echoTool from "./tools/echo";
import getOrgInfoTool from "./tools/get-org-info";
import listProgramsTool from "./tools/list-programs";

export default defineMcp({
  name: "world-changers-mcp",
  title: "World Changers MHCO",
  version: "0.1.0",
  instructions:
    "Public tools exposing World Changers Mental Health Care Organisation information: organisation profile, programmes, and a connectivity echo tool. Use `get_org_info` for mission and contact info, `list_programs` for programme details, and `echo` to verify the connection.",
  tools: [echoTool, getOrgInfoTool, listProgramsTool],
});
