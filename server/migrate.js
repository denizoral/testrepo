const { execSync } = require('child_process');

// Load environment variables from .env file
require('dotenv').config();

try {
  // Run the Prisma migration command
  console.log('Running Prisma migration...');
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  console.log('Migration successful.');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
