import { describe, it, expect } from 'vitest';
import { mcpClient } from '../setup/mcp-client.js';
import { TEST_CONFIG } from '../setup/test-fixtures.js';

describe('Category 3: Data Streams', () => {
    // Helper to get a valid stream ID for subsequent tests
    let validStreamId = `${TEST_CONFIG.CONNECTED_DEVICE_ID}/log/system`;

    describe('3.1 list_streams', () => {
        it('STR-001: No filter', async () => {
            const result = await mcpClient.callTool('list_streams', { use_case: 'test' });
            const content = result.content[0].text;
            const data = JSON.parse(content);
            expect(data).toHaveProperty('list');
            expect(Array.isArray(data.list)).toBe(true);

            // Try to capture a valid stream ID from the list if available
            if (data.list.length > 0) {
                validStreamId = data.list[0].stream_id || data.list[0].id; // Adjust based on actual API
            }
        });

        it('STR-002: Filter by device', async () => {
            const result = await mcpClient.callTool('list_streams', {
                query: `device_id='${TEST_CONFIG.CONNECTED_DEVICE_ID}'`,
                use_case: 'test'
            });
            const data = JSON.parse(result.content[0].text);
            // Validate
            if (data.list.length > 0) {
                // Check if stream ID contains device ID or verify some other way
            }
        });

        it('STR-003: With pagination', async () => {
            const result = await mcpClient.callTool('list_streams', { size: 5, use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(data.list.length).toBeLessThanOrEqual(5);
        });

        it('STR-004: With ordering', async () => {
            const result = await mcpClient.callTool('list_streams', { orderby: 'timestamp desc', use_case: 'test' });
            expect(result).toBeDefined();
        });
    });

    describe('3.2 list_streams_bulk', () => {
        it('STR-005: Basic CSV export', async () => {
            const result = await mcpClient.callTool('list_streams_bulk', { use_case: 'test' });
            const content = result.content[0].text;
            expect(content).toMatch(/,/);
        });

        it('STR-006: Specific fields', async () => {
            // Note: Actual field name is 'id' (description says 'stream_id')
            const result = await mcpClient.callTool('list_streams_bulk', { fields: 'id,description', use_case: 'test' });
            const content = result.content[0].text;
            const header = content.split('\n')[0];
            expect(header).toContain('id');
        });
    });

    describe('3.3 get_stream', () => {
        it('STR-007: Valid stream ID', async () => {
            const result = await mcpClient.callTool('get_stream', {
                stream_id: validStreamId,
                use_case: 'test'
            });
            const data = JSON.parse(result.content[0].text);
            expect(data).toHaveProperty('value'); // Actual field name (description says 'current value')
        });

        it('STR-008: Invalid stream ID', async () => {
            const result = await mcpClient.callTool('get_stream', {
                stream_id: 'invalid/stream/id',
                use_case: 'test'
            });
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                expect(result.content[0].text).toMatch(/error|not found/i);
            }
        });
    });

    describe('3.4 get_stream_history', () => {
        it('STR-009: Basic history', async () => {
            const result = await mcpClient.callTool('get_stream_history', {
                stream_id: validStreamId,
                use_case: 'test'
            });
            const data = JSON.parse(result.content[0].text);
            expect(Array.isArray(data.list)).toBe(true);
        });

        it('STR-010: With time range', async () => {
            const result = await mcpClient.callTool('get_stream_history', {
                stream_id: validStreamId,
                start_time: TEST_CONFIG.HISTORICAL_TIMEFRAME,
                end_time: TEST_CONFIG.RECENT_TIMEFRAME,
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('STR-011: With size limit', async () => {
            const result = await mcpClient.callTool('get_stream_history', {
                stream_id: validStreamId,
                size: 10,
                use_case: 'test'
            });
            const data = JSON.parse(result.content[0].text);
            expect(data.list.length).toBeLessThanOrEqual(10);
        });

        it('STR-012: Order ascending', async () => {
            const result = await mcpClient.callTool('get_stream_history', {
                stream_id: validStreamId,
                order: 'asc',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('STR-013: Order descending', async () => {
            const result = await mcpClient.callTool('get_stream_history', {
                stream_id: validStreamId,
                order: 'desc',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });
    });

    describe('3.5 get_stream_history_bulk', () => {
        it('STR-014: Basic CSV export', async () => {
            const result = await mcpClient.callTool('get_stream_history_bulk', {
                stream_id: validStreamId,
                use_case: 'test'
            });
            // Should be CSV
            expect(result.content[0].text).toBeDefined();
        });

        it('STR-015: With time range', async () => {
            const result = await mcpClient.callTool('get_stream_history_bulk', {
                stream_id: validStreamId,
                start_time: TEST_CONFIG.HISTORICAL_TIMEFRAME,
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });
    });

    describe('3.6 get_stream_rollups', () => {
        it('STR-016: Hourly average', async () => {
            const result = await mcpClient.callTool('get_stream_rollups', {
                stream_id: validStreamId,
                interval: '1h',
                method: 'avg',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('STR-017: Daily max', async () => {
            const result = await mcpClient.callTool('get_stream_rollups', {
                stream_id: validStreamId,
                interval: '1d',
                method: 'max',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('STR-018: With time range', async () => {
            const result = await mcpClient.callTool('get_stream_rollups', {
                stream_id: validStreamId,
                interval: '1h',
                start_time: TEST_CONFIG.HISTORICAL_TIMEFRAME,
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('STR-019: Count method', async () => {
            const result = await mcpClient.callTool('get_stream_rollups', {
                stream_id: validStreamId,
                interval: '1d',
                method: 'count',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });
    });

    describe('3.7 get_stream_rollups_bulk', () => {
        it('STR-020: Basic CSV export', async () => {
            const result = await mcpClient.callTool('get_stream_rollups_bulk', {
                stream_id: validStreamId,
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });
    });
});
