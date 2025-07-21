import { Server, StdioServerTransport } from '@modelcontextprotocol/sdk';
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});

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

const handlerFunction = async () => {
  return {
    status: 200,
    body: tools,
  };
};

server.setRequestHandler('tools/list', handlerFunction);
server.listen(new StdioServerTransport());
