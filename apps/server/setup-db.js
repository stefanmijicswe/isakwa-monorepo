require('dotenv').config();
const { execSync } = require('child_process');

console.log('DATABASE_URL:', process.env.DATABASE_URL);

try {
  console.log('Running prisma db push...');
  execSync('yarn prisma db push', { stdio: 'inherit' });
  console.log('Database setup complete!');
} catch (error) {
  console.error('Error setting up database:', error.message);
}
