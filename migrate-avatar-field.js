import { PrismaClient } from '@prisma/client';

async function runMigration() {
  // Use production DATABASE_URL from environment
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Starting avatar field migration...');
    
    // Add avatar field to WidgetSettings table
    await prisma.$executeRaw`
      ALTER TABLE "WidgetSettings" 
      ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;
    `;
    
    console.log('✅ Migration completed successfully!');
    console.log('Added the following field to WidgetSettings:');
    console.log('- avatarUrl (String, nullable)');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

runMigration()
  .then(() => {
    console.log('🎉 Avatar field migration process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration process failed:', error);
    process.exit(1);
  });