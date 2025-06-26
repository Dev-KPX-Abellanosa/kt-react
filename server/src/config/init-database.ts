import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const initDatabase = async () => {
    // Create connection without database to create the database first
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
        
        // Create database if it doesn't exist
        const dbName = process.env.DB_NAME || 'contacts_db';
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        console.log(`✅ Database '${dbName}' is ready`);

        // Use the database
        await connection.execute(`USE ${dbName}`);

        // Read and execute schema
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Split schema into individual statements
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
        
        // Verify tables exist
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('📊 Available tables:');
        (tables as any[]).forEach((table: any) => {
            console.log(`   - ${Object.values(table)[0]}`);
        });

        // Show sample data count
        const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
        const [contactCount] = await connection.execute('SELECT COUNT(*) as count FROM contacts');
        
        console.log('📈 Data summary:');
        console.log(`   - Users: ${(userCount as any[])[0].count}`);
        console.log(`   - Contacts: ${(contactCount as any[])[0].count}`);

    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    } finally {
        await connection.end();
    }
};

// Run initialization if this file is executed directly
if (require.main === module) {
    initDatabase()
        .then(() => {
            console.log('🎉 Database initialization completed successfully!');
            console.log('🔑 Test credentials: test@example.com / test123');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Database initialization failed:', error);
            process.exit(1);
        });
}

export default initDatabase; 