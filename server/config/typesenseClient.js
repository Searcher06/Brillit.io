import dotenv from 'dotenv'
dotenv.config()
import typesense from 'typesense'



const useCloud = process.env.TYPESENSE_ENV == 'cloud'

const client = new typesense.Client({
    nodes: [
        {
            host: 'localhost',
            port: 8108,
            protocol: 'http'
        }
    ],
    apiKey: 'xyz',
    connectionTimeoutSeconds: 2
});

export default client