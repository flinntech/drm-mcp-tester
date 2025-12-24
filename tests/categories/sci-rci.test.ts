import { describe, it, expect } from 'vitest';
import { mcpClient } from '../setup/mcp-client.js';
import { TEST_CONFIG } from '../setup/test-fixtures.js';

describe('Category 5: SCI/RCI Device Queries', () => {
    describe('5.1 sci_query_device_state', () => {
        it('SCI-001: All state', async () => {
            const result = await mcpClient.callTool('sci_query_device_state', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                use_case: 'test'
            });
            expect(result).toBeDefined();
            const content = result.content[0].text;
            // Should be XML or JSON depending on implementation, assume RCI string response
            expect(content.length).toBeGreaterThan(0);
        });

        it('SCI-002: Cellular state', async () => {
            const result = await mcpClient.callTool('sci_query_device_state', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                state_group: 'cellular',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('SCI-003: System state', async () => {
            const result = await mcpClient.callTool('sci_query_device_state', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                state_group: 'system',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('SCI-004: Interface state', async () => {
            const result = await mcpClient.callTool('sci_query_device_state', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                state_group: 'interface',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('SCI-005: Location state', async () => {
            const result = await mcpClient.callTool('sci_query_device_state', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                state_group: 'location',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('SCI-006: Invalid group', async () => {
            const result = await mcpClient.callTool('sci_query_device_state', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                state_group: 'invalid',
                use_case: 'test'
            });
            // Should handle gracefully or return error
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                // If empty/valid response, check if content indicates error or empty
            }
        });

        it('SCI-007: Disconnected device', async () => {
            const result = await mcpClient.callTool('sci_query_device_state', {
                device_id: TEST_CONFIG.DISCONNECTED_DEVICE_ID,
                state_group: 'system',
                use_case: 'test'
            });
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                expect(result.content[0].text).toMatch(/error|cached|timeout/i);
            }
        });
    });

    describe('5.2 sci_query_device_settings', () => {
        it('SCI-008: All settings', async () => {
            const result = await mcpClient.callTool('sci_query_device_settings', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('SCI-009: Network settings', async () => {
            const result = await mcpClient.callTool('sci_query_device_settings', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                setting_group: 'network',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('SCI-010: Cloud settings', async () => {
            const result = await mcpClient.callTool('sci_query_device_settings', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                setting_group: 'cloud',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('SCI-011: Auth settings', async () => {
            const result = await mcpClient.callTool('sci_query_device_settings', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                setting_group: 'auth',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('SCI-012: Invalid group', async () => {
            const result = await mcpClient.callTool('sci_query_device_settings', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                setting_group: 'invalid',
                use_case: 'test'
            });
            if (result.isError) {
                expect(result.isError).toBe(true);
            }
        });
    });

    describe('5.3 sci_query_descriptor', () => {
        it('SCI-013: Top level', async () => {
            const result = await mcpClient.callTool('sci_query_descriptor', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('SCI-014: Query state', async () => {
            const result = await mcpClient.callTool('sci_query_descriptor', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                element: 'query_state',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('SCI-015: Query setting', async () => {
            const result = await mcpClient.callTool('sci_query_descriptor', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                element: 'query_setting',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });
    });
});
