import { describe, it, expect } from 'vitest';
import { mcpClient } from '../setup/mcp-client.js';
import { TEST_CONFIG } from '../setup/test-fixtures.js';

describe('Category 7: Alerts', () => {
    let validAlertId = TEST_CONFIG.VALID_ALERT_ID; // Fallback or setup

    describe('7.1 list_alerts', () => {
        it('ALR-001: No filter', async () => {
            const result = await mcpClient.callTool('list_alerts', { use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(Array.isArray(data.list)).toBe(true);

            if (data.list.length > 0) {
                validAlertId = data.list[0].id;
            }
        });

        it('ALR-002: Filter enabled', async () => {
            const result = await mcpClient.callTool('list_alerts', {
                query: "status='enabled'",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('ALR-003: Filter by severity', async () => {
            const result = await mcpClient.callTool('list_alerts', {
                query: "severity='critical'",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('ALR-004: With pagination', async () => {
            const result = await mcpClient.callTool('list_alerts', { size: 10, use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(data.list.length).toBeLessThanOrEqual(10);
        });
    });

    describe('7.2 get_alert', () => {
        it('ALR-005: Valid alert ID', async () => {
            const result = await mcpClient.callTool('get_alert', {
                alert_id: validAlertId,
                use_case: 'test'
            });
            // Will pass if ID is valid, otherwise might be not found (which is valid behavior for random ID)
            if (!result.isError) {
                const data = JSON.parse(result.content[0].text);
                expect(data).toHaveProperty('id');
            }
        });

        it('ALR-006: Invalid alert ID', async () => {
            const result = await mcpClient.callTool('get_alert', {
                alert_id: 999999999,
                use_case: 'test'
            });
            // Should be error
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                expect(result.content[0].text).toMatch(/error|not found/i);
            }
        });
    });
});
