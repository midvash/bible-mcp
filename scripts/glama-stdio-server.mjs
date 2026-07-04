#!/usr/bin/env node

const REMOTE_MCP_URL =
  process.env.MIDVASH_MCP_URL ??
  'https://mcp.midvash.com/mcp/glama?v=nvi,kjv&lang=pt-br,en';

let buffer = Buffer.alloc(0);
const DEBUG = process.env.GLAMA_STDIO_DEBUG === 'true';

console.error(`[glama-stdio-server] Ready. Remote endpoint: ${REMOTE_MCP_URL}`);

process.stdin.on('data', (chunk) => {
  buffer = Buffer.concat([buffer, chunk]);
  processMessages().catch((error) => {
    console.error('[glama-stdio-server] Failed to process message:', error);
  });
});

process.stdin.on('end', () => {
  process.exit(0);
});

async function processMessages() {
  while (true) {
    const crlfHeaderEnd = buffer.indexOf('\r\n\r\n');
    const lfHeaderEnd = buffer.indexOf('\n\n');
    const usesCrlf =
      crlfHeaderEnd !== -1 && (lfHeaderEnd === -1 || crlfHeaderEnd <= lfHeaderEnd);
    const headerEnd = usesCrlf ? crlfHeaderEnd : lfHeaderEnd;
    if (headerEnd === -1) return;

    const header = buffer.slice(0, headerEnd).toString('utf8');
    const contentLengthMatch = header.match(/content-length:\s*(\d+)/i);
    if (!contentLengthMatch) {
      throw new Error('Missing Content-Length header.');
    }

    const contentLength = Number(contentLengthMatch[1]);
    const messageStart = headerEnd + (usesCrlf ? 4 : 2);
    const messageEnd = messageStart + contentLength;
    if (buffer.length < messageEnd) return;

    const rawMessage = buffer.slice(messageStart, messageEnd).toString('utf8');
    buffer = buffer.slice(messageEnd);

    const message = JSON.parse(rawMessage);
    debug('received', message.method, message.id);
    const response = await handleMessage(message);
    if (response) {
      writeMessage(response);
    }
  }
}

async function handleMessage(message) {
  const id = message.id ?? null;
  const isNotification = message.id === undefined || message.id === null;

  if (isNotification) {
    return null;
  }

  if (message.method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: message.params?.protocolVersion ?? '2025-06-18',
        capabilities: {
          tools: {
            listChanged: false,
          },
        },
        serverInfo: {
          name: 'midvash',
          title: 'Midvash Bible MCP',
          version: '1.1.0',
        },
        instructions:
          'Midvash Bible MCP provides no-key access to Scripture lookup, search, and comparison tools across selected Bible versions.',
      },
    };
  }

  if (message.method === 'ping') {
    return { jsonrpc: '2.0', id, result: {} };
  }

  if (message.method === 'tools/list' || message.method === 'tools/call') {
    return forwardToRemote(message);
  }

  return {
    jsonrpc: '2.0',
    id,
    error: {
      code: -32601,
      message: `Unsupported method: ${message.method}`,
    },
  };
}

async function forwardToRemote(message) {
  const response = await fetch(REMOTE_MCP_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json, text/event-stream',
      'content-type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  const text = await response.text();
  if (!response.ok) {
    return {
      jsonrpc: '2.0',
      id: message.id ?? null,
      error: {
        code: -32000,
        message: `Remote MCP request failed with HTTP ${response.status}`,
        data: text.slice(0, 1000),
      },
    };
  }

  return parseRemoteResponse(text, message.id ?? null);
}

function parseRemoteResponse(text, id) {
  const trimmed = text.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return JSON.parse(trimmed);
  }

  for (const block of trimmed.split(/\n\n+/)) {
    const dataLine = block
      .split('\n')
      .find((line) => line.startsWith('data:'));
    if (!dataLine) continue;
    return JSON.parse(dataLine.slice('data:'.length).trim());
  }

  return {
    jsonrpc: '2.0',
    id,
    error: {
      code: -32000,
      message: 'Remote MCP returned an unrecognized response format.',
      data: trimmed.slice(0, 1000),
    },
  };
}

function writeMessage(message) {
  const body = JSON.stringify(message);
  debug('sending', message.id, message.error?.message ?? 'ok');
  process.stdout.write(`Content-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`);
}

function debug(...args) {
  if (DEBUG) {
    console.error('[glama-stdio-server]', ...args);
  }
}
