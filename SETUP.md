# Memory BD AI - Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Google Sheets API Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_ID=your-google-sheet-id-here

# OpenAI API Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here
```

## Google Sheets Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing (required for API usage)

### 2. Enable Google Sheets API

1. In your Google Cloud project, go to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

### 3. Create a Service Account (NOT OAuth Client)

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `memory-bd-ai-sheets`
   - Description: `Service account for Memory BD AI Google Sheets access`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

### 4. Generate Service Account Key

1. In the Credentials page, find your service account and click on it
2. Go to the "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Choose "JSON" format
5. Download the JSON file

### 5. Extract Credentials from JSON

Open the downloaded JSON file. You'll need these values:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  ...
}
```

Copy the `client_email` and `private_key` values to your `.env.local` file.

### 6. Create and Share Google Sheet

1. Create a new Google Sheet with these columns:
   - Column A: Name
   - Column B: Organization
   - Column C: Role
   - Column D: LinkedIn URL

2. Add some sample data:
   ```
   Name | Organization | Role | LinkedIn URL
   John Smith | Acme Corp | CMO | https://linkedin.com/in/johnsmith
   Jane Doe | TechStart | VP Marketing | https://linkedin.com/in/janedoe
   ```

3. Share the sheet with your service account email:
   - Click "Share" in the top right
   - Add your service account email: `your-service-account@your-project.iam.gserviceaccount.com`
   - Give it "Editor" access
   - Click "Send"

4. Get the Sheet ID from the URL:
   - Format: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`
   - Copy the `YOUR_SHEET_ID` part

## OpenAI Setup

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env.local` file

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- **Lead Management**: Reads CMO leads from Google Sheets
- **News Scraping**: Automatically finds recent news about leads and their organizations
- **AI-Powered Conversation Starters**: Generates personalized conversation starters using GPT-4
- **Dashboard Interface**: Clean, modern UI for managing leads and viewing results
- **Copy to Clipboard**: Easy copying of conversation starters

## API Endpoints

- `GET /api/generate` - Fetch all leads from Google Sheets
- `POST /api/generate` - Generate conversation starters for a specific lead

## Troubleshooting

1. **Google Sheets API Error**: Make sure your service account has access to the sheet
2. **OpenAI API Error**: Verify your API key is correct and has sufficient credits
3. **News Scraping Issues**: The app uses Google News RSS feeds which may have rate limits
4. **Wrong Credentials Type**: Make sure you're using Service Account credentials, not OAuth client credentials 