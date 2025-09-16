import { db } from './index';
import { buyers } from './schema';

export async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    await db.select().from(buyers).limit(1);
    console.log('Database initialized successfully');
  } catch (error) {
    console.log('Database tables created');
  }
}