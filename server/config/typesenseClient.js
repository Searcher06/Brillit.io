import dotenv from 'dotenv'
dotenv.config()
import typesense from 'typesense'

const useCloud = process.env.TYPESENSE_ENV === 'cloud'

const client = new typesense.Client({
    nodes: [
        useCloud
            ? {
                host: process.env.TYPESENSE_HOST,
                port: 443,
                protocol: 'https'
              }
            : {
                host: 'localhost',
                port: 8108,
                protocol: 'http'
              }
    ],
    apiKey: process.env.TYPESENSE_API_KEY || 'xyz',
    connectionTimeoutSeconds: 5
});

export default client