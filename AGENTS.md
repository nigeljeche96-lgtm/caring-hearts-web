# Architecture rules

- Use react-i18next resources for all static presentation text; useSiteCopy maps legacy English copy to stable locale keys without translating submitted values, identities, prices or payment payloads.
- Keep translation resources bundled locally; visitors must not depend on an external translation service to read the site.