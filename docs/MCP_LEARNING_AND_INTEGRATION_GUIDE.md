# Model Context Protocol (MCP): Complete Beginner to Advanced Guide & Hands-On Tutorial

This guide explains what **MCP (Model Context Protocol)** is, why it is revolutionizing AI software engineering, and how you can run, build, and extend custom MCP servers directly in your **NovaMart** project.

---

## 🔌 1. What is MCP (Model Context Protocol)?

### The "USB-C for AI" Analogy:
Before **USB-C**, connecting a device to a computer required a tangle of proprietary cables (VGA, DVI, HDMI, Mini-USB, Micro-USB, Lightning).

Similarly, before **MCP**, every AI model (OpenAI, Anthropic Claude, Gemini, Local LLMs) required developers to write proprietary, custom function-calling wrappers for every tool (PostgreSQL, GitHub, Slack, Notion, File System).

**MCP (created as an open standard by Anthropic & the AI developer community)** is the universal open standard protocol that enables AI models to securely discover, inspect, and execute tools and data sources via a standardized protocol.

```mermaid
flowchart TD
    subgraph AI_Clients ["MCP Hosts / Clients"]
        Client1["Antigravity IDE"]
        Client2["Claude Desktop"]
        Client3["Cursor / VS Code"]
    end

    subgraph Standard_Protocol ["Standard Model Context Protocol (JSON-RPC 2.0 via stdio or SSE)"]
        Protocol["Standard Protocol Layer"]
    end

    subgraph MCP_Servers ["MCP Tool & Resource Servers"]
        Server1["NovaMart Custom E-Commerce MCP (src/mcp/novamartMcpServer.js)"]
        Server2["Official PostgreSQL MCP Server (@modelcontextprotocol/server-postgres)"]
        Server3["GitHub MCP Server (@modelcontextprotocol/server-github)"]
    end

    Client1 & Client2 & Client3 <--> Protocol
    Protocol <--> Server1 & Server2 & Server3
```

---

## 🏛️ 2. Core Concepts of MCP

An MCP integration has three primary capabilities:

| Primitive | Description | Real Example in NovaMart |
| :--- | :--- | :--- |
| **🛠️ Tools** | Functions that the AI model can dynamically decide to execute. | `check_inventory_alerts({ threshold: 5 })`, `get_order_metrics()` |
| **📄 Resources** | Read-only dynamic data streams or documents exposed to the AI. | `novamart://database/schema` (live SQL schema definition) |
| **💬 Prompts** | Pre-engineered system prompt templates. | "Analyze daily order revenue and low-stock replenishment strategy" |

---

## 🛠️ 3. Hands-On: The Custom NovaMart MCP Server

A working, production-ready custom MCP server has been created in your project at:  
👉 **[`backend/src/mcp/novamartMcpServer.js`](file:///c:/Users/chand/OneDrive/Desktop/E-Commerce-Platform/backend/src/mcp/novamartMcpServer.js)**

### What Tools Does It Expose to the AI?

1. **`get_order_metrics`**: Fetches total revenue, total orders, pending/processing orders directly from PostgreSQL.
2. **`check_inventory_alerts`**: Scans the database for products with inventory under a given threshold (e.g. `threshold: 10`).
3. **`search_catalog`**: Live multi-filter search for products by name, category, and maximum price.
4. **`run_readonly_sql`**: Executes safe, read-only `SELECT` queries to inspect database state.
5. **Resource `novamart://database/schema`**: Directly reads and serves `schema.sql`.

---

## 🧪 4. How to Test & Inspect Your MCP Server Interactively

You can test your MCP server using the official **MCP Inspector** web interface:

```bash
cd backend
npx @modelcontextprotocol/inspector node src/mcp/novamartMcpServer.js
```

1. This opens an interactive browser UI at `http://localhost:5173` (or given port).
2. Click on **List Tools** ➔ Select `get_order_metrics` ➔ Click **Run Tool**.
3. You will see the real-time JSON response returned directly from your Supabase/PostgreSQL database!

---

## ⚙️ 5. How to Configure MCP in Your IDE

The configuration file has been created at [`/.agents/mcp_config.json`](file:///c:/Users/chand/OneDrive/Desktop/E-Commerce-Platform/.agents/mcp_config.json):

```json
{
  "mcpServers": {
    "novamart-tools": {
      "command": "node",
      "args": [
        "c:/Users/chand/OneDrive/Desktop/E-Commerce-Platform/backend/src/mcp/novamartMcpServer.js"
      ],
      "env": {
        "DATABASE_URL": "postgresql://postgres.kutpcoyfukvvwewwxmmm:%2312Quasar-0411@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
      }
    }
  }
}
```

### To Use in Claude Desktop:
Add the block to `%APPDATA%\Claude\claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "novamart": {
      "command": "node",
      "args": ["C:/Users/chand/OneDrive/Desktop/E-Commerce-Platform/backend/src/mcp/novamartMcpServer.js"],
      "env": {
        "DATABASE_URL": "postgresql://postgres.kutpcoyfukvvwewwxmmm:%2312Quasar-0411@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
      }
    }
  }
}
```

---

## 🧑‍💻 6. How to Build New Custom MCP Tools (Step-by-Step)

To add a new tool to [`backend/src/mcp/novamartMcpServer.js`](file:///c:/Users/chand/OneDrive/Desktop/E-Commerce-Platform/backend/src/mcp/novamartMcpServer.js):

### Step 1: Register Tool in `ListToolsRequestSchema`
```javascript
{
  name: 'restock_product',
  description: 'Add inventory quantity to a specific product by ID',
  inputSchema: {
    type: 'object',
    properties: {
      productId: { type: 'number', description: 'The product ID to restock' },
      addedQuantity: { type: 'number', description: 'Number of units to add' }
    },
    required: ['productId', 'addedQuantity']
  }
}
```

### Step 2: Implement Execution Logic in `CallToolRequestSchema`
```javascript
case 'restock_product': {
  const { productId, addedQuantity } = args;
  const res = await db.query(
    `UPDATE products 
     SET stock_quantity = stock_quantity + $1 
     WHERE id = $2 
     RETURNING id, name, stock_quantity`,
    [addedQuantity, productId]
  );
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ message: 'Restock successful', product: res.rows[0] }, null, 2)
    }]
  };
}
```
