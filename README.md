# Memory BD AI - Lead Conversation Starter

A Next.js application that generates personalized conversation starters for CMO leads by combining Google Sheets data, Google News scraping, and OpenAI GPT-4.

## Features

- **📊 Lead Management**: Reads CMO leads from Google Sheets
- **📰 News Scraping**: Automatically finds recent news about leads and their organizations
- **🤖 AI-Powered Conversation Starters**: Generates personalized conversation starters using GPT-4
- **🎨 Modern Dashboard**: Clean, responsive UI for managing leads and viewing results
- **📋 Copy to Clipboard**: Easy copying of conversation starters
- **⚡ Real-time Generation**: Generate conversation starters on-demand for any lead

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4
- **Data**: Google Sheets API
- **News**: Google News RSS feeds
- **HTTP Client**: Axios

## Quick Start

1. **Clone and install dependencies**:
   ```bash
   git clone <your-repo>
   cd memory-bd-ai
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file with:
   ```bash
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEETS_ID=your-google-sheet-id-here
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Setup Instructions

See [SETUP.md](./SETUP.md) for detailed setup instructions including:
- Google Sheets API configuration
- OpenAI API setup
- Google Sheet structure requirements
- Troubleshooting guide

## Project Structure

```
src/
├── app/
│   ├── api/generate/route.ts    # API endpoint for generating starters
│   ├── dashboard/page.tsx       # Main dashboard UI
│   └── page.tsx                 # Home page (redirects to dashboard)
├── lib/
│   ├── aiPrompt.ts              # OpenAI GPT-4 integration
│   ├── googleSheets.ts          # Google Sheets API integration
│   └── newsScraper.ts           # Google News RSS scraping
```

## API Endpoints

- `GET /api/generate` - Fetch all leads from Google Sheets
- `POST /api/generate` - Generate conversation starters for a specific lead

## Google Sheet Format

Your Google Sheet should have the following columns:
- **Column A**: Name
- **Column B**: Organization  
- **Column C**: Role
- **Column D**: LinkedIn URL

## How It Works

1. **Lead Import**: Reads CMO leads from your Google Sheet
2. **News Discovery**: Searches Google News for recent articles about each lead and their organization
3. **AI Generation**: Uses GPT-4 to create personalized conversation starters based on the news and lead context
4. **Dashboard Display**: Shows leads, news articles, and conversation starters in an organized interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
