import Parser from 'rss-parser';

export interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  source: string;
}

export class NewsScraper {
  private parser: Parser;

  constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['media:content', 'media:thumbnail'],
      },
    });
  }

  async searchNews(query: string, limit: number = 5): Promise<NewsArticle[]> {
    try {
      // Google News RSS feed URL
      const encodedQuery = encodeURIComponent(query);
      const rssUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-US&gl=US&ceid=US:en`;

      const feed = await this.parser.parseURL(rssUrl);
      
      if (!feed.items || feed.items.length === 0) {
        return [];
      }

      return feed.items.slice(0, limit).map(item => ({
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate || '',
        content: item.contentSnippet || item.content || '',
        source: item.source?.name || 'Google News',
      }));
    } catch (error) {
      console.error(`Error fetching news for query "${query}":`, error);
      return [];
    }
  }

  async getNewsForLead(name: string, org: string): Promise<NewsArticle[]> {
    const queries = [
      `${name} ${org}`,
      `${org} news`,
      `${name} executive`,
      `${org} marketing`,
    ];

    const allArticles: NewsArticle[] = [];
    
    for (const query of queries) {
      try {
        const articles = await this.searchNews(query, 3);
        allArticles.push(...articles);
      } catch (error) {
        console.error(`Error searching for "${query}":`, error);
      }
    }

    // Remove duplicates based on title and link
    const uniqueArticles = allArticles.filter((article, index, self) => 
      index === self.findIndex(a => 
        a.title === article.title || a.link === article.link
      )
    );

    return uniqueArticles.slice(0, 5); // Return max 5 unique articles
  }
}

// Export a singleton instance
export const newsScraper = new NewsScraper(); 