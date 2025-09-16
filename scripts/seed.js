const { execSync } = require('child_process');

// Simple seeding by running a Node script
console.log('Seeding database with demo data...');

try {
  execSync('node -e "' +
    'const { db } = require(\"./src/lib/db\"); ' +
    'const { users, buyers } = require(\"./src/lib/db/schema\"); ' +
    'const { createId } = require(\"@paralleldrive/cuid2\"); ' +
    'async function seed() { ' +
      'const userId = createId(); ' +
      'await db.insert(users).values({ id: userId, email: \"demo@example.com\", name: \"Demo User\" }); ' +
      'console.log(\"Demo user created with ID:\", userId); ' +
    '} ' +
    'seed().catch(console.error);' +
  '"', { stdio: 'inherit' });
  
  console.log('Database seeded successfully!');
} catch (error) {
  console.error('Seeding failed:', error.message);
}