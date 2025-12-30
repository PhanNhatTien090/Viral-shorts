# AI Module Architecture

## Overview

The AI module provides a production-ready, model-agnostic architecture for LLM integration. It separates concerns into distinct layers for maintainability and cost optimization.

## Directory Structure

```
src/lib/ai/
├── index.ts              # Main entry point & public API
├── providers/            # LLM provider abstraction
│   ├── index.ts          # Provider factory
│   ├── types.ts          # Interfaces & type definitions
│   └── gemini.ts         # Google Gemini implementation
├── prompts/              # Prompt registry & templates
│   ├── registry.ts       # Prompt versioning system
│   ├── system.ts         # Persona prompts (WHO)
│   ├── styles.ts         # Vibe/tone prompts (HOW)
│   ├── tasks.ts          # Task prompts (WHAT)
│   └── index.ts          # Prompt builder
└── schemas/              # Zod schemas
    └── script.ts         # Script generation schemas
```

## Key Concepts

### 1. Provider Abstraction

Switch between LLM providers without changing business logic:

```typescript
// Current: Gemini (free tier)
const provider = getProvider("gemini", "fast");

// Future: Claude for premium users
const provider = getProvider("anthropic", "premium");
```

**Model Tiers:**

- `fast`: Cheap, high-throughput (Gemini Flash, GPT-4o-mini, Haiku)
- `balanced`: Good quality/cost ratio (Gemini Pro, GPT-4o, Sonnet)
- `premium`: Best quality (GPT-4o, Opus)

### 2. Layered Prompt System

Prompts are composed from 4 layers:

```
┌─────────────────────────────────────┐
│ Layer 1: SYSTEM (Who you are)       │  ~50 tokens
│ - Persona definition                │
│ - Language style                    │
├─────────────────────────────────────┤
│ Layer 2: STYLE (How to write)       │  ~35 tokens
│ - Vibe/tone modifiers               │
│ - Content strategy                  │
├─────────────────────────────────────┤
│ Layer 3: TASK (What to produce)     │  ~90 tokens
│ - Output format                     │
│ - Structure requirements            │
├─────────────────────────────────────┤
│ Layer 4: CONTEXT (Dynamic input)    │  Variable
│ - User topic                        │
│ - Web search results                │
└─────────────────────────────────────┘
```

**Token Savings:** ~275 tokens total vs ~800+ in original prompt (65% reduction)

### 3. Prompt Registry

Version and manage prompts centrally:

```typescript
// Register a new prompt version
promptRegistry.register("system:genz_v2", {
  content: "...",
  metadata: {
    version: "GENZ_V2",
    category: "system",
    tokenEstimate: 55,
  },
});

// A/B test between versions
const prompt = promptRegistry.getContent(
  isTestGroup ? "system:genz_v2" : "system:genz_v1"
);
```

## Usage

### Basic Generation

```typescript
import { generateScript } from "@/lib/ai";

const { stream, object } = await generateScript({
  topic: "Cà phê Việt Nam",
  vibe: "educational",
  platform: "tiktok",
});

// Stream to client
return new Response(stream);

// Or await final result
const script = await object;
```

### With Visual Prompts

```typescript
const result = await generateScript({
  topic: "Skincare routine",
  vibe: "educational",
  platform: "tiktok",
  includeVisuals: true, // Adds visualPrompt field
});
```

### Health Check

```typescript
import { checkAIHealth } from "@/lib/ai";

const { ok, error } = await checkAIHealth();
if (!ok) {
  console.error("AI unavailable:", error);
}
```

## Adding New Providers

1. Create `providers/openai.ts`:

```typescript
import { ILLMProvider, GenerateOptions, MODEL_MAP } from "./types";

export class OpenAIProvider implements ILLMProvider {
  readonly name = "openai" as const;

  async streamObject<T>(options: GenerateOptions<T>) {
    // Implementation using OpenAI SDK
  }

  async healthCheck() {
    // Verify API key
  }
}
```

2. Add to factory in `providers/index.ts`:

```typescript
case 'openai': {
  if (!openaiInstance) {
    openaiInstance = new OpenAIProvider(apiKey, tier);
  }
  return openaiInstance;
}
```

## Adding New Styles

Add to `prompts/styles.ts`:

```typescript
promptRegistry.register("style:sarcastic_v1", {
  content: `STYLE: Sarcastic/Ironic
- Mock common misconceptions
- Use irony to make points
- Deadpan delivery`,
  metadata: {
    version: "SARCASTIC_V1",
    category: "style",
    tokenEstimate: 25,
  },
});
```

## Cost Optimization Strategy

| Use Case         | Recommended Tier | Provider      |
| ---------------- | ---------------- | ------------- |
| Bulk generation  | `fast`           | Gemini Flash  |
| Premium users    | `balanced`       | GPT-4o-mini   |
| Rewrite/Polish   | `premium`        | Claude Sonnet |
| Complex analysis | `premium`        | Claude Opus   |

## Removed from Original

1. **Few-shot examples**: Removed from runtime prompts (save ~500 tokens)
2. **Explicit CoT**: Modern models handle this implicitly
3. **Decorative formatting**: No `═══` lines eating tokens
4. **Inline prompt**: Now modular and versioned
