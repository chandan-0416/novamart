#!/usr/bin/env node

/**
 * NovaMart Custom Model Context Protocol (MCP) Server
 * 
 * Exposes real-time database inspection and e-commerce diagnostic tools
 * to AI Coding Assistants (Antigravity IDE, Claude Desktop, Cursor) over stdio.
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} = require('@modelcontextprotocol/sdk/types.js');
const db = require('../config/db');

// Initialize MCP Server Instance
const server = new Server(
  {
    name: 'novamart-ecommerce-mcp',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {},
      resources: {}
    }
  }
);

/**
 * 1. List Available Tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_order_metrics',
        description: 'Get real-time total revenue, total orders count, and fulfillment status counts from NovaMart database.',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'check_inventory_alerts',
        description: 'Find products that are out of stock (stock = 0) or running low (stock < threshold).',
        inputSchema: {
          type: 'object',
          properties: {
            threshold: {
              type: 'number',
              description: 'Stock quantity threshold (default: 10)',
              default: 10
            }
          }
        }
      },
      {
        name: 'search_catalog',
        description: 'Search products by name, category, or price range directly in the live database.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search term for product name or description' },
            category: { type: 'string', description: 'Category name (e.g. Electronics, Clothing)' },
            maxPrice: { type: 'number', description: 'Maximum price filter' }
          }
        }
      },
      {
        name: 'run_readonly_sql',
        description: 'Execute a safe, read-only SELECT query against the PostgreSQL database for schema/data inspection.',
        inputSchema: {
          type: 'object',
          properties: {
            sqlQuery: {
              type: 'string',
              description: 'The SELECT SQL statement to execute'
            }
          },
          required: ['sqlQuery']
        }
      }
    ]
  };
});

/**
 * 2. Execute Tool Calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_order_metrics': {
        const statsRes = await db.query(`
          SELECT 
            COUNT(*) AS total_orders,
            COALESCE(SUM(total_amount), 0) AS total_revenue,
            COUNT(*) FILTER (WHERE status = 'pending') AS pending_orders,
            COUNT(*) FILTER (WHERE status = 'processing') AS processing_orders,
            COUNT(*) FILTER (WHERE status = 'delivered') AS delivered_orders
          FROM orders
        `);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(statsRes.rows[0], null, 2)
            }
          ]
        };
      }

      case 'check_inventory_alerts': {
        const threshold = args?.threshold ?? 10;
        const res = await db.query(
          `SELECT id, name, price, stock_quantity, is_active
           FROM products
           WHERE stock_quantity <= $1
           ORDER BY stock_quantity ASC`,
          [threshold]
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ threshold, lowStockCount: res.rowCount, items: res.rows }, null, 2)
            }
          ]
        };
      }

      case 'search_catalog': {
        const queryText = args?.query ? `%${args.query}%` : null;
        const category = args?.category || null;
        const maxPrice = args?.maxPrice || null;

        const res = await db.query(
          `SELECT p.id, p.name, p.price, p.stock_quantity, c.name AS category_name
           FROM products p
           LEFT JOIN categories c ON p.category_id = c.id
           WHERE ($1::TEXT IS NULL OR p.name ILIKE $1 OR p.description ILIKE $1)
             AND ($2::TEXT IS NULL OR c.name ILIKE $2)
             AND ($3::NUMERIC IS NULL OR p.price <= $3)
           ORDER BY p.id ASC
           LIMIT 20`,
          [queryText, category, maxPrice]
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ matchCount: res.rowCount, products: res.rows }, null, 2)
            }
          ]
        };
      }

      case 'run_readonly_sql': {
        const sql = args.sqlQuery.trim();
        if (!sql.toUpperCase().startsWith('SELECT') && !sql.toUpperCase().startsWith('WITH')) {
          throw new Error('Only read-only SELECT or WITH statements are permitted via this tool.');
        }

        const res = await db.query(sql);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ rowCount: res.rowCount, rows: res.rows }, null, 2)
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown MCP tool requested: ${name}`);
    }
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `MCP Tool Error [${name}]: ${error.message}`
        }
      ]
    };
  }
});

/**
 * 3. Expose Live Resources (Static & Dynamic Streams)
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'novamart://database/schema',
        name: 'NovaMart PostgreSQL Schema Definition',
        mimeType: 'text/sql',
        description: 'Complete PostgreSQL database schema DDL with tables and constraints'
      }
    ]
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  if (uri === 'novamart://database/schema') {
    const fs = require('fs');
    const path = require('path');
    const schemaSql = fs.readFileSync(path.resolve(__dirname, '../database/schema.sql'), 'utf8');
    return {
      contents: [
        {
          uri,
          mimeType: 'text/sql',
          text: schemaSql
        }
      ]
    };
  }
  throw new Error(`Resource not found: ${uri}`);
});

// Connect to stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[MCP]: NovaMart MCP Server running on stdio');
}

main().catch((err) => {
  console.error('[MCP FATAL]:', err);
  process.exit(1);
});
