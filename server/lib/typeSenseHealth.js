import client from "../config/typesenseClient.js";

(async () => {
    try {
        const health = await client.health.retrieve();
        console.log('Typesense cloud connection is good:', health);
    } catch (error) {
        console.error('Failed to connect to Typesense cloud:', error);
    }
})();
