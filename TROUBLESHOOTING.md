# Troubleshooting Guide

## Issue: "Failed to fetch leads" Error

If you're seeing this error, here are the steps to fix it:

### 1. Check Google Sheet Sharing

Make sure your Google Sheet is shared with the service account:
- Open your Google Sheet: https://docs.google.com/spreadsheets/d/1vxjrpRsZyTOLqRtKqRhMAdbEeU7N2TqpWHr6Z2jk26Q/edit
- Click "Share" in the top right
- Add this email: `memory-bd-ai-sheets@cmo-lead.iam.gserviceaccount.com`
- Give it "Editor" access
- Click "Send"

### 2. Check Sheet Structure

Your Google Sheet should have this exact structure:

| Name | Organization | Role | LinkedIn URL |
|------|--------------|------|--------------|
| Sarah Johnson | Microsoft | CMO | https://linkedin.com/in/sarahjohnson |
| Michael Chen | Apple | VP Marketing | https://linkedin.com/in/michaelchen |

**Important:**
- Column A: Name
- Column B: Organization  
- Column C: Role
- Column D: LinkedIn URL
- **First row should be headers**
- **Data starts from row 2**

### 3. Test the Connection

You can test if the connection works by visiting:
- http://localhost:3000/api/generate

If it returns `{"error":"Failed to fetch leads"}`, the issue is with the Google Sheet setup.

### 4. Common Issues

**Issue**: Sheet is empty
- **Solution**: Add some sample data using the format above

**Issue**: Wrong column order
- **Solution**: Make sure columns are in the exact order: Name, Organization, Role, LinkedIn URL

**Issue**: Service account doesn't have access
- **Solution**: Re-share the sheet with the service account email

**Issue**: Sheet ID is wrong
- **Solution**: Check that the Sheet ID in `.env.local` matches your sheet URL

### 5. Quick Test

1. Go to your Google Sheet
2. Add this test data in rows 2-4:
   ```
   Name | Organization | Role | LinkedIn URL
   Test User | Test Company | CMO | https://linkedin.com/in/testuser
   ```
3. Save the sheet
4. Refresh http://localhost:3000/dashboard

### 6. Still Having Issues?

Check the browser console (F12) for more detailed error messages, or check the terminal where you're running `npm run dev` for server-side errors. 