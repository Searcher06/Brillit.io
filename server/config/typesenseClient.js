import dotenv from 'dotenv'
dotenv.config()
import typesense from 'typesense'



const useCloud = process.env.TYPESENSE_ENV == 'cloud'

const client = new typesense.Client({
    nodes: [
        {
            host: 'wp1dm4n589tkgvuyp.a1.typesense.net',
            port: 443,
            protocol: 'https'
        }

    ],
    apiKey: 'P2ttk8qfFk9UNqBidAb1f9p65cX3ECUb',
    connectionTimeoutSeconds: 10,
})
console.log('Am here', process.env.API_KEY)

export default client