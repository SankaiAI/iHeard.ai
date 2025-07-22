# Prisma Migration Guide for Production Database

This guide documents the step-by-step process to migrate Prisma schema changes to the production Supabase database when direct migration commands timeout due to connection issues.

## Background

When working with Vercel + Supabase deployments, sometimes the standard Prisma migration commands (`prisma migrate deploy`, `prisma db push`) may timeout due to network connectivity issues or database connection pooling limits. This guide provides an alternative approach using custom migration scripts.

## Prerequisites

- Vercel CLI installed and authenticated
- Access to production environment variables
- Node.js with ES modules support
- Prisma Client installed

## Step-by-Step Migration Process

### 1. Update Your Prisma Schema

First, ensure your `prisma/schema.prisma` file contains the new fields you want to add:

```prisma
model YourModel {
  // Existing fields...
  id              String   @id @default(cuid())
  existingField   String   @default("value")
  
  // NEW FIELDS: Add your new schema fields here
  newField1       Boolean  @default(false)
  newField2       String?  @default("default_value")
  newField3       Int?     @default(0)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### 2. Deploy Your Application to Vercel

Deploy your application to production first to ensure the new schema is available:

```bash
vercel --prod
```

This ensures your application code is updated with the new schema definition.

### 3. Get Production Environment Variables

Pull the production environment variables:

```bash
vercel env pull .env.production
```

### 4. Create a Custom Migration Script

Create a migration script `migrate-production.js`. Replace the table name, field names, and data types according to your schema changes:

```javascript
import { PrismaClient } from '@prisma/client';

async function runMigration() {
  // Use production DATABASE_URL from environment
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Starting migration...');
    
    // CUSTOMIZE THIS SECTION: Update table name and fields according to your schema
    await prisma.$executeRaw`
      ALTER TABLE "YourTableName" 
      ADD COLUMN IF NOT EXISTS "newField1" BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS "newField2" TEXT DEFAULT 'default_value',
      ADD COLUMN IF NOT EXISTS "newField3" INTEGER DEFAULT 0;
    `;
    
    console.log('✅ Migration completed successfully!');
    console.log('Added the following fields to YourTableName:');
    console.log('- newField1 (Boolean, default: false)');
    console.log('- newField2 (String, default: "default_value")');
    console.log('- newField3 (Integer, default: 0)');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

runMigration()
  .then(() => {
    console.log('🎉 Migration process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration process failed:', error);
    process.exit(1);
  });
```

### 5. Run the Migration Script

Execute the migration script with the production database URL:

```bash
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2- | tr -d '"') node migrate-production.js
```

Expected output:
```
🔄 Starting migration...
✅ Migration completed successfully!
Added the following fields to YourTableName:
- newField1 (Boolean, default: false)
- newField2 (String, default: "default_value")
- newField3 (Integer, default: 0)
🎉 Migration process completed!
```

### 6. Verify the Migration

Create a verification script `verify-migration.js`. Update the table name and field names to match your schema:

```javascript
import { PrismaClient } from '@prisma/client';

async function verifyMigration() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Verifying migration...');
    
    // CUSTOMIZE THIS: Update table name and field names
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns 
      WHERE table_name = 'YourTableName'
      AND column_name IN ('newField1', 'newField2', 'newField3')
      ORDER BY column_name;
    `;
    
    console.log('✅ New fields in YourTableName table:');
    console.table(result);
    
    // Optional: Test a query with the new fields
    // const testRecord = await prisma.yourModel.findFirst({
    //   select: {
    //     id: true,
    //     newField1: true,
    //     newField2: true,
    //     newField3: true
    //   }
    // });
    // console.log('✅ Sample record with new fields:', testRecord);
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verifyMigration()
  .then(() => {
    console.log('🎉 Migration verification completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Verification failed:', error);
    process.exit(1);
  });
```

Run the verification:

```bash
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2- | tr -d '"') node verify-migration.js
```

### 7. Regenerate Prisma Client

After successful migration, regenerate the Prisma client to recognize the new fields:

```bash
npx prisma generate
```

### 8. Clean Up

Remove temporary files:

```bash
rm migrate-production.js verify-migration.js .env.production
```

## Common Data Types and SQL Equivalents

| Prisma Type | PostgreSQL Type | Example ALTER TABLE |
|-------------|----------------|---------------------|
| `String` | `TEXT` | `ADD COLUMN "field" TEXT DEFAULT 'value'` |
| `String?` | `TEXT` (nullable) | `ADD COLUMN "field" TEXT` |
| `Int` | `INTEGER` | `ADD COLUMN "field" INTEGER DEFAULT 0` |
| `BigInt` | `BIGINT` | `ADD COLUMN "field" BIGINT DEFAULT 0` |
| `Float` | `DOUBLE PRECISION` | `ADD COLUMN "field" DOUBLE PRECISION DEFAULT 0.0` |
| `Boolean` | `BOOLEAN` | `ADD COLUMN "field" BOOLEAN DEFAULT false` |
| `DateTime` | `TIMESTAMP(3)` | `ADD COLUMN "field" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP` |
| `Json` | `JSONB` | `ADD COLUMN "field" JSONB DEFAULT '{}'` |
| `Decimal` | `DECIMAL` | `ADD COLUMN "field" DECIMAL(10,2) DEFAULT 0.00` |

## Migration Script Templates

### Adding New Fields
```javascript
await prisma.$executeRaw`
  ALTER TABLE "TableName" 
  ADD COLUMN IF NOT EXISTS "newField1" TEXT DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS "newField2" BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS "newField3" INTEGER DEFAULT 0;
`;
```

### Adding New Table
```javascript
await prisma.$executeRaw`
  CREATE TABLE IF NOT EXISTS "NewTable" (
    "id" TEXT NOT NULL,
    "field1" TEXT NOT NULL DEFAULT 'default',
    "field2" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    
    CONSTRAINT "NewTable_pkey" PRIMARY KEY ("id")
  );
`;
```

### Adding Indexes
```javascript
await prisma.$executeRaw`
  CREATE INDEX IF NOT EXISTS "TableName_fieldName_idx" ON "TableName"("fieldName");
`;
```

### Adding Unique Constraints
```javascript
await prisma.$executeRaw`
  ALTER TABLE "TableName" 
  ADD CONSTRAINT "TableName_fieldName_key" UNIQUE ("fieldName");
`;
```

## Key Points to Remember

1. **Use ES Module Imports**: Since the project uses `"type": "module"` in package.json, use `import` instead of `require`.

2. **Use Raw SQL**: When direct Prisma migration commands timeout, raw SQL with `$executeRaw` is more reliable.

3. **IF NOT EXISTS**: Always use `IF NOT EXISTS` in ALTER TABLE statements to make migrations idempotent.

4. **Environment Variables**: Extract the DATABASE_URL from the production environment file and pass it to the script.

5. **Verify Success**: Always verify that the migration worked by checking the database schema.

6. **Regenerate Client**: Remember to run `npx prisma generate` after schema changes to update the Prisma client.

7. **Customize Scripts**: Update table names, field names, data types, and default values according to your specific schema changes.

## Troubleshooting

### Connection Timeouts
If you experience connection timeouts with standard Prisma commands:
- Use the custom migration script approach documented above
- Check your Supabase connection pooling settings
- Verify your DATABASE_URL is correct

### Prisma Client Errors
If you get "Unknown field" errors after migration:
- Run `npx prisma generate` to regenerate the client
- Restart your development server
- Clear node_modules and reinstall if needed

### Migration Script Fails
- Check that the DATABASE_URL is correctly extracted from the environment file
- Verify you have the necessary database permissions
- Ensure the table name matches exactly (case-sensitive)
- Verify SQL syntax is correct for PostgreSQL

### Schema Mismatch
If your Prisma schema doesn't match the database:
- Use `npx prisma db pull` to sync schema with database
- Use `npx prisma format` to format the schema file
- Compare local and production schemas carefully

## Example Migration Output

```
✅ New fields in YourTableName table:
┌─────────┬─────────────────────┬───────────┬────────────────────┐
│ (index) │ column_name         │ data_type │ column_default     │
├─────────┼─────────────────────┼───────────┼────────────────────┤
│ 0       │ 'newField1'         │ 'boolean' │ 'false'            │
│ 1       │ 'newField2'         │ 'text'    │ "'default'::text"  │
│ 2       │ 'newField3'         │ 'integer' │ '0'                │
└─────────┴─────────────────────┴───────────┴────────────────────┘
```

This confirms that all new fields have been successfully added to the production database with the correct data types and default values.

## Recent Example (Reference)

This guide was created based on a successful migration of gradient and glass effect fields to the WidgetSettings table:

- `gradientEnabled` (Boolean, default: false)
- `gradientColor1` (Text, default: "#ee5cee")
- `gradientColor2` (Text, default: "#31d1d1") 
- `gradientDirection` (Text, default: "to right")
- `glassEffect` (Boolean, default: false)

The migration was successful and the production database now supports these new appearance settings.