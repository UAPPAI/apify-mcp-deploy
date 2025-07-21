import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ApifyClient } from 'apify-client';

// Initialize Apify client
const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});

// Create MCP server
const server = new Server(
  {
    name: 'apify-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
const tools = [
  {
    name: 'scrape_website',
    description: 'Scrape content from a website using Apify',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The URL to scrape',
        },
      },
      required: ['url'],
    },
  },
];

// Handler for listing tools
const handlerFunction = async () => {
  return {
    status: 200,
    body: tools,
  };
};

server.setRequestHandler('tools/list', handlerFunction);
server.listen(new StdioServerTransport());
