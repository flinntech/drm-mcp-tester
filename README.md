# DRM MCP Tester

Automated test suite for the Digi Remote Manager (DRM) Model Context Protocol (MCP) Server.

## Prerequisites

- Node.js (v18+)
- A running DRM MCP Server (or credentials to connect to one)

## Configuration

The test suite relies on environment variables for authentication and test targets.

1. Copy the example configuration:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your details:

   **Authentication** (Required)
   - `MCP_SERVER_URL`: URL of the MCP server (default: `https://remotemanager.digi.com/mcp`)
   - `DRM_API_KEY_ID`: Your DRM API Key ID
   - `DRM_API_KEY_SECRET`: Your DRM API Key Secret

   **Test Targets** (Required for relevant tests)
   | Variable | Description |
   |----------|-------------|
   | `TEST_CONNECTED_DEVICE_ID` | UUID of a currently online device |
   | `TEST_DISCONNECTED_DEVICE_ID` | UUID of a currently offline device |
   | `TEST_DEVICE_NAME_SEARCH` | Partial name to search for (e.g. "ex50") |
   | `TEST_KNOWN_GROUP` | A group that exists in your account |
   | `TEST_KNOWN_DEVICE_TYPE` | A device type that exists (e.g. "Digi EX50") |
   | `TEST_VALID_ALERT_ID` | numeric ID of an existing alert |
   | `TEST_VALID_MONITOR_ID` | numeric ID of an existing monitor |

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
