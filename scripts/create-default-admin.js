const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createDefaultAdmin() {
  try {
    console.log('🍽️  Creating Default Admin User for Futurescape Lunch Tracker\n');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      console.log('✅ Admin already exists!');
      console.log(`Employee ID: ${existingAdmin.employeeId}`);
      console.log('Passcode: admin123');
      console.log('\nNote: If you forgot the passcode, delete the admin user and run this script again.');
      await prisma.$disconnect();
      return;
    }

    const hashedPasscode = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        employeeId: 'ADMIN001',
        passcode: hashedPasscode,
        role: 'ADMIN',
      },
    });

    console.log('\n✅ Default Admin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 ADMIN CREDENTIALS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Employee ID: ${admin.employeeId}`);
    console.log(`   Passcode: admin123`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Change the passcode after first login!');
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createDefaultAdmin();

