# Supabase to Zod Type Generator

## Overview
This project generates Zod schemas from Supabase TypeScript type definitions, enabling runtime type validation for Supabase database types.

## Prerequisites
- Node.js (v18+)
- npm or pnpm
- Supabase CLI

## Installation
```bash
# Using npm
npm install -g @whoisarpit/supabase-to-zod

# Using pnpm
pnpm add -g @whoisarpit/supabase-to-zod
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
- `-i, --input`:  Input TypeScript file (optional, default: `./types_db.ts`)
- `-o, --output`: Output Zod schemas file (optional, defaults to stdout)
- `-h, --help`:   Show help message

### Programmatic Usage
```typescript
import { generateZodSchemas } from '@whoisarpit/supabase-to-zod';

// From file
generateZodSchemas(fileContents, './types_db.zod.ts');

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
- `pnpm start`: Run compiled JavaScript
- `pnpm lint`: Run ESLint

## Features
- Converts Supabase TypeScript types to Zod schemas
- Supports tables, enums, and complex types
- Generates type-safe schemas for row, insert, and update operations
- Flexible CLI with piping support
- Optional input and output file handling
- Programmatic usage

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
ISC License
