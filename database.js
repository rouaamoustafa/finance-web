
import dotenv from 'dotenv';
import pg from 'pg'; 
const { Client } = pg;
dotenv.config(); // Load environment variables
// Set up PostgreSQL connection using Supabase credentials
const client = new Client({
  connectionString: process.env.DATABASE_URL, // Use your Supabase connection string (make sure it's correct)
});
// Function to run SQL queries
const createTables = async () => {
  const queries = [
    // Create Subadmin Table
    // `
    //   CREATE TABLE IF NOT EXISTS subadmin (
    //     super_admin_id SERIAL PRIMARY KEY,
    //     name VARCHAR(255) NOT NULL,
    //     email VARCHAR(255) NOT NULL UNIQUE,
    //     password VARCHAR(255) NOT NULL
    //   );
    // `,

    // Create Admin Table
    // `
    //   CREATE TABLE IF NOT EXISTS admin (
    //     admin_id SERIAL PRIMARY KEY,
    //     name VARCHAR(255) NOT NULL,
    //     email VARCHAR(255) NOT NULL UNIQUE,
    //     password VARCHAR(255) NOT NULL
    //   );
    // `,


  `
      CREATE TABLE IF NOT EXISTS admins (
        admin_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'subadmin'))
      );
    `,

    `
      CREATE TABLE IF NOT EXISTS incomes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        amount NUMERIC NOT NULL,
        currency VARCHAR(255) NOT NULL,
        date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        admin_id INT REFERENCES admins(admin_id) ON DELETE CASCADE
      );
    `,

    `
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        amount NUMERIC NOT NULL,
        currency VARCHAR(255) NOT NULL,
        date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        admin_id INT REFERENCES admins(admin_id) ON DELETE CASCADE
      );
    `,

    `
      CREATE TABLE IF NOT EXISTS recurring_incomes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        amount NUMERIC NOT NULL,
        currency VARCHAR(255) NOT NULL,
        datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        start_date DATE NOT NULL,
        end_date DATE,
        admin_id INT REFERENCES admins(admin_id) ON DELETE CASCADE
      );
    `,

    `
      CREATE TABLE IF NOT EXISTS recurring_expenses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        amount NUMERIC NOT NULL,
        currency VARCHAR(255) NOT NULL,
        datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        start_date DATE NOT NULL,
        end_date DATE,
        admin_id INT REFERENCES admins(admin_id) ON DELETE CASCADE
      );
    `,

    `
      CREATE TABLE IF NOT EXISTS profit_goal (
        profit_goal_id SERIAL PRIMARY KEY,
        amount NUMERIC NOT NULL,
        currency VARCHAR(255) NOT NULL,
        date DATE,
        admin_id INT REFERENCES admins(admin_id) ON DELETE CASCADE
      );
    `
  ];

  try {
    await client.connect(); // Connect to PostgreSQL (Supabase)
    for (const query of queries) {
      await client.query(query); // Run each query to create tables
      console.log('Table created successfully');
    }
  } catch (err) {
    console.error('Error creating tables:', err.message);
  } finally {
    await client.end(); // Close the connection
  }
};

// Run the function to create the tables
createTables().catch((err) => {
  console.error('Error running table creation script:', err);
});