import mysql from 'mysql2/promise';
import config from '../config';
import { logger } from './logger';

/**
 * This script will create the database if it doesn't exist.
 * It's useful for initial setup.
 */
export const setupDatabase = async (): Promise<boolean> => {
  let connection;
  
  try {
    // Connect to MySQL without specifying a database
    connection = await mysql.createConnection({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      port: config.db.port
    });
    
    // Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.db.database} 
                           CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    
    logger.info(`Database '${config.db.database}' created or already exists`);
    return true;
  } catch (error) {
    logger.error('Database setup failed:', error);
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// If this file is run directly (not imported)
if (require.main === module) {
  (async () => {
    try {
      const success = await setupDatabase();
      if (success) {
        logger.info('Database setup completed successfully');
      } else {
        logger.error('Database setup failed');
        process.exit(1);
      }
      process.exit(0);
    } catch (error) {
      logger.error('An unexpected error occurred during database setup:', error);
      process.exit(1);
    }
  })();
}