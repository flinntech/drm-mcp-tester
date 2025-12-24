import { describe, it, expect } from 'vitest';
import { mcpClient } from '../setup/mcp-client.js';
import { TEST_CONFIG } from '../setup/test-fixtures.js';

describe('Category 6: Groups', () => {
    describe('6.1 list_groups', () => {
        it('GRP-001: No filter', async () => {
            const result = await mcpClient.callTool('list_groups', { use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(Array.isArray(data.list)).toBe(true);
            expect(data).toHaveProperty('count');
        });

        it('GRP-002: Filter by path', async () => {
            // Assuming known group like '/Demo'
            const result = await mcpClient.callTool('list_groups', {
                query: `path startswith '/${TEST_CONFIG.KNOWN_GROUP}'`,
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('GRP-003: With ordering', async () => {
            const result = await mcpClient.callTool('list_groups', { orderby: 'path asc', use_case: 'test' });
            expect(result).toBeDefined();
        });

        it('GRP-004: With pagination', async () => {
            const result = await mcpClient.callTool('list_groups', { size: 10, use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(data.list.length).toBeLessThanOrEqual(10);
        });
    });
});
