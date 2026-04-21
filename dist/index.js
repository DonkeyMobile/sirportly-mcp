#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const BASE_URL = process.env.SIRPORTLY_URL || "https://kerkdienstgemist.sirportly.com";
const TOKEN = process.env.SIRPORTLY_TOKEN || "";
const SECRET = process.env.SIRPORTLY_SECRET || "";
async function api(path, params = {}) {
    const body = new URLSearchParams(params);
    const headers = {
        "X-Auth-Token": TOKEN,
        "Content-Type": "application/x-www-form-urlencoded",
    };
    if (SECRET)
        headers["X-Auth-Secret"] = SECRET;
    const res = await fetch(`${BASE_URL}/api/v2${path}`, {
        method: "POST",
        headers,
        body,
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Sirportly API ${res.status}: ${text}`);
    }
    return res.json();
}
const server = new mcp_js_1.McpServer({
    name: "sirportly",
    version: "1.0.0",
});
// Get ticket by reference
server.tool("get_ticket", "Get full ticket details by reference (e.g. AB-123456)", { ticket: zod_1.z.string().describe("Ticket reference") }, async ({ ticket }) => ({
    content: [{ type: "text", text: JSON.stringify(await api("/tickets/ticket", { ticket }), null, 2) }],
}));
// List all tickets
server.tool("list_tickets", "List all tickets with pagination", {
    page: zod_1.z.number().optional().describe("Page number (default 1)"),
    sort_by: zod_1.z.string().optional().describe("Sort field: updated_at, created_at, reference, subject"),
    order: zod_1.z.enum(["asc", "desc"]).optional().describe("Sort direction"),
}, async (params) => {
    const p = {};
    if (params.page)
        p.page = String(params.page);
    if (params.sort_by)
        p.sort_by = params.sort_by;
    if (params.order)
        p.order = params.order;
    return { content: [{ type: "text", text: JSON.stringify(await api("/tickets/all", p), null, 2) }] };
});
// Search tickets
server.tool("search_tickets", "Full-text search for tickets", {
    query: zod_1.z.string().describe("Search query"),
    page: zod_1.z.number().optional().describe("Page number"),
}, async (params) => {
    const p = { query: params.query };
    if (params.page)
        p.page = String(params.page);
    return { content: [{ type: "text", text: JSON.stringify(await api("/tickets/search", p), null, 2) }] };
});
// List tickets by filter
server.tool("filter_tickets", "List tickets matching a saved filter", {
    filter: zod_1.z.string().describe("Filter name or ID"),
    page: zod_1.z.number().optional().describe("Page number"),
    user: zod_1.z.string().optional().describe("Run filter as this user"),
}, async (params) => {
    const p = { filter: params.filter };
    if (params.page)
        p.page = String(params.page);
    if (params.user)
        p.user = params.user;
    return { content: [{ type: "text", text: JSON.stringify(await api("/tickets/filter", p), null, 2) }] };
});
// Create ticket
server.tool("create_ticket", "Submit a new ticket", {
    subject: zod_1.z.string().describe("Ticket subject"),
    status: zod_1.z.string().describe("Status name or ID"),
    priority: zod_1.z.string().describe("Priority name or ID"),
    department: zod_1.z.string().describe("Department name or ID"),
    team: zod_1.z.string().describe("Team name or ID"),
    message: zod_1.z.string().optional().describe("Initial message"),
    contact_name: zod_1.z.string().optional().describe("Contact name"),
    contact_method_type: zod_1.z.enum(["email", "telephone"]).optional(),
    contact_method_data: zod_1.z.string().optional().describe("Email or phone"),
    user: zod_1.z.string().optional().describe("Assigned user"),
    tag_list: zod_1.z.string().optional().describe("Comma-separated tags"),
}, async (params) => {
    const p = {
        subject: params.subject,
        status: params.status,
        priority: params.priority,
        department: params.department,
        team: params.team,
    };
    if (params.message)
        p.message = params.message;
    if (params.contact_name)
        p.contact_name = params.contact_name;
    if (params.contact_method_type)
        p.contact_method_type = params.contact_method_type;
    if (params.contact_method_data)
        p.contact_method_data = params.contact_method_data;
    if (params.user)
        p.user = params.user;
    if (params.tag_list)
        p.tag_list = params.tag_list;
    return { content: [{ type: "text", text: JSON.stringify(await api("/tickets/submit", p), null, 2) }] };
});
// Update ticket properties
server.tool("update_ticket", "Change ticket properties (status, priority, assignment, etc.)", {
    ticket: zod_1.z.string().describe("Ticket reference"),
    status: zod_1.z.string().optional().describe("Status name or ID"),
    priority: zod_1.z.string().optional().describe("Priority name or ID"),
    department: zod_1.z.string().optional().describe("Department ID"),
    team: zod_1.z.string().optional().describe("Team name or ID"),
    user: zod_1.z.string().optional().describe("Assigned user"),
    subject: zod_1.z.string().optional().describe("New subject"),
    tag_list: zod_1.z.string().optional().describe("Comma-separated tags"),
}, async (params) => {
    const p = { ticket: params.ticket };
    if (params.status)
        p.status = params.status;
    if (params.priority)
        p.priority = params.priority;
    if (params.department)
        p.department = params.department;
    if (params.team)
        p.team = params.team;
    if (params.user)
        p.user = params.user;
    if (params.subject)
        p.subject = params.subject;
    if (params.tag_list)
        p.tag_list = params.tag_list;
    return { content: [{ type: "text", text: JSON.stringify(await api("/tickets/update", p), null, 2) }] };
});
// Post update to ticket
server.tool("post_update", "Post a reply/note to a ticket", {
    ticket: zod_1.z.string().describe("Ticket reference"),
    message: zod_1.z.string().describe("Message content"),
    user: zod_1.z.string().optional().describe("Post as this staff user"),
    private: zod_1.z.boolean().optional().describe("Private note (staff only)"),
    subject: zod_1.z.string().optional().describe("Reply subject"),
}, async (params) => {
    const p = { ticket: params.ticket, message: params.message };
    if (params.user)
        p.user = params.user;
    if (params.private !== undefined)
        p.private = params.private ? "1" : "0";
    if (params.subject)
        p.subject = params.subject;
    return { content: [{ type: "text", text: JSON.stringify(await api("/tickets/post_update", p), null, 2) }] };
});
// Run SPQL query
server.tool("run_spql", "Run a Sirportly Query Language (SPQL) query", {
    spql: zod_1.z.string().describe("SPQL query string"),
    page: zod_1.z.number().optional().describe("Page number"),
}, async (params) => {
    const p = { spql: params.spql };
    if (params.page)
        p.page = String(params.page);
    return { content: [{ type: "text", text: JSON.stringify(await api("/tickets/spql", p), null, 2) }] };
});
// List statuses
server.tool("list_statuses", "Get all ticket statuses", {}, async () => ({
    content: [{ type: "text", text: JSON.stringify(await api("/objects/statuses"), null, 2) }],
}));
// List priorities
server.tool("list_priorities", "Get all ticket priorities", {}, async () => ({
    content: [{ type: "text", text: JSON.stringify(await api("/objects/priorities"), null, 2) }],
}));
// List teams
server.tool("list_teams", "Get all teams", {}, async () => ({
    content: [{ type: "text", text: JSON.stringify(await api("/objects/teams"), null, 2) }],
}));
// List departments
server.tool("list_departments", "Get all departments", {}, async () => ({
    content: [{ type: "text", text: JSON.stringify(await api("/objects/departments"), null, 2) }],
}));
// List brands
server.tool("list_brands", "Get all brands", {}, async () => ({
    content: [{ type: "text", text: JSON.stringify(await api("/objects/brands"), null, 2) }],
}));
// List filters
server.tool("list_filters", "Get all saved ticket filters", {}, async () => ({
    content: [{ type: "text", text: JSON.stringify(await api("/objects/filters"), null, 2) }],
}));
// List users
server.tool("list_users", "Get all staff users", {}, async () => ({
    content: [{ type: "text", text: JSON.stringify(await api("/objects/users"), null, 2) }],
}));
// Start server
async function main() {
    if (!TOKEN) {
        console.error("Set SIRPORTLY_TOKEN environment variable (SIRPORTLY_SECRET is optional)");
        process.exit(1);
    }
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
