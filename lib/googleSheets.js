import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;

async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      private_key: GOOGLE_PRIVATE_KEY,
      client_email: GOOGLE_CLIENT_EMAIL,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const authClient = await auth.getClient();
  return google.sheets({ version: 'v4', auth: authClient });
}

export async function getSheetData() {
  try {
    const sheets = await getGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1:I100',
    });

    const rows = response.data.values || [];
    if (rows.length === 0) {
      return { posts: [], totalPosts: 0, pendingPosts: 0, scheduledPosts: 0 };
    }

    // First row contains headers
    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Convert rows to objects
    const posts = dataRows
      .filter(row => row[0]) // Only rows with Post Description
      .map(row => ({
        postDescription: row[0] || '',
        instructions: row[1] || '',
        status: row[2] || 'draft',
        image: row[3] || '',
        scheduledFor: row[4] || '',
        cta: row[5] || '',
        pillar: row[6] || '',
        hashtags: row[7] || '',
        createdDate: row[8] || ''
      }));

    return {
      posts,
      totalPosts: posts.length,
      pendingPosts: posts.filter(p => p.status === 'Pending').length,
      scheduledPosts: posts.filter(p => p.status === 'Scheduled').length
    };
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return {
      posts: [],
      totalPosts: 0,
      pendingPosts: 0,
      scheduledPosts: 0,
      error: error.message
    };
  }
}

export async function addContentToSheet(contentArray) {
  try {
    const sheets = await getGoogleSheetsClient();
    
    // Convert content objects to rows
    const newRows = contentArray.map(content => [
      content.postDescription,
      content.instructions,
      'Pending',
      '', // Image
      content.scheduledFor,
      content.cta,
      content.pillar,
      content.hashtags,
      new Date().toISOString().split('T')[0] // Created Date
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1:I100',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: newRows
      }
    });

    return { success: true, added: newRows.length };
  } catch (error) {
    console.error('Error adding to sheet:', error);
    return { success: false, error: error.message };
  }
}