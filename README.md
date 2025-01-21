# Supabase to Zod Type Generator

[![npm version](https://badge.fury.io/js/%40whoisarpit%2Fsupabase-to-zod.svg)](https://npmjs.com/package/@whoisarpit/supabase-to-zod)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)](https://www.typescriptlang.org/)
[![GitHub last commit](https://img.shields.io/github/last-commit/whoisarpit/supabase-to-zod)](https://github.com/whoisarpit/supabase-to-zod/commits/main)


Supabase to Zod Type Generator is a tool that automatically converts Supabase TypeScript type definitions into Zod schemas.

## Prerequisites

- Node.js (v18+)
- npm or pnpm
- Supabase CLI

## Installation

```bash
# Using npm
npm install --save-dev @whoisarpit/supabase-to-zod

# Using pnpm
pnpm add -D @whoisarpit/supabase-to-zod
```

## Usage

### CLI

```bash
# Generate Zod schemas from default types_db.ts
supabase-to-zod

# Specify custom input file
supabase-to-zod -i ./custom-types.ts

# Specify output file
supabase-to-zod -o ./zod-schemas.ts

# Pipe Supabase generated types
supabase gen types | supabase-to-zod

# Pipe with custom output
supabase gen types | supabase-to-zod -o ./zod-schemas.ts
```

### CLI Options

- `-i, --input`: Input TypeScript file (optional, default: `./types_db.ts`)
- `-o, --output`: Output Zod schemas file (optional, defaults to stdout)
- `-h, --help`: Show help message

### Programmatic Usage

```typescript
import { generateZodSchemas } from "@whoisarpit/supabase-to-zod";

// From file
generateZodSchemas(fileContents, "./types_db.zod.ts");

// From string
const schemas = await generateZodSchemas(typeDefinitionString);
console.log(schemas);
```

## Development

```bash
# Clone the repository
git clone https://github.com/whoisarpit/supabase-to-zod.git
cd supabase-to-zod

# Install dependencies
pnpm install

# Run development script
pnpm dev
```

## Scripts

- `pnpm build`: Compile TypeScript
- `pnpm dev`: Run the type generator

## Publishing

### Versioning Commands

- `pnpm release:patch`: Increment patch version
- `pnpm release:minor`: Increment minor version
- `pnpm release:major`: Increment major version
- `pnpm prerelease:beta`: Create a beta prerelease version

### Publishing Commands

- `pnpm publish:beta`: Publish beta version
- `pnpm publish:latest`: Publish latest version

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on [GitHub](https://github.com/whoisarpit/supabase-to-zod).

## License

This project is licensed under the ISC License.
