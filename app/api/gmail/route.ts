
import { authoptions } from '@/lib/auth';
import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authoptions);
  if (!session) return NextResponse.json('Not authorized');

  const { searchParams } = new URL(req.url);
  const maxMsgs = Number(searchParams.get('count'));

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.user.accessToken });

  const gmail = google.gmail({ version: 'v1', auth });

  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: maxMsgs,
      q: 'from:noreply@phonepe.com',
    });
    const messageIds = response.data.messages?.map((item) => item.id) || [];
    console.log("fuckers ", messageIds)
    const messages = await Promise.all(
      messageIds.map(async (id) => {
        const msg = await gmail.users.messages.get({ userId: 'me', id: id! });
        console.log('idchuti', id)
        return {
          id: msg.data.id, 
          snippet: msg.data.snippet,
          payload: msg.data.payload,
        };
      }),
    );

    return NextResponse.json(messages, { status: 200 });
  } catch (Err) {
    return NextResponse.json(Err, { status: 400 });
  }
}
