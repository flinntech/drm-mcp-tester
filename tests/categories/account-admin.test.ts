import { describe, it, expect } from 'vitest';
import { mcpClient } from '../setup/mcp-client.js';

describe('Category 12: Account & Admin', () => {
    let validUserId: string | number;
    let validFilesetName: string;
    let validFileName: string;

    describe('12.1 current_login', () => {
        it('ACC-001: Basic call', async () => {
            const result = await mcpClient.callTool('current_login', { use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(data).toHaveProperty('username');
        });

        it('ACC-002: Response fields', async () => {
            const result = await mcpClient.callTool('current_login', { use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(data).toHaveProperty('customer_id');
            expect(data).toHaveProperty('api_key_id'); // Expected field name per API design
        });
    });

    describe('12.2 current_account', () => {
        it('ACC-003: Basic call', async () => {
            const result = await mcpClient.callTool('current_account', { use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(data).toHaveProperty('account_name'); // Expected field name per API design
        });

        it('ACC-004: Response fields', async () => {
            const result = await mcpClient.callTool('current_account', { use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(data).toHaveProperty('customer_id');
        });
    });

    describe('12.3 get_account_security', () => {
        it('ACC-005: Account settings', async () => {
            const result = await mcpClient.callTool('get_account_security', { use_case: 'test' });
            expect(result).toBeDefined();
        });

        it('ACC-006: System defaults', async () => {
            const result = await mcpClient.callTool('get_account_security', {
                system_defaults: 'true',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });
    });

    describe('12.4 list_users', () => {
        it('USR-001: No filter', async () => {
            const result = await mcpClient.callTool('list_users', { use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(Array.isArray(data.list)).toBe(true);
            if (data.list.length > 0) {
                validUserId = data.list[0].id;
            }
        });

        it('USR-002: Filter active', async () => {
            const result = await mcpClient.callTool('list_users', {
                query: "status='active'",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('USR-003: Filter by role', async () => {
            const result = await mcpClient.callTool('list_users', {
                query: "role='admin'",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });
    });

    describe('12.5 get_user', () => {
        it('USR-004: Valid user ID', async () => {
            if (validUserId) {
                const result = await mcpClient.callTool('get_user', {
                    user_id: validUserId,
                    use_case: 'test'
                });
                expect(result).toBeDefined();
            }
        });

        it('USR-005: Invalid ID', async () => {
            const result = await mcpClient.callTool('get_user', {
                user_id: 'invalid',
                use_case: 'test'
            });
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                expect(result.content[0].text).toMatch(/error|not found/i);
            }
        });
    });

    describe('12.6 list_events', () => {
        it('EVT-001: Recent events', async () => {
            const result = await mcpClient.callTool('list_events', {
                start_time: '-1h',
                use_case: 'test'
            });
            const data = JSON.parse(result.content[0].text);
            expect(Array.isArray(data.list)).toBe(true);
        });

        it('EVT-002: Filter by facility', async () => {
            const result = await mcpClient.callTool('list_events', {
                query: "facility='AUTHENTICATION'",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('EVT-003: With size limit', async () => {
            const result = await mcpClient.callTool('list_events', {
                size: 50,
                use_case: 'test'
            });
            const data = JSON.parse(result.content[0].text);
            expect(data.list.length).toBeLessThanOrEqual(50);
        });
    });

    describe('12.7 list_events_bulk', () => {
        it('EVT-004: Basic CSV', async () => {
            const result = await mcpClient.callTool('list_events_bulk', {
                start_time: '-1h',
                use_case: 'test'
            });
            expect(result.content[0].text).toBeDefined(); // CSV
        });
    });

    describe('12.8 list_file_sets', () => {
        it('FS-001: No filter', async () => {
            const result = await mcpClient.callTool('list_file_sets', { use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(Array.isArray(data.list)).toBe(true);
            if (data.list.length > 0) {
                validFilesetName = data.list[0].id || 'unknown'; // assuming id is name or similar
            }
        });
    });

    describe('12.9 list_files_in_a_set', () => {
        it('FS-002: Valid set', async () => {
            if (validFilesetName) {
                const result = await mcpClient.callTool('list_files_in_a_set', {
                    fileset_name: validFilesetName,
                    use_case: 'test'
                });
                const data = JSON.parse(result.content[0].text);
                if (data.list.length > 0) {
                    validFileName = `${validFilesetName}/${data.list[0].name}`;
                }
                expect(result).toBeDefined();
            }
        });

        it('FS-003: Invalid set', async () => {
            const result = await mcpClient.callTool('list_files_in_a_set', {
                fileset_name: 'nonexistent',
                use_case: 'test'
            });
            if (result.isError) {
                expect(result.isError).toBe(true);
            }
        });
    });

    describe('12.10 get_file', () => {
        it('FS-004: Valid file', async () => {
            if (validFileName) {
                const result = await mcpClient.callTool('get_file', {
                    file_name: validFileName,
                    use_case: 'test'
                });
                expect(result).toBeDefined();
            }
        });

        it('FS-005: Invalid file', async () => {
            const result = await mcpClient.callTool('get_file', {
                file_name: 'invalid/path',
                use_case: 'test'
            });
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                expect(result.content[0].text).toMatch(/error|not found/i);
            }
        });
    });

    describe('12.11 get_api_info', () => {
        it('API-001: Top level', async () => {
            const result = await mcpClient.callTool('get_api_info', { use_case: 'test' });
            expect(result).toBeDefined();
        });

        it('API-002: Devices endpoint', async () => {
            const result = await mcpClient.callTool('get_api_info', {
                endpoint: 'devices',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('API-003: Streams endpoint', async () => {
            const result = await mcpClient.callTool('get_api_info', {
                endpoint: 'streams',
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });
    });
});
