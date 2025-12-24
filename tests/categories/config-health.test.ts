import { describe, it, expect } from 'vitest';
import { mcpClient } from '../setup/mcp-client.js';

describe('Category 11: Configuration & Health', () => {
    let validConfigId: string | number;
    let validHealthConfigId: string | number;

    describe('11.1 list_templates', () => {
        it('CFG-001: No filter', async () => {
            const result = await mcpClient.callTool('list_templates', { use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(Array.isArray(data.list)).toBe(true);
            if (data.list.length > 0) {
                validConfigId = data.list[0].id;
            }
        });

        it('CFG-002: Filter by name', async () => {
            const result = await mcpClient.callTool('list_templates', {
                query: "name contains 'test'",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });
    });

    describe('11.2 get_template', () => {
        it('CFG-003: Valid config ID', async () => {
            if (validConfigId) {
                const result = await mcpClient.callTool('get_template', {
                    config_id: validConfigId,
                    use_case: 'test'
                });
                expect(result).toBeDefined();
            }
        });

        it('CFG-004: Invalid ID', async () => {
            const result = await mcpClient.callTool('get_template', {
                config_id: 999999999,
                use_case: 'test'
            });
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                expect(result.content[0].text).toMatch(/error|not found/i);
            }
        });
    });

    describe('11.3 list_health_configs', () => {
        it('HLT-001: No filter', async () => {
            const result = await mcpClient.callTool('list_health_configs', { use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(Array.isArray(data.list)).toBe(true);
            if (data.list.length > 0) {
                validHealthConfigId = data.list[0].id;
            }
        });
    });

    describe('11.4 get_health_config', () => {
        it('HLT-002: Valid ID', async () => {
            if (validHealthConfigId) {
                const result = await mcpClient.callTool('get_health_config', {
                    health_config_id: validHealthConfigId,
                    use_case: 'test'
                });
                expect(result).toBeDefined();
            }
        });

        it('HLT-003: Invalid ID', async () => {
            const result = await mcpClient.callTool('get_health_config', {
                health_config_id: 'invalid',
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
