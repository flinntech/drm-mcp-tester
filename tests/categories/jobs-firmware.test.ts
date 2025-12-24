import { describe, it, expect } from 'vitest';
import { mcpClient } from '../setup/mcp-client.js';
import { TEST_CONFIG } from '../setup/test-fixtures.js';

describe('Category 10: Jobs & Firmware', () => {
    let validJobId: string | number;
    let validFirmwareId: string | number;
    let validUpdateId: string | number;

    describe('10.1 list_jobs', () => {
        it('JOB-001: No filter', async () => {
            const result = await mcpClient.callTool('list_jobs', { use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(Array.isArray(data.list)).toBe(true);
            if (data.list.length > 0) {
                validJobId = data.list[0].id;
            }
        });

        it('JOB-002: Filter in progress', async () => {
            const result = await mcpClient.callTool('list_jobs', {
                query: "job_status='in_progress'",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('JOB-003: Filter by type', async () => {
            const result = await mcpClient.callTool('list_jobs', {
                query: "job_type='firmware_update'",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('JOB-004: Recent jobs', async () => {
            const result = await mcpClient.callTool('list_jobs', {
                query: "job_submit_time>-1d",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });
    });

    describe('10.2 list_jobs_bulk', () => {
        it('JOB-005: Basic CSV', async () => {
            const result = await mcpClient.callTool('list_jobs_bulk', { use_case: 'test' });
            expect(result.content[0].text).toBeDefined();
            // Should check for CSV structure if possible
        });
    });

    describe('10.3 get_job', () => {
        it('JOB-006: Valid job ID', async () => {
            if (validJobId) {
                const result = await mcpClient.callTool('get_job', {
                    job_id: validJobId,
                    use_case: 'test'
                });
                expect(result).toBeDefined();
            }
        });

        it('JOB-007: Invalid ID', async () => {
            const result = await mcpClient.callTool('get_job', {
                job_id: 999999999,
                use_case: 'test'
            });
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                expect(result.content[0].text).toMatch(/error|not found/i);
            }
        });
    });

    describe('10.4 list_firmware', () => {
        it('FW-001: No filter', async () => {
            const result = await mcpClient.callTool('list_firmware', { use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(Array.isArray(data.list)).toBe(true);
            if (data.list.length > 0) {
                validFirmwareId = data.list[0].id; // or however it is identified
            }
        });

        it('FW-002: Filter by type', async () => {
            const result = await mcpClient.callTool('list_firmware', {
                query: `type contains '${TEST_CONFIG.KNOWN_DEVICE_TYPE}'`,
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });

        it('FW-003: Production only', async () => {
            const result = await mcpClient.callTool('list_firmware', {
                query: "production=true",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });
    });

    describe('10.5 get_firmware', () => {
        it('FW-004: Valid firmware ID', async () => {
            if (validFirmwareId) {
                const result = await mcpClient.callTool('get_firmware', {
                    firmware_id: validFirmwareId,
                    use_case: 'test'
                });
                expect(result).toBeDefined();
            }
        });

        it('FW-005: Invalid ID', async () => {
            const result = await mcpClient.callTool('get_firmware', {
                firmware_id: 999999999,
                use_case: 'test'
            });
            if (result.isError) {
                expect(result.isError).toBe(true);
            } else {
                expect(result.content[0].text).toMatch(/error|not found/i);
            }
        });
    });

    describe('10.6 list_firmware_updates', () => {
        it('FW-006: No filter', async () => {
            const result = await mcpClient.callTool('list_firmware_updates', { use_case: 'test' });
            const data = JSON.parse(result.content[0].text);
            expect(Array.isArray(data.list)).toBe(true);
            if (data.list.length > 0) {
                validUpdateId = data.list[0].id;
            }
        });

        it('FW-007: Filter active', async () => {
            const result = await mcpClient.callTool('list_firmware_updates', {
                query: "status='active'",
                use_case: 'test'
            });
            expect(result).toBeDefined();
        });
    });

    describe('10.7 get_firmware_update', () => {
        it('FW-008: Valid update ID', async () => {
            if (validUpdateId) {
                const result = await mcpClient.callTool('get_firmware_update', {
                    update_id: validUpdateId,
                    use_case: 'test'
                });
                expect(result).toBeDefined();
            }
        });

        it('FW-009: Invalid ID', async () => {
            const result = await mcpClient.callTool('get_firmware_update', {
                update_id: 999999999,
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
