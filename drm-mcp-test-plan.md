# DRM MCP Server Test Plan

## Overview

This test plan provides systematic coverage of all DRM MCP server tools. Tests are organized by category and designed for automation using a test framework like Vitest or Jest.

**Total Tools:** 50+  
**Test Categories:** 12  
**Estimated Test Cases:** 150+

---

## Test Environment Requirements

### Prerequisites
- Valid DRM API credentials configured
- At least one connected device in the account
- At least one disconnected device in the account
- Test device with known ID for targeted tests
- Test data streams with historical data
- At least one configured alert, automation, and monitor

### Test Data Setup
```typescript
// test-fixtures.ts
export const TEST_CONFIG = {
  // Use actual device IDs from your account
  CONNECTED_DEVICE_ID: '00000000-00000000-00409DFF-FFDDEAFD', // EX50
  DISCONNECTED_DEVICE_ID: '00000000-00000000-0040FFFF-FF800460',
  DEVICE_NAME_SEARCH: 'EX50',
  KNOWN_GROUP: 'Demo Group',
  KNOWN_DEVICE_TYPE: 'Digi EX50',
  // Timeframes
  RECENT_TIMEFRAME: '-1h',
  HISTORICAL_TIMEFRAME: '-7d',
};
```

---

## Category 1: Query Syntax Helpers

These tools help users construct valid queries. No external dependencies required.

### 1.1 get_query_syntax_rules

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| QS-001 | Basic invocation | `{}` | Returns syntax rules documentation |
| QS-002 | Response structure | `{}` | Contains operators, examples, field info |

### 1.2 get_query_syntax_help

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| QS-003 | Basic invocation | `{}` | Returns comprehensive query guide |
| QS-004 | Single quote reminder | `{}` | Response mentions single quotes requirement |

### 1.3 get_device_fields

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| QS-005 | Basic invocation | `{}` | Returns list of queryable device fields |
| QS-006 | Field metadata | `{}` | Each field has type, description, examples |

### 1.4 get_query_examples

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| QS-007 | No filter | `{}` | Returns all example categories |
| QS-008 | Filter by type - general | `{query_type: 'general_filtering'}` | Returns general filtering examples |
| QS-009 | Filter by type - status | `{query_type: 'filter_by_status'}` | Returns status filter examples |
| QS-010 | Filter by type - signal | `{query_type: 'filter_by_signal'}` | Returns signal filter examples |
| QS-011 | Filter by type - time | `{query_type: 'filter_by_time'}` | Returns time filter examples |
| QS-012 | Invalid filter type | `{query_type: 'invalid_type'}` | Graceful handling or error message |

### 1.5 validate_query_syntax

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| QS-013 | Valid query - equals | `{query: "connection_status='connected'"}` | Validation passes |
| QS-014 | Valid query - contains | `{query: "type contains 'EX50'"}` | Validation passes |
| QS-015 | Valid query - compound | `{query: "connection_status='connected' and signal_percent>50"}` | Validation passes |
| QS-016 | Invalid - double quotes | `{query: 'type="EX50"'}` | Error: must use single quotes |
| QS-017 | Invalid - bad operator | `{query: "type equals 'EX50'"}` | Error: invalid operator |
| QS-018 | Empty query | `{query: ''}` | Validation passes (no filter) |

---

## Category 2: Device Listing & Search

### 2.1 list_devices

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| DEV-001 | No filter | `{use_case: 'test'}` | Returns all devices with count |
| DEV-002 | Filter connected | `{query: "connection_status='connected'", use_case: 'test'}` | Only connected devices |
| DEV-003 | Filter disconnected | `{query: "connection_status='disconnected'", use_case: 'test'}` | Only disconnected devices |
| DEV-004 | Filter by type contains | `{query: "type contains 'EX50'", use_case: 'test'}` | Devices matching type |
| DEV-005 | Filter by signal | `{query: "signal_percent<50", use_case: 'test'}` | Low signal devices |
| DEV-006 | Filter by group | `{query: "group startswith '/Demo'", use_case: 'test'}` | Devices in group |
| DEV-007 | Filter by health | `{query: "health_status='error'", use_case: 'test'}` | Unhealthy devices |
| DEV-008 | Compound filter | `{query: "connection_status='connected' and signal_percent>50", use_case: 'test'}` | Combined criteria |
| DEV-009 | Order by name | `{orderby: 'name asc', use_case: 'test'}` | Sorted alphabetically |
| DEV-010 | Order by signal desc | `{orderby: 'signal_percent desc', use_case: 'test'}` | Highest signal first |
| DEV-011 | Pagination - size | `{size: 10, use_case: 'test'}` | Returns max 10 devices |
| DEV-012 | Pagination - cursor | `{size: 10, cursor: '<from_prev>', use_case: 'test'}` | Returns next page |
| DEV-013 | Invalid query syntax | `{query: "bad query syntax", use_case: 'test'}` | Error message returned |
| DEV-014 | Response structure | `{use_case: 'test'}` | Has count, size, list, cursor fields |

### 2.2 list_devices_bulk

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| DEV-015 | Basic CSV export | `{use_case: 'test'}` | Returns CSV formatted data |
| DEV-016 | Specific fields | `{fields: 'id,name,connection_status', use_case: 'test'}` | Only specified fields |
| DEV-017 | With filter | `{query: "connection_status='connected'", use_case: 'test'}` | Filtered CSV |
| DEV-018 | With ordering | `{orderby: 'name asc', use_case: 'test'}` | Sorted CSV |

### 2.3 find_device_id_by_name

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| DEV-019 | Exact match | `{device_search: 'EX50', use_case: 'test'}` | Returns matching devices |
| DEV-020 | Partial match | `{device_search: 'ex', use_case: 'test'}` | Returns partial matches |
| DEV-021 | No match | `{device_search: 'zzzznonexistent', use_case: 'test'}` | Empty or no results message |
| DEV-022 | Case insensitive | `{device_search: 'EX50', use_case: 'test'}` vs `{device_search: 'ex50', use_case: 'test'}` | Same results |

### 2.4 get_device

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| DEV-023 | Valid device ID | `{device_id: '<VALID_ID>', use_case: 'test'}` | Full device details |
| DEV-024 | Invalid device ID | `{device_id: 'invalid-id-format', use_case: 'test'}` | Error message |
| DEV-025 | Non-existent ID | `{device_id: '00000000-00000000-00000000-00000000', use_case: 'test'}` | Not found error |
| DEV-026 | Response completeness | `{device_id: '<VALID_ID>', use_case: 'test'}` | Has mac, type, status, health, etc. |

---

## Category 3: Data Streams

### 3.1 list_streams

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| STR-001 | No filter | `{use_case: 'test'}` | Returns all streams |
| STR-002 | Filter by device | `{query: "device_id='<DEVICE_ID>'", use_case: 'test'}` | Streams for device |
| STR-003 | With pagination | `{size: 10, use_case: 'test'}` | Limited results |
| STR-004 | With ordering | `{orderby: 'timestamp desc', use_case: 'test'}` | Sorted results |

### 3.2 list_streams_bulk

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| STR-005 | Basic CSV export | `{use_case: 'test'}` | Returns CSV data |
| STR-006 | Specific fields | `{fields: 'stream_id,description', use_case: 'test'}` | Specified fields only |

### 3.3 get_stream

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| STR-007 | Valid stream ID | `{stream_id: '<DEVICE_ID>/stream_name', use_case: 'test'}` | Stream metadata |
| STR-008 | Invalid stream ID | `{stream_id: 'invalid', use_case: 'test'}` | Error message |

### 3.4 get_stream_history

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| STR-009 | Basic history | `{stream_id: '<STREAM_ID>', use_case: 'test'}` | Historical data points |
| STR-010 | With time range | `{stream_id: '<STREAM_ID>', start_time: '-1d', end_time: '-1h', use_case: 'test'}` | Filtered by time |
| STR-011 | With size limit | `{stream_id: '<STREAM_ID>', size: 100, use_case: 'test'}` | Max 100 points |
| STR-012 | Order ascending | `{stream_id: '<STREAM_ID>', order: 'asc', use_case: 'test'}` | Oldest first |
| STR-013 | Order descending | `{stream_id: '<STREAM_ID>', order: 'desc', use_case: 'test'}` | Newest first |

### 3.5 get_stream_history_bulk

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| STR-014 | Basic CSV export | `{stream_id: '<STREAM_ID>', use_case: 'test'}` | CSV data |
| STR-015 | With time range | `{stream_id: '<STREAM_ID>', start_time: '-7d', use_case: 'test'}` | Filtered CSV |

### 3.6 get_stream_rollups

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| STR-016 | Hourly average | `{stream_id: '<STREAM_ID>', interval: '1h', method: 'avg', use_case: 'test'}` | Hourly averages |
| STR-017 | Daily max | `{stream_id: '<STREAM_ID>', interval: '1d', method: 'max', use_case: 'test'}` | Daily maximums |
| STR-018 | With time range | `{stream_id: '<STREAM_ID>', interval: '1h', start_time: '-7d', use_case: 'test'}` | Filtered rollups |
| STR-019 | Count method | `{stream_id: '<STREAM_ID>', interval: '1d', method: 'count', use_case: 'test'}` | Data point counts |

### 3.7 get_stream_rollups_bulk

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| STR-020 | Basic CSV export | `{stream_id: '<STREAM_ID>', use_case: 'test'}` | CSV rollup data |

---

## Category 4: Device Diagnostics

### 4.1 get_device_event_logs

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| DIAG-001 | Default (1 hour) | `{device_id: '<DEVICE_ID>', use_case: 'test'}` | Recent logs |
| DIAG-002 | With time range | `{device_id: '<DEVICE_ID>', start_time: '-24h', use_case: 'test'}` | 24h of logs |
| DIAG-003 | With size limit | `{device_id: '<DEVICE_ID>', size: 50, use_case: 'test'}` | Max 50 entries |
| DIAG-004 | Invalid device | `{device_id: 'invalid', use_case: 'test'}` | Error message |

### 4.2 list_device_files

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| DIAG-005 | Root directory | `{device_id: '<CONNECTED_ID>', path: '/', hash: 'any', use_case: 'test'}` | Directory listing |
| DIAG-006 | Logs directory | `{device_id: '<CONNECTED_ID>', path: '/logs', hash: 'any', use_case: 'test'}` | Log files |
| DIAG-007 | With MD5 hash | `{device_id: '<CONNECTED_ID>', path: '/', hash: 'md5', use_case: 'test'}` | Files with MD5 |
| DIAG-008 | No hash | `{device_id: '<CONNECTED_ID>', path: '/', hash: 'none', use_case: 'test'}` | Files without hash |
| DIAG-009 | Invalid path | `{device_id: '<CONNECTED_ID>', path: '/nonexistent', hash: 'any', use_case: 'test'}` | Error or empty |
| DIAG-010 | Disconnected device | `{device_id: '<DISCONNECTED_ID>', path: '/', hash: 'any', use_case: 'test'}` | Appropriate error |

### 4.3 get_device_file

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| DIAG-011 | Valid file | `{device_id: '<CONNECTED_ID>', path: '/logs/messages', use_case: 'test'}` | File contents |
| DIAG-012 | Invalid path | `{device_id: '<CONNECTED_ID>', path: '/nonexistent.txt', use_case: 'test'}` | Error message |
| DIAG-013 | Disconnected device | `{device_id: '<DISCONNECTED_ID>', path: '/logs/messages', use_case: 'test'}` | Connection error |

---

## Category 5: SCI/RCI Device Queries

### 5.1 sci_query_device_state

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| SCI-001 | All state | `{device_id: '<CONNECTED_ID>', use_case: 'test'}` | Full device state |
| SCI-002 | Cellular state | `{device_id: '<CONNECTED_ID>', state_group: 'cellular', use_case: 'test'}` | Cellular info |
| SCI-003 | System state | `{device_id: '<CONNECTED_ID>', state_group: 'system', use_case: 'test'}` | System info |
| SCI-004 | Interface state | `{device_id: '<CONNECTED_ID>', state_group: 'interface', use_case: 'test'}` | Interface info |
| SCI-005 | Location state | `{device_id: '<CONNECTED_ID>', state_group: 'location', use_case: 'test'}` | GPS data |
| SCI-006 | Invalid group | `{device_id: '<CONNECTED_ID>', state_group: 'invalid', use_case: 'test'}` | Error or empty |
| SCI-007 | Disconnected device | `{device_id: '<DISCONNECTED_ID>', state_group: 'system', use_case: 'test'}` | Cached or error |

### 5.2 sci_query_device_settings

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| SCI-008 | All settings | `{device_id: '<CONNECTED_ID>', use_case: 'test'}` | Full settings |
| SCI-009 | Network settings | `{device_id: '<CONNECTED_ID>', setting_group: 'network', use_case: 'test'}` | Network config |
| SCI-010 | Cloud settings | `{device_id: '<CONNECTED_ID>', setting_group: 'cloud', use_case: 'test'}` | DRM config |
| SCI-011 | Auth settings | `{device_id: '<CONNECTED_ID>', setting_group: 'auth', use_case: 'test'}` | Auth config |
| SCI-012 | Invalid group | `{device_id: '<CONNECTED_ID>', setting_group: 'invalid', use_case: 'test'}` | Error or empty |

### 5.3 sci_query_descriptor

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| SCI-013 | Top level | `{device_id: '<CONNECTED_ID>', use_case: 'test'}` | Available elements |
| SCI-014 | Query state | `{device_id: '<CONNECTED_ID>', element: 'query_state', use_case: 'test'}` | State groups |
| SCI-015 | Query setting | `{device_id: '<CONNECTED_ID>', element: 'query_setting', use_case: 'test'}` | Setting groups |

---

## Category 6: Groups

### 6.1 list_groups

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| GRP-001 | No filter | `{use_case: 'test'}` | All groups |
| GRP-002 | Filter by path | `{query: "path startswith '/Demo'", use_case: 'test'}` | Matching groups |
| GRP-003 | With ordering | `{orderby: 'path asc', use_case: 'test'}` | Sorted groups |
| GRP-004 | With pagination | `{size: 10, use_case: 'test'}` | Limited results |

---

## Category 7: Alerts

### 7.1 list_alerts

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| ALR-001 | No filter | `{use_case: 'test'}` | All alerts |
| ALR-002 | Filter enabled | `{query: "status='enabled'", use_case: 'test'}` | Active alerts |
| ALR-003 | Filter by severity | `{query: "severity='critical'", use_case: 'test'}` | Critical alerts |
| ALR-004 | With pagination | `{size: 10, use_case: 'test'}` | Limited results |

### 7.2 get_alert

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| ALR-005 | Valid alert ID | `{alert_id: <VALID_ID>, use_case: 'test'}` | Alert details |
| ALR-006 | Invalid alert ID | `{alert_id: 999999999, use_case: 'test'}` | Not found error |

---

## Category 8: Monitors (Webhooks)

### 8.1 list_monitors

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| MON-001 | No filter | `{use_case: 'test'}` | All monitors |
| MON-002 | Filter active | `{query: "status='active'", use_case: 'test'}` | Active monitors |
| MON-003 | Filter by type | `{query: "type='http'", use_case: 'test'}` | HTTP monitors |

### 8.2 get_monitor

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| MON-004 | Valid monitor ID | `{monitor_id: <VALID_ID>, use_case: 'test'}` | Monitor config |
| MON-005 | Invalid ID | `{monitor_id: 999999999, use_case: 'test'}` | Not found error |

### 8.3 get_monitor_history

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| MON-006 | Basic history | `{monitor_id: <VALID_ID>, use_case: 'test'}` | Execution history |
| MON-007 | With time range | `{monitor_id: <VALID_ID>, start_time: '-7d', use_case: 'test'}` | Filtered history |

---

## Category 9: Automations

### 9.1 list_automations

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| AUT-001 | No filter | `{use_case: 'test'}` | All automations |
| AUT-002 | Filter enabled | `{query: "status='enabled'", use_case: 'test'}` | Active automations |
| AUT-003 | Filter by name | `{query: "name contains 'test'", use_case: 'test'}` | Matching automations |

### 9.2 get_automation

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| AUT-004 | Valid ID | `{automation_id: <VALID_ID>, use_case: 'test'}` | Automation details |
| AUT-005 | Invalid ID | `{automation_id: 999999999, use_case: 'test'}` | Not found error |

### 9.3 list_automation_runs

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| AUT-006 | No filter | `{use_case: 'test'}` | All runs |
| AUT-007 | Filter failed | `{query: "status='failed'", use_case: 'test'}` | Failed runs |
| AUT-008 | With time range | `{query: "start_time>-7d", use_case: 'test'}` | Recent runs |

### 9.4 get_automation_run

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| AUT-009 | Valid run ID | `{run_id: <VALID_ID>, use_case: 'test'}` | Run details |
| AUT-010 | Invalid ID | `{run_id: 999999999, use_case: 'test'}` | Not found error |

### 9.5 list_automation_schedules

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| AUT-011 | No filter | `{use_case: 'test'}` | All schedules |

### 9.6 get_automation_schedule

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| AUT-012 | Valid ID | `{schedule_id: <VALID_ID>, use_case: 'test'}` | Schedule details |
| AUT-013 | Invalid ID | `{schedule_id: 999999999, use_case: 'test'}` | Not found error |

---

## Category 10: Jobs & Firmware

### 10.1 list_jobs

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| JOB-001 | No filter | `{use_case: 'test'}` | All jobs |
| JOB-002 | Filter in progress | `{query: "job_status='in_progress'", use_case: 'test'}` | Active jobs |
| JOB-003 | Filter by type | `{query: "job_type='firmware_update'", use_case: 'test'}` | Firmware jobs |
| JOB-004 | Recent jobs | `{query: "job_submit_time>-1d", use_case: 'test'}` | Today's jobs |

### 10.2 list_jobs_bulk

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| JOB-005 | Basic CSV | `{use_case: 'test'}` | CSV export |

### 10.3 get_job

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| JOB-006 | Valid job ID | `{job_id: <VALID_ID>, use_case: 'test'}` | Job details |
| JOB-007 | Invalid ID | `{job_id: 999999999, use_case: 'test'}` | Not found error |

### 10.4 list_firmware

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| FW-001 | No filter | `{use_case: 'test'}` | All firmware |
| FW-002 | Filter by type | `{query: "type contains 'EX50'", use_case: 'test'}` | Device-specific |
| FW-003 | Production only | `{query: "production=true", use_case: 'test'}` | Production firmware |

### 10.5 get_firmware

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| FW-004 | Valid firmware ID | `{firmware_id: <VALID_ID>, use_case: 'test'}` | Firmware details |
| FW-005 | Invalid ID | `{firmware_id: 999999999, use_case: 'test'}` | Not found error |

### 10.6 list_firmware_updates

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| FW-006 | No filter | `{use_case: 'test'}` | All updates |
| FW-007 | Filter active | `{query: "status='active'", use_case: 'test'}` | Active updates |

### 10.7 get_firmware_update

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| FW-008 | Valid update ID | `{update_id: <VALID_ID>, use_case: 'test'}` | Update details |
| FW-009 | Invalid ID | `{update_id: 999999999, use_case: 'test'}` | Not found error |

---

## Category 11: Configuration & Health

### 11.1 list_templates

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| CFG-001 | No filter | `{use_case: 'test'}` | All templates |
| CFG-002 | Filter by name | `{query: "name contains 'test'", use_case: 'test'}` | Matching templates |

### 11.2 get_template

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| CFG-003 | Valid config ID | `{config_id: <VALID_ID>, use_case: 'test'}` | Template details |
| CFG-004 | Invalid ID | `{config_id: 999999999, use_case: 'test'}` | Not found error |

### 11.3 list_health_configs

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| HLT-001 | No filter | `{use_case: 'test'}` | All health configs |

### 11.4 get_health_config

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| HLT-002 | Valid ID | `{health_config_id: '<VALID_ID>', use_case: 'test'}` | Config details |
| HLT-003 | Invalid ID | `{health_config_id: 'invalid', use_case: 'test'}` | Not found error |

---

## Category 12: Account & Admin

### 12.1 current_login

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| ACC-001 | Basic call | `{use_case: 'test'}` | Current user info |
| ACC-002 | Response fields | `{use_case: 'test'}` | Has customer_id, username, api_key_id |

### 12.2 current_account

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| ACC-003 | Basic call | `{use_case: 'test'}` | Account info |
| ACC-004 | Response fields | `{use_case: 'test'}` | Has customer_id, account_name |

### 12.3 get_account_security

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| ACC-005 | Account settings | `{use_case: 'test'}` | Security settings |
| ACC-006 | System defaults | `{system_defaults: 'true', use_case: 'test'}` | Default settings |

### 12.4 list_users

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| USR-001 | No filter | `{use_case: 'test'}` | All users |
| USR-002 | Filter active | `{query: "status='active'", use_case: 'test'}` | Active users |
| USR-003 | Filter by role | `{query: "role='admin'", use_case: 'test'}` | Admin users |

### 12.5 get_user

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| USR-004 | Valid user ID | `{user_id: '<VALID_ID>', use_case: 'test'}` | User details |
| USR-005 | Invalid ID | `{user_id: 'invalid', use_case: 'test'}` | Not found error |

### 12.6 list_events

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| EVT-001 | Recent events | `{start_time: '-1h', use_case: 'test'}` | Last hour events |
| EVT-002 | Filter by facility | `{query: "facility='AUTHENTICATION'", use_case: 'test'}` | Auth events |
| EVT-003 | With size limit | `{size: 50, use_case: 'test'}` | Max 50 events |

### 12.7 list_events_bulk

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| EVT-004 | Basic CSV | `{start_time: '-1h', use_case: 'test'}` | CSV export |

### 12.8 list_file_sets

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| FS-001 | No filter | `{use_case: 'test'}` | All file sets |

### 12.9 list_files_in_a_set

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| FS-002 | Valid set | `{fileset_name: '<VALID_SET>', use_case: 'test'}` | Files in set |
| FS-003 | Invalid set | `{fileset_name: 'nonexistent', use_case: 'test'}` | Error or empty |

### 12.10 get_file

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| FS-004 | Valid file | `{file_name: '<SET>/<FILE>', use_case: 'test'}` | File details |
| FS-005 | Invalid file | `{file_name: 'invalid/path', use_case: 'test'}` | Not found error |

### 12.11 get_api_info

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| API-001 | Top level | `{use_case: 'test'}` | API catalog |
| API-002 | Devices endpoint | `{endpoint: 'devices', use_case: 'test'}` | Devices API info |
| API-003 | Streams endpoint | `{endpoint: 'streams', use_case: 'test'}` | Streams API info |

---

## Category 13: Location Services

### 13.1 get_location_cellular_stats

| Test ID | Test Name | Input | Expected Outcome |
|---------|-----------|-------|------------------|
| LOC-001 | Default time range | `{device_id: '<LOCATION_ENABLED_ID>', use_case: 'test'}` | Location stats |
| LOC-002 | Custom time range | `{device_id: '<LOCATION_ENABLED_ID>', start_time: '-24h', end_time: '-1h', use_case: 'test'}` | Filtered stats |
| LOC-003 | Device without capability | `{device_id: '<NO_LOCATION_ID>', use_case: 'test'}` | Appropriate error/empty |

---

## Test Automation Framework

### Recommended Structure

```
tests/
├── setup/
│   ├── test-fixtures.ts       # Test data and config
│   └── mcp-client.ts          # MCP client wrapper
├── categories/
│   ├── query-syntax.test.ts   # QS-* tests
│   ├── devices.test.ts        # DEV-* tests
│   ├── streams.test.ts        # STR-* tests
│   ├── diagnostics.test.ts    # DIAG-* tests
│   ├── sci-rci.test.ts        # SCI-* tests
│   ├── groups.test.ts         # GRP-* tests
│   ├── alerts.test.ts         # ALR-* tests
│   ├── monitors.test.ts       # MON-* tests
│   ├── automations.test.ts    # AUT-* tests
│   ├── jobs-firmware.test.ts  # JOB-*, FW-* tests
│   ├── config-health.test.ts  # CFG-*, HLT-* tests
│   ├── account-admin.test.ts  # ACC-*, USR-*, EVT-*, FS-*, API-* tests
│   └── location.test.ts       # LOC-* tests
├── integration/
│   └── end-to-end.test.ts     # Cross-category workflows
└── reports/
    └── coverage.json          # Tool coverage tracking
```

### Sample Test Implementation

```typescript
// tests/categories/devices.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { mcpClient } from '../setup/mcp-client';
import { TEST_CONFIG } from '../setup/test-fixtures';

describe('Device Listing & Search', () => {
  describe('list_devices', () => {
    it('DEV-001: returns all devices with count', async () => {
      const result = await mcpClient.callTool('list_devices', {
        use_case: 'test'
      });
      
      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('list');
      expect(result.count).toBeGreaterThan(0);
      expect(Array.isArray(result.list)).toBe(true);
    });

    it('DEV-002: filters connected devices', async () => {
      const result = await mcpClient.callTool('list_devices', {
        query: "connection_status='connected'",
        use_case: 'test'
      });
      
      expect(result.list.every(d => d.connection_status === 'connected')).toBe(true);
    });

    it('DEV-013: handles invalid query syntax', async () => {
      const result = await mcpClient.callTool('list_devices', {
        query: 'bad query syntax',
        use_case: 'test'
      });
      
      // Should return error, not crash
      expect(result).toHaveProperty('error');
    });
  });

  describe('get_device', () => {
    it('DEV-023: returns full device details for valid ID', async () => {
      const result = await mcpClient.callTool('get_device', {
        device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
        use_case: 'test'
      });
      
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('mac');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('connection_status');
    });

    it('DEV-025: returns not found for non-existent ID', async () => {
      const result = await mcpClient.callTool('get_device', {
        device_id: '00000000-00000000-00000000-00000000',
        use_case: 'test'
      });
      
      expect(result).toHaveProperty('error');
    });
  });
});
```

### Coverage Tracking

```typescript
// tests/reports/generate-coverage.ts
const TOTAL_TOOLS = 50;
const TOTAL_TEST_CASES = 150;

interface CoverageReport {
  toolsCovered: number;
  testsPassing: number;
  testsFailing: number;
  coverage: number;
  byCategory: CategoryCoverage[];
}

// Generate after test run
```

---

## Execution Recommendations

### Phase 1: Smoke Tests
Run one test per tool to verify basic connectivity:
- QS-001, DEV-001, STR-001, DIAG-001, SCI-001, GRP-001, ALR-001, MON-001, AUT-001, JOB-001, FW-001, CFG-001, HLT-001, ACC-001, LOC-001

### Phase 2: Happy Path
Run all tests with valid inputs (skip error cases)

### Phase 3: Error Handling
Run all error/edge case tests

### Phase 4: Performance
Add timing assertions for response times:
- List operations: < 5 seconds
- Single item operations: < 2 seconds
- Bulk exports: < 30 seconds

### Phase 5: Integration
Test workflows that span multiple tools:
1. Find device by name → Get device details → Query state
2. List devices with issues → Get event logs → Get file logs
3. List alerts → Get alert → Check automation runs

---

## Maintenance Notes

- Update `TEST_CONFIG` when test devices change
- Review query syntax tests when DRM API updates
- Add new test cases when tools are added
- Track which tests require connected devices
