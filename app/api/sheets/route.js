import { getSheetData, addContentToSheet } from '../../../lib/googleSheets';

export async function GET() {
  try {
    const data = await getSheetData();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { content } = await request.json();
    const result = await addContentToSheet(content);
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: 'Failed to add content' }, { status: 500 });
  }
}