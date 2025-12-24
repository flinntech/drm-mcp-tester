# DRM MCP Server Bug Report

Generated: 2024-12-24

This report documents discrepancies between expected MCP server behavior (as specified in test cases) and actual server responses.

## Summary

| Category | Bug ID | Severity | Status |
|----------|--------|----------|--------|
| Account/Admin | BUG-001 | Medium | Open |
| Account/Admin | BUG-002 | Medium | Open |
| Account/Admin | BUG-003 | High | Open |
| Query Syntax | BUG-004 | Medium | Open |
| Devices | BUG-005 | Low | Open |
| Streams | BUG-006 | Medium | Open |

---

## BUG-001: `current_login` returns `id` instead of `api_key_id`

**Test:** ACC-002
**Tool:** `current_login`

### Expected Response
```json
{
  "customer_id": 2899,
  "api_key_id": "ff7091a384882b0269979f991274dedb",
  "username": "jflinn",
  ...
}
```

### Actual Response
```json
{
  "id": "ff7091a384882b0269979f991274dedb",
  "customer_id": 2899,
  "username": "jflinn",
  "description": "Claude Desktop",
  "expires": "2026-12-24T13:52:34.797Z",
  "created": "2025-12-24T13:52:34.927Z",
  "last_used": "2025-12-24T15:46:40.447Z"
}
```

### Issue
The field containing the API key ID is named `id` instead of `api_key_id`. This is inconsistent with the tool description which references "API key ID".

### Recommendation
Either rename the field to `api_key_id` for clarity, or update the tool description to reflect that the field is named `id`.

---

## BUG-002: `current_account` returns `company_name` instead of `account_name`

**Test:** ACC-003
**Tool:** `current_account`

### Expected Response
```json
{
  "customer_id": 2899,
  "account_name": "Digi International Inc - BC Test Acct",
  ...
}
```

### Actual Response
```json
{
  "customer_id": 2899,
  "company_name": "Digi International Inc - BC Test Acct",
  "creation_date": "2012-12-22T14:23:43.380Z"
}
```

### Issue
The field is named `company_name` instead of `account_name`. The tool is called `current_account` but returns `company_name`.

### Recommendation
Rename the field to `account_name` for consistency with the tool name.

---

## BUG-003: `list_events` returns Internal Server Error

**Test:** EVT-001, EVT-003
**Tool:** `list_events`

### Expected Response
```json
{
  "count": 100,
  "list": [...],
  "cursor": "..."
}
```

### Actual Response
```
Internal error: Error calling tool 'list_events': name 'orderby' is not defined
```

### Issue
The `list_events` tool has a Python NameError - the variable `orderby` is referenced before being defined in the server code.

### Severity
**HIGH** - This tool is completely non-functional.

### Recommendation
Fix the Python code in the MCP server to properly define the `orderby` variable before use.

---

## BUG-004: `validate_query_syntax` incorrectly accepts `equals` operator

**Test:** QS-017
**Tool:** `validate_query_syntax`

### Input
```json
{
  "query": "type equals 'EX50'"
}
```

### Expected Response
```json
{
  "valid": false,
  "errors": ["Invalid operator 'equals'. Use '=' instead."]
}
```

### Actual Response
```json
{
  "valid": true,
  "query": "type equals 'EX50'",
  "errors": [],
  "warnings": [],
  "message": "✅ Query syntax appears valid"
}
```

### Issue
The `equals` operator is NOT supported by the DRM API - only `=` works. But `validate_query_syntax` incorrectly reports it as valid. This will cause users to write queries that will fail when executed.

### DRM Query Syntax (per CLAUDE.md)
- Use `=` for equality, NOT `equals`
- Supported operators: `=`, `contains`, `startswith`, `>`, `<`

### Recommendation
Add validation to reject `equals` and suggest using `=` instead.

---

## BUG-005: `find_device_id_by_name` returns CSV header only for no-match

**Test:** DEV-021
**Tool:** `find_device_id_by_name`

### Input
```json
{
  "device_search": "zzzznonexistent"
}
```

### Expected Response
One of:
- Empty array: `[]`
- Message: `"No devices found"`
- Empty result with message: `{"count": 0, "list": []}`

### Actual Response
```
name,id
```
(CSV with header only, no data rows)

### Issue
When no devices match, the tool returns just the CSV header with no indication that the result is empty. This is ambiguous and harder to parse than a proper "no results" response.

### Recommendation
Return either:
- An empty JSON array: `[]`
- A JSON object: `{"count": 0, "list": [], "message": "No devices found matching 'zzzznonexistent'"}`

---

## BUG-006: `list_streams_bulk` doesn't support `stream_id` field

**Test:** STR-006
**Tool:** `list_streams_bulk`

### Input
```json
{
  "fields": "stream_id,description"
}
```

### Expected Response
CSV with `stream_id` and `description` columns

### Actual Response
```
Internal error: DRM API call GET /v1/streams/bulk failed with HTTP status code 400: 
error_code,error_context,error_message,error_status
,,"The specified field is not part of the default output: stream_id",400
```

### Issue
The bulk API uses `id` as the field name, not `stream_id`. However, `stream_id` is a more descriptive name that should be supported (or documented as an alias).

### Recommendation
Either support `stream_id` as an alias for `id`, or clearly document that the field is named `id`.

---

## BUG-007: `get_stream` returns `value` instead of `current_value`

**Test:** STR-007
**Tool:** `get_stream`

### Expected Response
```json
{
  "stream_id": "...",
  "current_value": "646107.82",
  "timestamp": "...",
  ...
}
```

### Actual Response
```json
{
  "id": "00000000-00000000-00042DFF-FF057176/carrier/.../usage/data/transferred",
  "value": "646107.82",
  "type": "DOUBLE",
  "timestamp": "2017-05-19T08:00:00.000Z",
  ...
}
```

### Issue
- Field is named `id` instead of `stream_id`
- Field is named `value` instead of `current_value`

### Recommendation
Rename fields to be more descriptive:
- `id` → `stream_id`
- `value` → `current_value`

---

## Test Data Issue (Not an MCP Bug)

### SCI-007: TEST_DISCONNECTED_DEVICE_ID is actually connected

The test uses `TEST_DISCONNECTED_DEVICE_ID` from environment variables. If this device is actually connected, the test will incorrectly pass/fail.

**Resolution:** Ensure test fixtures have a truly disconnected device ID, OR update test to verify device connection status first.

---

## How to Use This Report

1. **For MCP Server Developers:** Use this report to prioritize and fix bugs in order of severity
2. **For Test Suite Maintainers:** Keep tests as-is to catch regressions when bugs are fixed
3. **For Users:** Be aware of these issues when using the affected tools
