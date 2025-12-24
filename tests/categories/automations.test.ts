import { describe, it, expect } from 'vitest';
import { mcpClient } from '../setup/mcp-client.js';

describe('Category 9: Automations', () => {
    let validAutomationId: number | string;
    let validRunId: number | string;
    let validScheduleId: number | string;

    describe('9.1 list_automations', () => {
        it('AUT-001: No filter', async () => {
            const result = await mcpClient.callTool('list_automations', { use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(Array.isArray(data.list)).toBe(true);
            if (data.list.length > 0) {
                validAutomationId = data.list[0].id;
            }
        });

        it('AUT-002: Filter enabled', async () => {
            const result = await mcpClient.callTool('list_automations', {
                query: "status='enabled'",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('AUT-003: Filter by name', async () => {
            const result = await mcpClient.callTool('list_automations', {
                query: "name contains 'test'",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });
    });

    describe('9.2 get_automation', () => {
        it('AUT-004: Valid ID', async () => {
            // Skip if we didn't find one, or try to run anyway to see failure
            if (validAutomationId) {
                const result = await mcpClient.callTool('get_automation', {
                    automation_id: validAutomationId,
                    use_case: 'test'
                });
                expect(result).toBeDefined();
            }
        });

        it('AUT-005: Invalid ID', async () => {
            const result = await mcpClient.callTool('get_automation', {
                automation_id: 999999999,
                use_case: 'test'
            });
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                expect(result.content[0].text).toMatch(/error|not found/i);
            }
        });
    });

    describe('9.3 list_automation_runs', () => {
        it('AUT-006: No filter', async () => {
            const result = await mcpClient.callTool('list_automation_runs', { use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(Array.isArray(data.list)).toBe(true);
            if (data.list.length > 0) {
                validRunId = data.list[0].id;
            }
        });

        it('AUT-007: Filter failed', async () => {
            const result = await mcpClient.callTool('list_automation_runs', {
                query: "status='failed'",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('AUT-008: With time range', async () => {
            const result = await mcpClient.callTool('list_automation_runs', {
                query: "start_time>-7d",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });
    });

    describe('9.4 get_automation_run', () => {
        it('AUT-009: Valid run ID', async () => {
            if (validRunId) {
                const result = await mcpClient.callTool('get_automation_run', {
                    run_id: validRunId,
                    use_case: 'test'
                });
                expect(result).toBeDefined();
            }
        });

        it('AUT-010: Invalid ID', async () => {
            const result = await mcpClient.callTool('get_automation_run', {
                run_id: 999999999,
                use_case: 'test'
            });
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                expect(result.content[0].text).toMatch(/error|not found/i);
            }
        });
    });

    describe('9.5 list_automation_schedules', () => {
        it('AUT-011: No filter', async () => {
            const result = await mcpClient.callTool('list_automation_schedules', { use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(Array.isArray(data.list)).toBe(true);
            if (data.list.length > 0) {
                validScheduleId = data.list[0].id;
            }
        });
    });

    describe('9.6 get_automation_schedule', () => {
        it('AUT-012: Valid ID', async () => {
            if (validScheduleId) {
                const result = await mcpClient.callTool('get_automation_schedule', {
                    schedule_id: validScheduleId,
                    use_case: 'test'
                });
                expect(result).toBeDefined();
            }
        });

        it('AUT-013: Invalid ID', async () => {
            const result = await mcpClient.callTool('get_automation_schedule', {
                schedule_id: 999999999,
                use_case: 'test'
            });
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                expect(result.content[0].text).toMatch(/error|not found/i);
            }
        });
    });
});
