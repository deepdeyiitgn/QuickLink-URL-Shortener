
// This file manages the connection to the MongoDB Atlas database.
// It uses a cached connection instance to improve performance in a serverless environment.
// FIX: Import `Db` type from `mongodb` to use for explicit typing.
import { MongoClient, Db } from 'mongodb';

// Using a global variable to cache the connection promise.
// This is a best practice for database connections in serverless functions.
let cachedClient: MongoClient | null = null;

// FIX: Add an explicit return type to `connectToDatabase`. This ensures the `db` object is correctly typed
// when used in other files, resolving "Untyped function calls may not accept type arguments" errors.
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
    // Moved the environment variable checks inside the function.
    // This prevents a crash on module load if the variables aren't set,
    // allowing the error to be caught gracefully by the API handler.
    const MONGODB_URI = process.env.MONGODB_URI;
    const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

    if (!MONGODB_URI) {
        throw new Error('Server configuration error: MONGODB_URI environment variable is not defined.');
    }
    if (!MONGODB_DB_NAME) {
        throw new Error('Server configuration error: MONGODB_DB_NAME environment variable is not defined.');
    }
    
    if (cachedClient) {
        const db = cachedClient.db(MONGODB_DB_NAME);
        return { client: cachedClient, db };
    }

    const client = new MongoClient(MONGODB_URI!);

    await client.connect();
    
    cachedClient = client;
    const db = client.db(MONGODB_DB_NAME);

    return { client, db };
}
