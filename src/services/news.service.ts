import { NewsArticle } from '@/types/news.types';
import { generateId } from '@/utils/formatters';

const GNEWS_BASE = 'https://gnews.io/api/v4';

function getApiKey(): string {
  const key = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
  if (!key) throw new Error('GNews API key not configured');
  return key;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeArticle(article: any): NewsArticle {
  return {
    id: generateId(),
    title: article.title,
    description: article.description,
    content: article.content,
    url: article.url,
    image: article.image,
    publishedAt: article.publishedAt,
    source: {
      name: article.source?.name ?? 'Unknown',
      url: article.source?.url ?? '#',
    },
  };
}

export async function getTopHeadlines(
  category: string = 'technology',
  max: number = 10
): Promise<NewsArticle[]> {
  const key = getApiKey();
  const res = await fetch(
    `${GNEWS_BASE}/top-headlines?category=${category}&max=${max}&apikey=${key}&lang=en`
  );

  if (!res.ok) {
    throw new Error(`GNews fetch failed: ${res.status}`);
  }

  const data = await res.json();

  if (!data.articles || !Array.isArray(data.articles)) {
    throw new Error('Invalid GNews response');
  }

  return data.articles.map(normalizeArticle);
}

export async function searchNews(query: string, max: number = 10): Promise<NewsArticle[]> {
  const key = getApiKey();
  const res = await fetch(
    `${GNEWS_BASE}/search?q=${encodeURIComponent(query)}&max=${max}&apikey=${key}&lang=en`
  );

  if (!res.ok) {
    throw new Error(`GNews search failed: ${res.status}`);
  }

  const data = await res.json();
  return (data.articles ?? []).map(normalizeArticle);
}

// Fallback mock data for development when API key is not set
export function getMockNews(): NewsArticle[] {
  return [
    {
      id: '1',
      title: 'Next.js 15 Brings Revolutionary Performance Improvements',
      description: 'The latest version of Next.js ships with Partial Prerendering, improved caching, and React 19 support by default.',
      content: null,
      url: 'https://nextjs.org/blog/next-15',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
      publishedAt: new Date().toISOString(),
      source: { name: 'Tech Insider', url: 'https://nextjs.org' },
    },
    {
      id: '2',
      title: 'AI Models Are Now Writing 30% of Production Code',
      description: 'New research from GitHub shows AI-assisted coding has crossed a significant threshold in enterprise environments.',
      content: null,
      url: 'https://github.blog/news-insights/research/the-economic-impact-of-the-ai-powered-developer-lifecycle-and-lessons-from-github-copilot/',
      image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      source: { name: 'GitHub Blog', url: 'https://github.blog' },
    },
    {
      id: '3',
      title: 'WebAssembly 3.0 Specification Finalized',
      description: 'The W3C officially approves the WebAssembly 3.0 spec, bringing native threads and garbage collection to the web.',
      content: null,
      url: 'https://webassembly.org/',
      image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&q=80',
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      source: { name: 'W3C News', url: 'https://www.w3.org/' },
    },
    {
      id: '4',
      title: 'TypeScript 6.0 Announces First-Class Decorators',
      description: 'Microsoft unveils TypeScript 6.0 with stage-3 decorator support, improved inference, and blazing-fast compilation.',
      content: null,
      url: 'https://devblogs.microsoft.com/typescript/',
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      source: { name: 'Microsoft Dev Blog', url: 'https://devblogs.microsoft.com/' },
    },
    {
      id: '5',
      title: 'React 20 Roadmap: Compiler-First Architecture',
      description: 'The React team publishes the 2026 roadmap focusing on compiler optimizations and server-first patterns.',
      content: null,
      url: 'https://react.dev/blog',
      image: 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=800&q=80',
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      source: { name: 'React Blog', url: 'https://react.dev' },
    },
  ];
}
