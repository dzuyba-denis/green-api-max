import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_API_URL } from '@/shared/config/constants';

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function handleProxy(req: NextRequest, context: RouteContext) {
  console.log('handleProxy 1')
  try {
    const { path } = await context.params;
    const targetPath = path.join('/');

    const customApiUrl = req.headers.get('x-api-url') || DEFAULT_API_URL;
    const baseUrl = customApiUrl.replace(/\/+$/, '');

    const targetUrl = new URL(`${baseUrl}/${targetPath}`);
    req.nextUrl.searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });

    const headers: Record<string, string> = {};
    const contentType = req.headers.get('content-type');
    if (contentType) {
      headers['content-type'] = contentType;
    }

    let body: string | undefined = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      try {
        const text = await req.text();
        if (text) {
          body = text;
        }
      } catch {
        // body not present
      }
    }

    console.log('proxyURL',targetUrl.toString())
    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers,
      body,
    });

    const responseText = await response.text();
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch {
      data = responseText;
    }

    return NextResponse.json(data, {
      status: response.status,
      statusText: response.statusText,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown proxy error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest, context: RouteContext) {
  console.log('PROXY GET')
  return handleProxy(req, context);
}

export async function POST(req: NextRequest, context: RouteContext) {
  console.log('PROXY POST')
  return handleProxy(req, context);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  console.log('PROXY DELETE')  
  return handleProxy(req, context);
}
