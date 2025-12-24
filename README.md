# DRM MCP Tester

Automated test suite for the Digi Remote Manager (DRM) Model Context Protocol (MCP) Server.

## Prerequisites

- Node.js (v18+)
- A running DRM MCP Server (or credentials to connect to one)

## Configuration

Set the following environment variables to connect to the MCP server:

```bash
export MCP_SERVER_URL="https://remotemanager.digi.com/mcp"
export DRM_API_KEY_ID="your_api_key_id"
export DRM_API_KEY_SECRET="your_api_key_secret"
```

You can also override test configuration defaults:

```bash
export TEST_CONNECTED_DEVICE_ID="your_device_id"
export TEST_KNOWN_GROUP="your_group"
```

## Running Tests

Install dependencies:

```bash
npm install
```

Run all tests:

```bash
npm test
```

Run with coverage:

```bash
npm run test:coverage
```

## Test Structure

- `tests/categories/`: Individual test files for each of the 13 categories.
- `tests/setup/`: Configuration and MCP client wrapper.
- `tests/integration/`: End-to-end workflows.
- `tests/reports/`: Generated test reports and artifact storage.

## Key Documentation

| File | Purpose |
|------|---------|
| `MCP_SERVER_BUG_REPORT.md` | **Critical:** Tracks known bugs and deviations between spec and implementation. |
| `AGENTS.md` | Context and guidelines for AI agents working in this repo. |
| `drm-mcp-test-plan.md` | The original test specification and plan. |

## License

ISC
