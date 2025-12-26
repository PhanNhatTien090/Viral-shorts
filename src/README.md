# SRC Directory Structure

This directory contains the main application code organized for scalability.

## Directory Overview

### `/components`

React components organized by atomic design principles:

- **atoms/** - Basic building blocks (buttons, inputs, labels, icons)
- **molecules/** - Simple combinations of atoms (form fields, cards, list items)
- **organisms/** - Complex UI sections (navigation bars, forms, modals)

### `/features`

Domain-specific feature modules. Each feature should be self-contained:

```
features/
├── auth/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── types.ts
├── dashboard/
└── videos/
```

### `/hooks`

Shared custom React hooks that can be used across the application.

Example hooks:

- `useAuth.ts` - Authentication state and methods
- `useDebounce.ts` - Debounce values
- `useMediaQuery.ts` - Responsive breakpoints

### `/lib`

Third-party integrations and utilities:

- **db/** - Drizzle ORM configuration and schemas
- **supabase/** - Supabase client configurations
- **utils/** - Helper functions (cn, formatters, validators)

### `/types`

Global TypeScript type definitions shared across the application.

## Best Practices

1. **Atomic Design**: Start with atoms, build up to molecules, then organisms
2. **Feature-First**: Keep related code together in feature folders
3. **Shared Logic**: Extract reusable hooks and utilities
4. **Type Safety**: Define types in `/types` or feature-specific type files
5. **Imports**: Use path aliases (@/components, @/lib, @/hooks, etc.)

## Next Steps

1. Set up Supabase and update `/lib/supabase/client.ts` and `server.ts`
2. Configure Drizzle ORM and define schemas in `/lib/db/schema.ts`
3. Create your first components in `/components/atoms`
4. Build feature modules in `/features`
