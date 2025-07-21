const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { ApifyClient } = require('apify-client');

// Initialize Apify client
const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});

// Create MCP server with proper initialization
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

// Handler function to return tools list
const handlerFunction = async () => {
  return {
    status: 200,
    body: tools,
  };
};

// Register the handler for 'tools/list'
server.setRequestHandler('tools/list', handlerFunction);

// Start server
server.listen(new StdioServerTransport());
