# Sirportly MCP Server

MCP server for [Sirportly](https://sirportly.com) helpdesk integration with Kiro CLI.

## Setup

### 1. Create API credentials

In Sirportly, go to **Admin → API Access** and create a new API token. You'll receive a **token** and **secret**.

### 2a. Kiro CLI configuration

Add to `~/.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "sirportly": {
      "command": "npx",
      "args": ["-y", "github:DonkeyMobile/sirportly-mcp"],
      "env": {
        "SIRPORTLY_URL": "https://<your-account>.sirportly.com",
        "SIRPORTLY_TOKEN": "<your-token>",
        "SIRPORTLY_SECRET": "<your-secret>"
      }
    }
  }
}
```

### 2b. Claude Code

```shell
claude mcp add-json sirportly '{"type":"stdio","command":"npx","args":["-y", "github:DonkeyMobile/sirportly-mcp"],"env":{"SIRPORTLY_URL": "https://kerkdienstgemist.sirportly.com","SIRPORTLY_TOKEN": "<your-token>","SIRPORTLY_SECRET": "<your-secret>"}}'
```

### Locally

Alternatively, clone the repo and run locally:

```bash
git clone git@github.com:DonkeyMobile/sirportly-mcp.git
cd sirportly-mcp
npm install
npm run build
```

Then use `"command": "node"` with `"args": ["/path/to/sirportly-mcp/dist/index.js"]` instead.

## Available tools

| Tool | Description |
|------|-------------|
| `get_ticket` | Get ticket details by reference (e.g. AB-123456) |
| `list_tickets` | List all tickets with pagination |
| `search_tickets` | Full-text search across tickets |
| `filter_tickets` | List tickets matching a saved filter |
| `create_ticket` | Submit a new ticket |
| `update_ticket` | Change ticket properties (status, priority, assignment, etc.) |
| `post_update` | Post a reply or internal note to a ticket |
| `run_spql` | Execute a Sirportly Query Language (SPQL) query |
| `list_statuses` | Get all ticket statuses |
| `list_priorities` | Get all priorities |
| `list_teams` | Get all teams |
| `list_departments` | Get all departments |
| `list_brands` | Get all brands |
| `list_filters` | Get all saved filters |
| `list_users` | Get all staff users |
