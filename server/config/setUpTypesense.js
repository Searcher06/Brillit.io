import client from "./typesenseClient.js";

const schema = {
    name: 'videos',
    fields: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', optional: true },
        { name: 'url', type: 'string' },
        { name: 'channel', type: 'string' },
        { name: 'tags', type: 'string[]', optional: true },
        { name: 'views', type: 'int32' },
        { name: 'createdAt', type: 'int64', optional: true }
    ],
    default_sorting_field: 'views'
}


async function setupTypesense() {
    try {
        await client.collections('videos').retrieve();
        console.log('Collection already exists');
    } catch (err) {
        if (err.constructor.name === 'ObjectNotFound') {
            await client.collections().create(schema);
            console.log('reated videos collection');
        } else {
            console.error('Error checking collection:', err);
        }
    }
}



setupTypesense();

export default setupTypesense;
