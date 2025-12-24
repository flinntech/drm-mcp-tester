import { describe, it, expect } from 'vitest';
import { mcpClient } from '../setup/mcp-client.js';

describe('Category 1: Query Syntax Helpers', () => {
    describe('1.1 get_query_syntax_rules', () => {
        it('QS-001: Basic invocation', async () => {
            const result = await mcpClient.callTool('get_query_syntax_rules', {});
            expect(result).toBeDefined();
            // Expecting some text content describing rules
            const content = result.content[0].text;
            expect(content).toBeTruthy();
        });

        it('QS-002: Response structure', async () => {
            const result = await mcpClient.callTool('get_query_syntax_rules', {});
            const content = result.content[0].text;
            // Should mention operators or examples
            expect(content).toMatch(/operators|examples|syntax/i);
        });
    });

    describe('1.2 get_query_syntax_help', () => {
        it('QS-003: Basic invocation', async () => {
            const result = await mcpClient.callTool('get_query_syntax_help', {});
            expect(result).toBeDefined();
            const content = result.content[0].text;
            expect(content.length).toBeGreaterThan(0);
        });

        it('QS-004: Single quote reminder', async () => {
            const result = await mcpClient.callTool('get_query_syntax_help', {});
            const content = result.content[0].text;
            expect(content).toMatch(/single quotes/i);
        });
    });

    describe('1.3 get_device_fields', () => {
        it('QS-005: Basic invocation', async () => {
            const result = await mcpClient.callTool('get_device_fields', {});
            expect(result).toBeDefined();
            // Assuming it returns a JSON string or structure that lists fields
            const content = result.content[0].text;
            expect(content).toBeTruthy();
        });

        it('QS-006: Field metadata', async () => {
            const result = await mcpClient.callTool('get_device_fields', {});
            const content = result.content[0].text;
            // Should contain field names like 'id', 'name', 'type'
            expect(content).toMatch(/id|name|type/);
        });
    });

    describe('1.4 get_query_examples', () => {
        it('QS-007: No filter', async () => {
            const result = await mcpClient.callTool('get_query_examples', {});
            expect(result).toBeDefined();
            const content = result.content[0].text;
            expect(content).toBeTruthy();
        });

        it('QS-008: Filter by type - general', async () => {
            const result = await mcpClient.callTool('get_query_examples', { query_type: 'general_filtering' });
            expect(result).toBeDefined();
        });

        it('QS-009: Filter by type - status', async () => {
            const result = await mcpClient.callTool('get_query_examples', { query_type: 'filter_by_status' });
            expect(result).toBeDefined();
        });

        it('QS-010: Filter by type - signal', async () => {
            const result = await mcpClient.callTool('get_query_examples', { query_type: 'filter_by_signal' });
            expect(result).toBeDefined();
        });

        it('QS-011: Filter by type - time', async () => {
            const result = await mcpClient.callTool('get_query_examples', { query_type: 'filter_by_time' });
            expect(result).toBeDefined();
        });

        it('QS-012: Invalid filter type', async () => {
            // Expect graceful handling, likely an error message or empty list, but not a crash
            const result = await mcpClient.callTool('get_query_examples', { query_type: 'invalid_type' });
            expect(result).toBeDefined();
        });
    });

    describe('1.5 validate_query_syntax', () => {
        it('QS-013: Valid query - equals', async () => {
            const result = await mcpClient.callTool('validate_query_syntax', { query: "connection_status='connected'" });
            const content = result.content[0].text;
            // Expect validation pass message
            expect(content).toMatch(/valid|passed|success/i);
            expect(result.isError).toBeFalsy();
        });

        it('QS-014: Valid query - contains', async () => {
            const result = await mcpClient.callTool('validate_query_syntax', { query: "type contains 'EX50'" });
            const content = result.content[0].text;
            expect(content).toMatch(/valid|passed|success/i);
        });

        it('QS-015: Valid query - compound', async () => {
            const result = await mcpClient.callTool('validate_query_syntax', { query: "connection_status='connected' and signal_percent>50" });
            const content = result.content[0].text;
            expect(content).toMatch(/valid|passed|success/i);
        });

        it('QS-016: Invalid - double quotes', async () => {
            const result = await mcpClient.callTool('validate_query_syntax', { query: 'type="EX50"' });
            const content = result.content[0].text; // Or it might be result.isError if the tool throws

            // The test plan says "Error: must use single quotes"
            // Depending on implementation, this might come as an error response or a validation message
            if (result.isError) {
                expect(result.content[0].text).toMatch(/single quote|invalid/i);
            } else {
                expect(content).toMatch(/single quote|invalid/i);
            }
        });

        it('QS-017: Invalid - bad operator', async () => {
            const result = await mcpClient.callTool('validate_query_syntax', { query: "type equals 'EX50'" });
            if (result.isError) {
                expect(result.content[0].text).toMatch(/operator/i);
            } else {
                expect(result.content[0].text).toMatch(/operator/i);
            }
        });

        it('QS-018: Empty query', async () => {
            const result = await mcpClient.callTool('validate_query_syntax', { query: '' });
            // Should pass (no filter)
            expect(result.content[0].text).toMatch(/valid|passed|success/i);
        });
    });
});
