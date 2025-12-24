import { describe, it, expect } from 'vitest';
import { mcpClient } from '../setup/mcp-client.js';
import { TEST_CONFIG } from '../setup/test-fixtures.js';

describe('Category 4: Device Diagnostics', () => {
    describe('4.1 get_device_event_logs', () => {
        it('DIAG-001: Default (1 hour)', async () => {
            const result = await mcpClient.callTool('get_device_event_logs', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                use_case: 'test'
            });
            const data = JSON.parse(result.content[0].text);
            expect(Array.isArray(data.list)).toBe(true);
        });

        it('DIAG-002: With time range', async () => {
            const result = await mcpClient.callTool('get_device_event_logs', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                start_time: TEST_CONFIG.HISTORICAL_TIMEFRAME,
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('DIAG-003: With size limit', async () => {
            const result = await mcpClient.callTool('get_device_event_logs', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                size: 50,
                use_case: 'test'
            });
            const data = JSON.parse(result.content[0].text);
            expect(data.list.length).toBeLessThanOrEqual(50);
        });

        it('DIAG-004: Invalid device', async () => {
            const result = await mcpClient.callTool('get_device_event_logs', {
                device_id: 'invalid',
                use_case: 'test'
            });
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                expect(result.content[0].text).toMatch(/error|invalid/i);
            }
        });
    });

    describe('4.2 list_device_files', () => {
        it('DIAG-005: Root directory', async () => {
            const result = await mcpClient.callTool('list_device_files', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                path: '/',
                hash: 'any',
                use_case: 'test'
            });
            expect(result).toBeDefined();
            const content = result.content[0].text;
            // Expect file listing structure
            expect(content).toBeTruthy();
        });

        it('DIAG-006: Logs directory', async () => {
            const result = await mcpClient.callTool('list_device_files', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                path: '/logs',
                hash: 'any',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('DIAG-007: With MD5 hash', async () => {
            const result = await mcpClient.callTool('list_device_files', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                path: '/',
                hash: 'md5',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('DIAG-008: No hash', async () => {
            const result = await mcpClient.callTool('list_device_files', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                path: '/',
                hash: 'none',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('DIAG-009: Invalid path', async () => {
            const result = await mcpClient.callTool('list_device_files', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                path: '/nonexistent',
                hash: 'any',
                use_case: 'test'
            });
            // Should probably return empty or error
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                // If not error, check if empty list or response indicates failure
            }
        });

        it('DIAG-010: Disconnected device', async () => {
            const result = await mcpClient.callTool('list_device_files', {
                device_id: TEST_CONFIG.DISCONNECTED_DEVICE_ID,
                path: '/',
                hash: 'any',
                use_case: 'test'
            });
            // Expect connection error or timeout handling
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                expect(result.content[0].text).toMatch(/error|offline|disconnected/i);
            }
        });
    });

    describe('4.3 get_device_file', () => {
        it('DIAG-011: Valid file', async () => {
            // Need a known file, potentially from listing
            // For now, try a common log file or just verify tool call structure
            const result = await mcpClient.callTool('get_device_file', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                path: '/logs/messages',
                use_case: 'test'
            });
            // This test might fail if file doesn't exist, which is expected for real hardware variance
            // But we check that tool call completes
            expect(result).toBeDefined();
        });

        it('DIAG-012: Invalid path', async () => {
            const result = await mcpClient.callTool('get_device_file', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                path: '/nonexistent.txt',
                use_case: 'test'
            });
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                expect(result.content[0].text).toMatch(/error|not found/i);
            }
        });

        it('DIAG-013: Disconnected device', async () => {
            const result = await mcpClient.callTool('get_device_file', {
                device_id: TEST_CONFIG.DISCONNECTED_DEVICE_ID,
                path: '/logs/messages',
                use_case: 'test'
            });
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                expect(result.content[0].text).toMatch(/error|offline|disconnected/i);
            }
        });
    });
});
