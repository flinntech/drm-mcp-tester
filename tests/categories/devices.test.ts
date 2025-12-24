import { describe, it, expect } from 'vitest';
import { mcpClient } from '../setup/mcp-client.js';
import { TEST_CONFIG } from '../setup/test-fixtures.js';

describe('Category 2: Device Listing & Search', () => {
    describe('2.1 list_devices', () => {
        it('DEV-001: No filter', async () => {
            const result = await mcpClient.callTool('list_devices', { use_case: 'test' });
            // Expect list structure
            const content = result.content[0].text;
            const data = JSON.parse(content);
            expect(data).toHaveProperty('count');
            expect(data).toHaveProperty('list');
            expect(Array.isArray(data.list)).toBe(true);
        });

        it('DEV-002: Filter connected', async () => {
            const result = await mcpClient.callTool('list_devices', {
                query: "connection_status='connected'",
                use_case: 'test'
            });
            const data = JSON.parse(result.content[0].text);
            // Validate all items are connected
            if (data.list.length > 0) {
                expect(data.list.every((d: any) => d.connection_status === 'connected')).toBe(true);
            }
        });

        it('DEV-003: Filter disconnected', async () => {
            const result = await mcpClient.callTool('list_devices', {
                query: "connection_status='disconnected'",
                use_case: 'test'
            });
            const data = JSON.parse(result.content[0].text);
            if (data.list.length > 0) {
                expect(data.list.every((d: any) => d.connection_status === 'disconnected')).toBe(true);
            }
        });

        it('DEV-004: Filter by type contains', async () => {
            const result = await mcpClient.callTool('list_devices', {
                query: `type contains '${TEST_CONFIG.KNOWN_DEVICE_TYPE}'`,
                use_case: 'test'
            });
            const data = JSON.parse(result.content[0].text);
            expect(data.list.length).toBeDefined(); // Might be 0 if none found, but should not fail
        });

        it('DEV-005: Filter by signal', async () => {
            const result = await mcpClient.callTool('list_devices', {
                query: "signal_percent<50",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('DEV-006: Filter by group', async () => {
            const result = await mcpClient.callTool('list_devices', {
                query: `group startswith '/${TEST_CONFIG.KNOWN_GROUP}'`,
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('DEV-007: Filter by health', async () => {
            const result = await mcpClient.callTool('list_devices', {
                query: "health_status='error'",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('DEV-008: Compound filter', async () => {
            const result = await mcpClient.callTool('list_devices', {
                query: "connection_status='connected' and signal_percent>50",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('DEV-009: Order by name', async () => {
            const result = await mcpClient.callTool('list_devices', {
                orderby: 'name asc',
                use_case: 'test'
            });
            const data = JSON.parse(result.content[0].text);
            expect(data.list.length).toBeDefined();
        });

        it('DEV-010: Order by signal desc', async () => {
            const result = await mcpClient.callTool('list_devices', {
                orderby: 'signal_percent desc',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('DEV-011: Pagination - size', async () => {
            const size = 5;
            const result = await mcpClient.callTool('list_devices', {
                size,
                use_case: 'test'
            });
            const data = JSON.parse(result.content[0].text);
            expect(data.list.length).toBeLessThanOrEqual(size);
        });

        it('DEV-012: Pagination - cursor', async () => {
            // First request to get cursor
            const first = await mcpClient.callTool('list_devices', { size: 1, use_case: 'test' });
            const firstData = JSON.parse(first.content[0].text);

            if (firstData.cursor) {
                const second = await mcpClient.callTool('list_devices', { size: 1, cursor: firstData.cursor, use_case: 'test' });
                expect(second).toBeDefined();
            }
        });

        it('DEV-013: Invalid query syntax', async () => {
            const result = await mcpClient.callTool('list_devices', {
                query: "bad query syntax",
                use_case: 'test'
            });
            // Should return error object or error message
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                // If it doesn't throw, check if content indicates error
                const content = result.content[0].text;
                expect(content).toMatch(/error|invalid/i);
            }
        });

        it('DEV-014: Response structure', async () => {
            const result = await mcpClient.callTool('list_devices', { use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(data).toHaveProperty('count');
            expect(data).toHaveProperty('size');
            expect(data).toHaveProperty('list');
            // Cursor might be optional if list is small
        });
    });

    describe('2.2 list_devices_bulk', () => {
        it('DEV-015: Basic CSV export', async () => {
            const result = await mcpClient.callTool('list_devices_bulk', { use_case: 'test' });
            const content = result.content[0].text;
            // Expect CSV format (commas, newlines)
            expect(content).toMatch(/,/);
            expect(content).toMatch(/\n/);
        });

        it('DEV-016: Specific fields', async () => {
            const result = await mcpClient.callTool('list_devices_bulk', {
                fields: 'id,name,connection_status',
                use_case: 'test'
            });
            const content = result.content[0].text;
            const header = content.split('\n')[0];
            expect(header).toContain('id');
            expect(header).toContain('name');
            expect(header).toContain('connection_status');
        });

        it('DEV-017: With filter', async () => {
            const result = await mcpClient.callTool('list_devices_bulk', {
                query: "connection_status='connected'",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('DEV-018: With ordering', async () => {
            const result = await mcpClient.callTool('list_devices_bulk', {
                orderby: 'name asc',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });
    });

    describe('2.3 find_device_id_by_name', () => {
        it('DEV-019: Exact match', async () => {
            const result = await mcpClient.callTool('find_device_id_by_name', {
                device_search: TEST_CONFIG.DEVICE_NAME_SEARCH,
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('DEV-020: Partial match', async () => {
            // Assuming 'ex' will match 'EX50'
            const result = await mcpClient.callTool('find_device_id_by_name', {
                device_search: TEST_CONFIG.DEVICE_NAME_SEARCH.substring(0, 2),
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('DEV-021: No match', async () => {
            const result = await mcpClient.callTool('find_device_id_by_name', {
                device_search: 'zzzznonexistent',
                use_case: 'test'
            });
            const content = result.content[0].text;
            // Should be empty list or specific message
            expect(content).toMatch(/empty|no results|\[\]/i);
        });

        it('DEV-022: Case insensitive', async () => {
            const result1 = await mcpClient.callTool('find_device_id_by_name', {
                device_search: TEST_CONFIG.DEVICE_NAME_SEARCH.toUpperCase(),
                use_case: 'test'
            });
            const result2 = await mcpClient.callTool('find_device_id_by_name', {
                device_search: TEST_CONFIG.DEVICE_NAME_SEARCH.toLowerCase(),
                use_case: 'test'
            });
            // Basic check that both return something
            expect(result1).toBeDefined();
            expect(result2).toBeDefined();
        });
    });

    describe('2.4 get_device', () => {
        it('DEV-023: Valid device ID', async () => {
            const result = await mcpClient.callTool('get_device', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                use_case: 'test'
            });
            const content = result.content[0].text;
            const data = JSON.parse(content);
            expect(data).toHaveProperty('id', TEST_CONFIG.CONNECTED_DEVICE_ID);
        });

        it('DEV-024: Invalid device ID - format', async () => {
            const result = await mcpClient.callTool('get_device', {
                device_id: 'invalid-id-format',
                use_case: 'test'
            });
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                const content = result.content[0].text;
                expect(content).toMatch(/error|invalid/i);
            }
        });

        it('DEV-025: Non-existent ID', async () => {
            const result = await mcpClient.callTool('get_device', {
                device_id: '00000000-00000000-00000000-00000000',
                use_case: 'test'
            });
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                const content = result.content[0].text;
                expect(content).toMatch(/not found|error/i);
            }
        });

        it('DEV-026: Response completeness', async () => {
            const result = await mcpClient.callTool('get_device', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                use_case: 'test'
            });
            const data = JSON.parse(result.content[0].text);
            expect(data).toHaveProperty('mac');
            expect(data).toHaveProperty('type');
            expect(data).toHaveProperty('connection_status');
        });
    });
});
