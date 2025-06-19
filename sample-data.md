# Sample Google Sheet Data

Use this sample data in your Google Sheet to test the application:

## Column Headers (Row 1)
| Name | Organization | Role | LinkedIn URL |
|------|--------------|------|--------------|

## Sample Data (Rows 2+)
| Name | Organization | Role | LinkedIn URL |
|------|--------------|------|--------------|
| Sarah Johnson | Microsoft | CMO | https://linkedin.com/in/sarahjohnson |
| Michael Chen | Apple | VP Marketing | https://linkedin.com/in/michaelchen |
| Emily Rodriguez | Google | Chief Marketing Officer | https://linkedin.com/in/emilyrodriguez |
| David Kim | Amazon | Senior Director of Marketing | https://linkedin.com/in/davidkim |
| Lisa Thompson | Meta | VP Brand Marketing | https://linkedin.com/in/lisathompson |
| James Wilson | Netflix | CMO | https://linkedin.com/in/jameswilson |
| Rachel Green | Spotify | VP Marketing | https://linkedin.com/in/rachelgreen |
| Alex Martinez | Tesla | Director of Marketing | https://linkedin.com/in/alexmartinez |

## Instructions

1. Create a new Google Sheet
2. Copy the headers and sample data above
3. Make sure the service account email has access to the sheet
4. Copy the Sheet ID from the URL
5. Add the Sheet ID to your `.env.local` file

## Expected Results

Once configured, the application will:
- Load these leads from your Google Sheet
- Search for recent news about each person and their organization
- Generate personalized conversation starters using GPT-4
- Display everything in the dashboard interface 