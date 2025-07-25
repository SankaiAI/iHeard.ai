import { PrismaClient } from '@prisma/client';

async function verifyMigration() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Verifying avatar field migration...');
    
    // Check if avatarUrl field exists in WidgetSettings table
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'WidgetSettings'
      AND column_name = 'avatarUrl'
      ORDER BY column_name;
    `;
    
    console.log('✅ Avatar field in WidgetSettings table:');
    console.table(result);
    
    // Test that we can query the field
    const testRecord = await prisma.widgetSettings.findFirst({
      select: {
        id: true,
        shop: true,
        chatTitle: true,
        avatarUrl: true
      }
    });
    
    if (testRecord) {
      console.log('✅ Sample record with avatar field:', testRecord);
    } else {
      console.log('ℹ️ No existing records found (this is normal for new installations)');
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verifyMigration()
  .then(() => {
    console.log('🎉 Avatar field migration verification completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Verification failed:', error);
    process.exit(1);
  });