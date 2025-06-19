import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/googleSheets';
import { newsScraper } from '@/lib/newsScraper';
import { aiPromptService } from '@/lib/aiPrompt';

export async function POST(request: NextRequest) {
  try {
    const { leadName } = await request.json();

    if (!leadName) {
      return NextResponse.json(
        { error: 'Lead name is required' },
        { status: 400 }
      );
    }

    // Get all leads from Google Sheets
    const leads = await googleSheetsService.getLeads();
    const lead = leads.find(l => 
      l.name.toLowerCase().includes(leadName.toLowerCase()) ||
      leadName.toLowerCase().includes(l.name.toLowerCase())
    );

    if (!lead) {
      return NextResponse.json(
        { error: `Lead "${leadName}" not found` },
        { status: 404 }
      );
    }

    // Get news articles for the lead
    const articles = await newsScraper.getNewsForLead(lead.name, lead.org);

    // Generate conversation starters
    const conversationStarters = await aiPromptService.generateConversationStarters(
      lead,
      articles
    );

    return NextResponse.json({
      lead,
      articles,
      conversationStarters,
    });
  } catch (error) {
    console.error('Error in generate API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get all leads from Google Sheets
    const leads = await googleSheetsService.getLeads();
    
    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
} 