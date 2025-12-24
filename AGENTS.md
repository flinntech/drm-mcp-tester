# AGENTS.md

Context file for AI coding assistants (Claude, Gemini, Copilot, etc.) working with this repository.

## Project Overview

**DRM MCP Tester** is an automated test suite for the Digi Remote Manager (DRM) Model Context Protocol (MCP) Server. It validates 50+ MCP tools across 13 categories with 172 test cases.

**Current Status (2025-12-24):** 168 passed, 4 failed — failures are tracked bugs in `MCP_SERVER_BUG_REPORT.md`

## Quick Start

```bash
npm install          # Install dependencies
npm test             # Run all tests
npm run test:watch   # Watch mode
```

## Key Files

| File | Purpose |
|------|---------|
| `MCP_SERVER_BUG_REPORT.md` | **Active bugs** — 4 doc issues, 2 functional, 1 platform |
| `drm-mcp-test-plan.md` | Test specification |
| `tests/setup/test-fixtures.ts` | Device IDs, groups, timeframes |
| `tests/setup/mcp-client.ts` | MCP client wrapper |
| `.env` | API credentials (not committed) |

## Test Philosophy

**Tests are the specification.** If the MCP server deviates from test expectations:
1. Let the test fail
2. Document in `MCP_SERVER_BUG_REPORT.md`
3. Do NOT modify tests to match buggy behavior

## DRM Query Syntax

```typescript
// ✅ Correct
query: "connection_status='connected'"
query: "type contains 'EX50'"
query: "signal_percent>50 and health_status='normal'"

// ❌ Wrong - no equals operator, use =
query: "type equals 'EX50'"  // Will fail!
```

**Operators:** `=`, `<>`, `>`, `<`, `contains`, `startswith`  
**Boolean:** `and`, `or`  
**Time:** `-1h`, `-7d`, `-24h`

## MCP Client Usage

```typescript
import { mcpClient } from '../setup/mcp-client.js';
import { TEST_CONFIG } from '../setup/test-fixtures.js';

const result = await mcpClient.callTool('list_devices', {
    query: "connection_status='connected'",
    use_case: 'test'
});
const data = JSON.parse(result.content[0].text);
```

## Known Bugs (Why Tests Fail)

| Bug | Severity | Issue |
|-----|----------|-------|
| FUNC-001 | HIGH | `list_events` broken (Python NameError) |
| FUNC-002 | Low | `validate_query_syntax` accepts invalid `equals` |
| PLAT-001 | Medium | Cached data not indicated for disconnected devices |

See `MCP_SERVER_BUG_REPORT.md` for full details.

## Environment Setup

Create `.env` with:
```bash
DRM_API_KEY_ID="your_key_id"
DRM_API_KEY_SECRET="your_secret"
TEST_CONNECTED_DEVICE_ID="00000000-00000000-00409DFF-FFDDEAFD"
TEST_DISCONNECTED_DEVICE_ID="00000000-00000000-0040FFFF-FF0F5C54"
TEST_DEVICE_NAME_SEARCH="ex50"
TEST_KNOWN_GROUP="Brisbane"
TEST_KNOWN_DEVICE_TYPE="Digi EX50"
```

## Test Categories

| Prefix | Category | File |
|--------|----------|------|
| QS-* | Query Syntax | `query-syntax.test.ts` |
| DEV-* | Devices | `devices.test.ts` |
| STR-* | Streams | `streams.test.ts` |
| SCI-* | SCI/RCI | `sci-rci.test.ts` |
| EVT-* | Events | `account-admin.test.ts` |
| ALR-* | Alerts | `alerts.test.ts` |
| MON-* | Monitors | `monitors.test.ts` |
| AUT-* | Automations | `automations.test.ts` |
| JOB-*/FW-* | Jobs/Firmware | `jobs-firmware.test.ts` |
