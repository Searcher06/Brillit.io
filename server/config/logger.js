import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the actual .env in backend/
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const cLogger = () => {
    console.log("Hi am logger.js", process.env.API_KEY)
    console.log("Hi am logger.js", process.env.DATABASE_URI)
}

cLogger()

export default cLogger
