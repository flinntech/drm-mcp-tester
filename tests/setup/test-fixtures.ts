export const TEST_CONFIG = {
    // Configuration MUST be provided via environment variables (e.g. .env file)
    CONNECTED_DEVICE_ID: process.env.TEST_CONNECTED_DEVICE_ID || '',
    DISCONNECTED_DEVICE_ID: process.env.TEST_DISCONNECTED_DEVICE_ID || '',
    DEVICE_NAME_SEARCH: process.env.TEST_DEVICE_NAME_SEARCH || '',
    KNOWN_GROUP: process.env.TEST_KNOWN_GROUP || '',
    KNOWN_DEVICE_TYPE: process.env.TEST_KNOWN_DEVICE_TYPE || '',

    // Timeframes (static for now, but could be env vars if needed)
    RECENT_TIMEFRAME: '-1h',
    HISTORICAL_TIMEFRAME: '-7d',

    // Alert/Monitor IDs for testing
    VALID_ALERT_ID: process.env.TEST_VALID_ALERT_ID || '',
    VALID_MONITOR_ID: process.env.TEST_VALID_MONITOR_ID || '',
};
