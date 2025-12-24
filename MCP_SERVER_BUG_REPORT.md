# DRM MCP Server Bug Report

Generated: 2024-12-24

This report documents issues found during MCP server testing, organized by category.

---

## Summary

### Documentation Issues (Tool descriptions don't match API response)
| Bug ID | Tool | Issue |
|--------|------|-------|
| DOC-001 | `current_login` | Description says "API key ID", field is `id` |
| DOC-002 | `current_account` | Description says "account name", field is `company_name` |
| DOC-003 | `list_streams_bulk` | Docs imply `stream_id`, field is `id` |
| DOC-004 | `get_stream` | Description says "current value", field is `value` |

### Functional Bugs (Broken or incorrect behavior)
| Bug ID | Severity | Tool | Issue |
|--------|----------|------|-------|
| FUNC-001 | **HIGH** | `list_events` | Python NameError - tool completely broken |
| FUNC-002 | Low | `validate_query_syntax` | Accepts invalid `equals` operator |


### Platform Issues (DRM backend, not just MCP)
| Bug ID | Severity | Issue |
|--------|----------|-------|
| PLAT-001 | Medium | Cached data returned without indication for disconnected devices |

---

# Documentation Issues

These are cases where the tool description doesn't match the actual API response field names.

**Why this matters for LLMs:** LLMs read tool descriptions to understand what data to expect. When a description says "API key ID" but the actual field is `id`, the LLM may:
- Fail to find the expected field in the response
- Incorrectly map data to the wrong variables
- Generate confusing or incorrect answers for users

**Recommended fix:** Update tool descriptions to match actual field names.

## DOC-001: `current_login` - "API key ID" vs `id`

**Test:** ACC-002

**Tool Description says:**
> Get the current user login information, including the customer ID, username, **API key ID** and description

**Actual API response:**
```json
{
  "id": "ff7091a384882b0269979f991274dedb",
  "customer_id": 2899,
  "username": "jflinn",
  ...
}
```

**Fix:** Update description to say "id" instead of "API key ID"

---

## DOC-002: `current_account` - "account name" vs `company_name`

**Test:** ACC-003

**Tool Description says:**
> Get the current account including the customer ID and **account name**

**Actual API response:**
```json
{
  "customer_id": 2899,
  "company_name": "Digi International Inc - BC Test Acct",
  ...
}
```

**Fix:** Update description to say "company_name" instead of "account name"

---

## DOC-003: `list_streams_bulk` - `stream_id` vs `id`

**Test:** STR-006

**Issue:** Requesting `fields: 'stream_id,description'` returns error because field is named `id`, not `stream_id`.

**Fix:** Update documentation to clarify the field is named `id`

---

## DOC-004: `get_stream` - "current value" vs `value`

**Test:** STR-007

**Tool Description says:**
> Get details of a specific data stream including **current value**, data type, units...

**Actual API response:**
```json
{
  "id": "...",
  "value": "646107.82",
  "type": "DOUBLE",
  ...
}
```

**Fix:** Update description to say "value" instead of "current value"

---

# Functional Bugs

These are actual bugs where the tool behavior is incorrect or broken.

## FUNC-001: `list_events` - Python NameError (HIGH SEVERITY)

**Test:** EVT-001, EVT-003

**Error:**
```
Internal error: Error calling tool 'list_events': name 'orderby' is not defined
```

**Impact:** Tool is completely non-functional.

**Fix:** Fix Python code - define `orderby` variable before use.

---

## FUNC-002: `validate_query_syntax` - Accepts invalid `equals` operator

**Test:** QS-017

**Input:**
```json
{"query": "type equals 'EX50'"}
```

**Validator Response:** ✅ Valid

**Actual API Response:** 
```
Invalid input 'q', expected 'n/N' (line 1, pos 7):
type equals 'EX50'
      ^
```

**Impact:** Users write queries that pass validation but fail at runtime.

**Fix:** Add validation to reject `equals` operator, suggest using `=` instead.

---

# Platform Issues

These affect DRM broadly, not just the MCP server.

## PLAT-001: Cached data returned without indication for disconnected devices

**Test:** SCI-007

**Issue:** When querying state for a disconnected device, DRM returns stale cached data (from 2019) without any indication that:
1. The device is disconnected
2. The data is cached/stale
3. When the data was captured

**Example Response:**
```xml
<system_time>14 February 2019, 14:12:18</system_time>
```

**Impact:** Users may act on stale data thinking it's current. Affects both MCP and DRM UI.

**Fix:** Add indication when returning cached data (e.g., `"cached": true` flag or warning message).

---

## Test Status

After fixing these issues, the following tests should pass:

| Category | Tests |
|----------|-------|
| Documentation fixes | ACC-002, ACC-003, STR-006, STR-007 |
| Functional fixes | EVT-001, EVT-003, QS-017 |
| Platform fixes | SCI-007 |
