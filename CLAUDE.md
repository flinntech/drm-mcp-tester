# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DRM MCP Tester is a test specification project for a Digi Remote Manager (DRM) Model Context Protocol (MCP) Server. It contains a comprehensive test plan (`drm-mcp-test-plan.md`) covering 50+ tools across 13 categories with 150+ test cases.

## Test Framework

The project recommends **Vitest or Jest** for test automation. No implementation exists yet - only the test plan specification.

### Recommended Test Structure

```
tests/
├── setup/
│   ├── test-fixtures.ts       # TEST_CONFIG with device IDs, groups, timeframes
│   └── mcp-client.ts          # MCP client wrapper for calling tools
├── categories/
│   ├── query-syntax.test.ts   # QS-* tests
│   ├── devices.test.ts        # DEV-* tests
│   ├── streams.test.ts        # STR-* tests
│   └── ...                    # One file per category
├── integration/
│   └── end-to-end.test.ts
└── reports/
    └── coverage.json
```

## DRM Query Syntax Rules

When writing tests or tool calls involving queries:

- **Use single quotes** for values: `query: "connection_status='connected'"`
- **No `equals` operator** - use `=` instead
- **Operators**: `=`, `contains`, `startswith`, `>`, `<`
- **Boolean operators**: `and`, `or`
- **Compound example**: `"connection_status='connected' and signal_percent>50"`
- **Time ranges**: Use relative format like `-1h`, `-7d`, `-24h`

## Test Categories

| Category | Test ID Prefix | Tool Count |
|----------|---------------|------------|
| Query Syntax Helpers | QS-* | 5 |
| Device Listing & Search | DEV-* | 4 |
| Data Streams | STR-* | 7 |
| Device Diagnostics | DIAG-* | 3 |
| SCI/RCI Device Queries | SCI-* | 3 |
| Groups | GRP-* | 1 |
| Alerts | ALR-* | 2 |
| Monitors (Webhooks) | MON-* | 3 |
| Automations | AUT-* | 6 |
| Jobs & Firmware | JOB-*, FW-* | 7 |
| Configuration & Health | CFG-*, HLT-* | 4 |
| Account & Admin | ACC-*, USR-*, EVT-*, FS-*, API-* | 11 |
| Location Services | LOC-* | 1 |

## Test Execution Phases

1. **Smoke Tests** - One test per tool for connectivity
2. **Happy Path** - All tests with valid inputs
3. **Error Handling** - Edge cases and error scenarios
4. **Performance** - Response time assertions (list <5s, single <2s, bulk <30s)
5. **Integration** - Cross-tool workflows

## Test Fixtures Pattern

All tests include `use_case: 'test'` parameter for identification. Test configuration should define:
- `CONNECTED_DEVICE_ID` / `DISCONNECTED_DEVICE_ID`
- `DEVICE_NAME_SEARCH`, `KNOWN_GROUP`, `KNOWN_DEVICE_TYPE`
- `RECENT_TIMEFRAME` (-1h) / `HISTORICAL_TIMEFRAME` (-7d)

## Expected Response Patterns

- **List operations**: `{ count, size, list, cursor }`
- **Detail operations**: Full object with all properties
- **Error cases**: `{ error: "message" }`
