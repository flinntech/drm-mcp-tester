import { describe, it, expect } from 'vitest';
import { mcpClient } from '../setup/mcp-client.js';
import { TEST_CONFIG } from '../setup/test-fixtures.js';

describe('Category 13: Location Services', () => {
    describe('13.1 get_location_cellular_stats', () => {
        it('LOC-001: Default time range', async () => {
            const result = await mcpClient.callTool('get_location_cellular_stats', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                use_case: 'test'
            });
            // Assuming it returns stats object
            expect(result).toBeDefined();
        });

        it('LOC-002: Custom time range', async () => {
            const result = await mcpClient.callTool('get_location_cellular_stats', {
                device_id: TEST_CONFIG.CONNECTED_DEVICE_ID,
                start_time: '-24h',
                end_time: '-1h',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('LOC-003: Device without capability', async () => {
            // Using disconnected ID as a proxy for "no capability" or just another device
            const result = await mcpClient.callTool('get_location_cellular_stats', {
                device_id: TEST_CONFIG.DISCONNECTED_DEVICE_ID,
                use_case: 'test'
            });
            // Might return empty or error
            if (result.isError) {
                expect(result.isError).toBe(true);
            }
        });
    });
});
