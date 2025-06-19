import OpenAI from 'openai';
import { NewsArticle } from './newsScraper';
import { Lead } from './googleSheets';

export interface ConversationStarter {
  id: string;
  text: string;
  context: string;
  tone: 'professional' | 'casual' | 'enthusiastic';
}

interface StarterResponse {
  text: string;
  context: string;
  tone: string;
}

export class AIPromptService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateConversationStarters(
    lead: Lead,
    articles: NewsArticle[]
  ): Promise<ConversationStarter[]> {
    try {
      const articlesText = articles
        .map(article => `- ${article.title} (${article.pubDate})`)
        .join('\n');

      const prompt = `You are a business development professional looking to start a conversation with ${lead.name}, ${lead.role} at ${lead.org}.

Recent news about ${lead.name} or ${lead.org}:
${articlesText}

Based on this information, generate 3 conversation starters that are:
1. Professional and respectful
2. Relevant to recent news or their role
3. Open-ended to encourage response
4. Personalized to their specific situation

For each conversation starter, provide:
- The actual message text
- Brief context explaining why this topic is relevant
- The tone (professional, casual, or enthusiastic)

Format your response as JSON with this structure:
{
  "starters": [
    {
      "text": "the conversation starter message",
      "context": "why this topic is relevant",
      "tone": "professional"
    }
  ]
}

Keep each message under 150 words and make them genuinely helpful and engaging.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a business development expert who creates personalized conversation starters based on recent news and professional context.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Parse the JSON response
      const parsed = JSON.parse(response);
      const starters = parsed.starters || [];

      return starters.map((starter: StarterResponse, index: number) => ({
        id: `${lead.name}-${index}`,
        text: starter.text,
        context: starter.context,
        tone: (starter.tone as 'professional' | 'casual' | 'enthusiastic') || 'professional',
      }));
    } catch (error) {
      console.error('Error generating conversation starters:', error);
      
      // Fallback conversation starters
      return [
        {
          id: `${lead.name}-fallback-1`,
          text: `Hi ${lead.name}, I noticed you're ${lead.role} at ${lead.org}. I'd love to learn more about your current initiatives and see if there might be opportunities for collaboration. Would you be open to a brief conversation?`,
          context: 'Generic professional outreach based on role and company',
          tone: 'professional' as const,
        },
        {
          id: `${lead.name}-fallback-2`,
          text: `Hello ${lead.name}, I've been following ${lead.org}'s work and would appreciate the chance to discuss potential synergies. Your role in ${lead.role} seems particularly relevant to what we're working on.`,
          context: 'Company-focused outreach with role relevance',
          tone: 'professional' as const,
        },
      ];
    }
  }
}

// Export a singleton instance
export const aiPromptService = new AIPromptService(); 