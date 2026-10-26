# Architecture rules

- Use react-i18next resources for all static presentation text; useSiteCopy maps legacy English copy to stable locale keys without translating submitted values, identities, prices or payment payloads.
- Keep translation resources bundled locally; visitors must not depend on an external translation service to read the site.
- Reuse OutreachVideos for owner-supplied outreach clips on Portfolio and Programmes & Impact so the video IDs stay synchronized.- The MCP server requires OAuth sign-in (managed Cloud Auth issuer); /login must honour a validated `next` path so the consent page at /.lovable/oauth/consent can complete.
