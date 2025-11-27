const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('🍽️  Setting up Futurescape Lunch Tracker Database\n');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      console.log('✅ Admin already exists!');
      console.log(`Employee ID: ${existingAdmin.employeeId}`);
      console.log('\nTo reset admin, delete the admin user first.');
    } else {
      const hashedPasscode = await bcrypt.hash('admin123', 10);
      const admin = await prisma.user.create({
        data: {
          name: 'Admin',
          employeeId: 'ADMIN001',
          passcode: hashedPasscode,
          role: 'ADMIN',
        },
      });

      console.log('✅ Default Admin created!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 ADMIN CREDENTIALS:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`   Employee ID: ${admin.employeeId}`);
      console.log(`   Passcode: admin123`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    console.log('\n✅ Database setup complete!');
  } catch (error) {
    console.error('\n❌ Error setting up database:', error.message);
    if (error.message.includes('P1001')) {
      console.log('\n💡 Tip: Make sure your DATABASE_URL is correct.');
      console.log('   For local: DATABASE_URL="file:./dev.db"');
      console.log('   For Vercel: Use PostgreSQL connection string');
    }
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();

