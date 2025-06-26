import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const resetDatabase = async () => {
    // Create connection without database
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        port: parseInt(process.env.DB_PORT || '3306'),
        ssl: {
            ca: fs.readFileSync(path.join(__dirname, '../../isrgrootx1.pem')),
        },
    });

    try {
        console.log('🔌 Connecting to MySQL server...');
        
        const dbName = process.env.DB_NAME || 'contacts_db';
        
        // Drop database if it exists
        console.log(`🗑️  Dropping database '${dbName}'...`);
        await connection.execute(`DROP DATABASE IF EXISTS ${dbName}`);
        console.log(`✅ Database '${dbName}' dropped successfully`);

        // Create database
        console.log(`📦 Creating database '${dbName}'...`);
        await connection.execute(`CREATE DATABASE ${dbName}`);
        console.log(`✅ Database '${dbName}' created successfully`);

        // Use the database
        await connection.execute(`USE ${dbName}`);

        // Read and execute schema
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        const statements = schema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);

        console.log('📋 Creating tables...');
        
        for (const statement of statements) {
            if (statement) {
                await connection.execute(statement);
            }
        }

        console.log('✅ All tables created successfully!');

        // Read and execute seed data
        const seedPath = path.join(__dirname, '../database/seed.sql');
        if (fs.existsSync(seedPath)) {
            console.log('🌱 Seeding database with sample data...');
            const seed = fs.readFileSync(seedPath, 'utf8');
            
            const seedStatements = seed
                .split(';')
                .map(stmt => stmt.trim())
                .filter(stmt => stmt.length > 0);

            for (const statement of seedStatements) {
                if (statement) {
                    await connection.execute(statement);
                }
            }
            console.log('✅ Sample data inserted successfully!');
        }

        console.log('🎉 Database reset completed successfully!');

    } catch (error) {
        console.error('❌ Database reset failed:', error);
        throw error;
    } finally {
        await connection.end();
    }
};

// Run reset if this file is executed directly
if (require.main === module) {
    resetDatabase()
        .then(() => {
            console.log('🔑 Test credentials: test@example.com / test123');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Database reset failed:', error);
            process.exit(1);
        });
}

export default resetDatabase; 