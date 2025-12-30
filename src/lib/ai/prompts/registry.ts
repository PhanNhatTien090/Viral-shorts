/**
 * Prompt Registry System
 * 
 * Centralized prompt management with versioning.
 * Enables A/B testing, easy updates, and model-agnostic prompts.
 */

export type PromptVersion = string; // e.g., 'GENZ_V1', 'DRAMA_V1'
export type PromptCategory = 'system' | 'style' | 'task';

export interface PromptMetadata {
  version: PromptVersion;
  category: PromptCategory;
  description: string;
  tokenEstimate: number; // Approximate token count
  createdAt: string;
}

export interface RegisteredPrompt {
  content: string;
  metadata: PromptMetadata;
}

/**
 * Prompt Registry - Single source of truth for all prompts
 */
class PromptRegistry {
  private prompts = new Map<string, RegisteredPrompt>();
  private activeVersions = new Map<PromptCategory, PromptVersion>();

  /**
   * Register a new prompt
   */
  register(key: string, prompt: RegisteredPrompt): void {
    this.prompts.set(key, prompt);
  }

  /**
   * Get prompt by key
   */
  get(key: string): RegisteredPrompt | undefined {
    return this.prompts.get(key);
  }

  /**
   * Get prompt content by key (shorthand)
   */
  getContent(key: string): string {
    const prompt = this.prompts.get(key);
    if (!prompt) {
      throw new Error(`Prompt not found: ${key}`);
    }
    return prompt.content;
  }

  /**
   * Set active version for a category
   */
  setActiveVersion(category: PromptCategory, version: PromptVersion): void {
    this.activeVersions.set(category, version);
  }

  /**
   * Get active version for a category
   */
  getActiveVersion(category: PromptCategory): PromptVersion | undefined {
    return this.activeVersions.get(category);
  }

  /**
   * List all registered prompts
   */
  list(): Array<{ key: string; metadata: PromptMetadata }> {
    return Array.from(this.prompts.entries()).map(([key, prompt]) => ({
      key,
      metadata: prompt.metadata,
    }));
  }
}

// Singleton instance
export const promptRegistry = new PromptRegistry();

/**
 * Helper to compose multiple prompts
 */
export function composePrompts(...keys: string[]): string {
  return keys
    .map(key => promptRegistry.getContent(key))
    .join('\n\n');
}
