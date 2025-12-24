import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import "dotenv/config";

const SERVER_URL = process.env.MCP_SERVER_URL || "https://remotemanager.digi.com/mcp";
let API_KEY_ID = process.env.DRM_API_KEY_ID || "";
let API_KEY_SECRET = process.env.DRM_API_KEY_SECRET || "";

// Trim whitespace and warn if found
if (API_KEY_ID.trim() !== API_KEY_ID) {
    console.warn("WARNING: DRM_API_KEY_ID contained whitespace. Trimming.");
    API_KEY_ID = API_KEY_ID.trim();
}
if (API_KEY_SECRET.trim() !== API_KEY_SECRET) {
    console.warn("WARNING: DRM_API_KEY_SECRET contained whitespace. Trimming.");
    API_KEY_SECRET = API_KEY_SECRET.trim();
}

export class McpClientWrapper {
    private client: Client;
    private transport: StreamableHTTPClientTransport;
    private connected: boolean = false;

    constructor() {
        if (!API_KEY_ID || !API_KEY_SECRET) {
            console.warn("WARNING: DRM_API_KEY_ID or DRM_API_KEY_SECRET not set. Tests connecting to real server will fail.");
        }

        this.transport = new StreamableHTTPClientTransport(new URL(SERVER_URL), {
            requestInit: {
                headers: {
                    "X-API-KEY-ID": API_KEY_ID,
                    "X-API-KEY-SECRET": API_KEY_SECRET,
                },
            },
        });

        this.client = new Client(
            {
                name: "drm-mcp-tester",
                version: "1.0.0",
            },
            {
                capabilities: {},
            }
        );
    }

    async connect() {
        if (this.connected) return;
        try {
            await this.client.connect(this.transport);
            this.connected = true;
            console.log("Connected to MCP Server via Streamable HTTP");
        } catch (error) {
            console.error("Failed to connect to MCP Server:", error);
            throw error;
        }
    }

    async close() {
        if (!this.connected) return;
        await this.client.close();
        this.connected = false;
    }

    async callTool(name: string, args: any): Promise<any> {
        if (!this.connected) {
            await this.connect();
        }
        return this.client.callTool({
            name,
            arguments: args,
        });
    }
}

// Export a singleton instance
export const mcpClient = new McpClientWrapper();
