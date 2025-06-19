import { google } from 'googleapis';

export interface Lead {
  name: string;
  org: string;
  role: string;
  linkedin: string;
}

export class GoogleSheetsService {
  private sheets: ReturnType<typeof google.sheets>;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async getLeads(): Promise<Lead[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEETS_ID,
        range: 'A:D', // Assuming columns A-D contain: Name, Organization, Role, LinkedIn
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        console.log('No data found in the sheet.');
        return [];
      }

      // Skip header row and map to Lead objects
      const leads: Lead[] = rows.slice(1).map((row: string[]) => ({
        name: row[0] || '',
        org: row[1] || '',
        role: row[2] || '',
        linkedin: row[3] || '',
      }));

      return leads.filter(lead => lead.name && lead.org); // Only return leads with name and org
    } catch (error) {
      console.error('Error reading Google Sheet:', error);
      throw new Error('Failed to read Google Sheet');
    }
  }
}

// Export a singleton instance
export const googleSheetsService = new GoogleSheetsService(); 