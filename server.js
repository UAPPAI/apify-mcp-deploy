const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { ApifyClient } = require('apify-client');

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

// Add web scraping tool
server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'scrape_website') {
    const { url } = request.params.arguments;
    
    try {
      // Run the Web Scraper actor
      const run = await client.actor('apify/web-scraper').call({
        startUrls: [{ url }],
        maxRequestsPerCrawl: 1,
      });
      
      // Get results
      const { items } = await client.dataset(run.defaultDatasetId).listItems();
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(items[0] || 'No data scraped', null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error: ${error.message}`
        }]
      };
    }
  }
  
  throw new Error(`Unknown tool: ${request.params.name}`);
});

// List available tools
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'scrape_website',
        description: 'Scrape content from a website',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'The URL to scrape'
            }
          },
          required: ['url']
        }
      }
    ]
  };
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Apify MCP server started');
}

main().catch(console.error);
