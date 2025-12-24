import { describe, it, expect } from 'vitest';
import { mcpClient } from '../setup/mcp-client.js';
import { TEST_CONFIG } from '../setup/test-fixtures.js';

describe('Category 8: Monitors (Webhooks)', () => {
    let validMonitorId = TEST_CONFIG.VALID_MONITOR_ID;

    describe('8.1 list_monitors', () => {
        it('MON-001: No filter', async () => {
            const result = await mcpClient.callTool('list_monitors', { use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(Array.isArray(data.list)).toBe(true);

            if (data.list.length > 0) {
                validMonitorId = data.list[0].id;
            }
        });

        it('MON-002: Filter active', async () => {
            const result = await mcpClient.callTool('list_monitors', {
                query: "status='active'",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('MON-003: Filter by type', async () => {
            const result = await mcpClient.callTool('list_monitors', {
                query: "type='http'",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });
    });

    describe('8.2 get_monitor', () => {
        it('MON-004: Valid monitor ID', async () => {
            const result = await mcpClient.callTool('get_monitor', {
                monitor_id: validMonitorId,
                use_case: 'test'
            });
            if (!result.isError) {
                expect(result).toBeDefined();
            }
        });

        it('MON-005: Invalid ID', async () => {
            const result = await mcpClient.callTool('get_monitor', {
                monitor_id: 999999999,
                use_case: 'test'
            });
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                expect(result.content[0].text).toMatch(/error|not found/i);
            }
        });
    });

    describe('8.3 get_monitor_history', () => {
        it('MON-006: Basic history', async () => {
            const result = await mcpClient.callTool('get_monitor_history', {
                monitor_id: validMonitorId,
                use_case: 'test'
            });
            if (!result.isError) {
                // expect history list
            }
        });

        it('MON-007: With time range', async () => {
            const result = await mcpClient.callTool('get_monitor_history', {
                monitor_id: validMonitorId,
                start_time: TEST_CONFIG.HISTORICAL_TIMEFRAME,
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });
    });
});
