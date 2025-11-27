const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    console.log('🍽️  Creating Admin User for Futurescape Lunch Tracker\n');

    const name = await question('Enter admin name: ');
    const employeeId = await question('Enter Employee ID: ');
    const passcode = await question('Enter passcode: ');

    const hashedPasscode = await bcrypt.hash(passcode, 10);

    const admin = await prisma.user.create({
      data: {
        name,
        employeeId,
        passcode: hashedPasscode,
        role: 'ADMIN',
      },
    });

    console.log('\n✅ Admin created successfully!');
    console.log(`Name: ${admin.name}`);
    console.log(`Employee ID: ${admin.employeeId}`);
    console.log(`Role: ${admin.role}`);
  } catch (error) {
    if (error.code === 'P2002') {
      console.error('\n❌ Error: Employee ID already exists!');
    } else {
      console.error('\n❌ Error creating admin:', error.message);
    }
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin();

