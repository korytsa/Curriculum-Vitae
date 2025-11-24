import type { CodegenConfig } from "@graphql-codegen/cli";

const schema =
  process.env.GRAPHQL_SCHEMA_URL ||
  process.env.NEXT_PUBLIC_GRAPHQL_URI ||
  "https://cv-project-js.inno.ws/api/graphql";

const config: CodegenConfig = {
  schema,
  documents: [
    "features/auth/model/graphql.ts",
    "features/skills/model/graphql.ts",
    "features/users/model/graphql.ts",
    "features/languages/model/graphql.ts",
    "features/cvs/model/graphql.ts",
  ],
  generates: {
    "shared/graphql/generated.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        skipTypename: false,
        nonOptionalTypename: true,
        enumsAsTypes: true,
        maybeValue: "T | null",
      },
    },
  },
};

export default config;
