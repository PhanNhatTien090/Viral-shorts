/**
 * Tavily Web Search Service
 * 
 * Provides real-time context for AI generation.
 * Prevents hallucinations on trending topics.
 */

interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

interface TavilyResponse {
  answer?: string;
  results?: TavilySearchResult[];
}

/**
 * Search web for topic context
 * 
 * @returns Context string or null if unavailable
 */
export async function searchWithTavily(topic: string): Promise<string | null> {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ TAVILY_API_KEY not set');
    return null;
  }

  try {
    const query = `${topic} là gì tiktok trend viral context`;
    console.log('🔍 Tavily:', query);

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: 'basic',
        include_answer: true,
        max_results: 5,
      }),
    });

    if (!response.ok) {
      console.error('❌ Tavily error:', response.status);
      return null;
    }

    const data: TavilyResponse = await response.json();
    return formatContext(data);

  } catch (error) {
    console.error('❌ Tavily failed:', error);
    return null;
  }
}

function formatContext(data: TavilyResponse): string | null {
  let context = '';

  if (data.answer) {
    context += `TÓM TẮT: ${data.answer}\n\n`;
  }

  if (data.results?.length) {
    context += 'CHI TIẾT:\n';
    data.results.slice(0, 3).forEach((r, i) => {
      context += `${i + 1}. ${r.title}\n   ${r.content.slice(0, 200)}...\n\n`;
    });
  }

  return context.trim() || null;
}
