const { execSync } = require('child_process');
const path = require('path');

const backendPath = path.join(process.cwd(), 'backend');

if (process.env.DATABASE_URL) {
  console.log('DATABASE_URL found. Running Prisma migrations...');
  try {
    execSync('npx prisma db push', { stdio: 'inherit', cwd: backendPath });
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
} else {
  console.warn('⚠️ DATABASE_URL not found. Skipping Prisma migrations.');
}

console.log('Starting the backend server...');
try {
  execSync('npm start', { stdio: 'inherit', cwd: backendPath });
} catch (error) {
  console.error('Failed to start server:', error.message);
  process.exit(1);
}
