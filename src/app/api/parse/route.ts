import { NextRequest, NextResponse } from 'next/server';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split('.').pop()?.toLowerCase();

  let content: string;

  try {
    switch (extension) {
      case 'pdf':
        const pdf = new PDFParse({ data: new Uint8Array(buffer) });
        const textResult = await pdf.getText();
        content = textResult.text;
        break;
      case 'docx':
        const docxResult = await mammoth.extractRawText({ buffer });
        content = docxResult.value;
        break;
      case 'txt':
      case 'md':
        content = buffer.toString('utf-8');
        break;
      default:
        return NextResponse.json(
          { error: `Unsupported file type: ${extension}` },
          { status: 400 }
        );
    }

    // Truncate if too long
    if (content.length > 15000) {
      content = content.slice(0, 15000) + '\n\n[Content truncated...]';
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('File parsing error:', error);
    return NextResponse.json(
      { error: 'Failed to parse file' },
      { status: 500 }
    );
  }
}
