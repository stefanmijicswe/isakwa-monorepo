import { config } from 'dotenv';
config();

import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaService();

async function seedLibraryInventoryData() {
  console.log('Starting Library & Inventory seed...');

  try {
    // 1. Create test users (students and staff) for Library & Inventory
    console.log('Creating test users...');
    
    const hashedPassword = await bcrypt.hash('password123', 10); // Proper bcrypt hash
    
    // Student 1
    let student1 = await prisma.user.findFirst({
      where: { email: 'student1@isakwa.edu' }
    });
    
    if (!student1) {
      student1 = await prisma.user.create({
        data: {
          email: 'student1@isakwa.edu',
          password: hashedPassword,
          firstName: 'Marko',
          lastName: 'Petrović',
          role: 'STUDENT',
          isActive: true
        }
      });
    }

    // Student 2
    let student2 = await prisma.user.findFirst({
      where: { email: 'student2@isakwa.edu' }
    });
    
    if (!student2) {
      student2 = await prisma.user.create({
        data: {
          email: 'student2@isakwa.edu',
          password: hashedPassword,
          firstName: 'Ana',
          lastName: 'Nikolić',
          role: 'STUDENT',
          isActive: true
        }
      });
    }

    // Student Service Staff (za inventory issuance)
    let staffUser = await prisma.user.findFirst({
      where: { email: 'staff@isakwa.edu' }
    });
    
    if (!staffUser) {
      staffUser = await prisma.user.create({
        data: {
          email: 'staff@isakwa.edu',
          password: hashedPassword,
          firstName: 'Milica',
          lastName: 'Jovanović',
          role: 'STUDENT_SERVICE',
          isActive: true
        }
      });
    }

    // Create StudentProfiles for test students
    console.log('Creating student profiles...');
    
    let student1Profile = await prisma.studentProfile.findFirst({
      where: { userId: student1.id }
    });
    
    if (!student1Profile) {
      student1Profile = await prisma.studentProfile.upsert({
        where: { studentIndex: 'CS2021001' },
        update: {},
        create: {
          userId: student1.id,
          studentIndex: 'CS2021001',
          year: 3,
          studyProgramId: 1, // Bachelor of Computer Science
          phoneNumber: '+381 64 1234567',
          status: 'ACTIVE',
          enrollmentYear: '2021',
          jmbg: '1234567890001' // Unique JMBG
        }
      });
    }

    let student2Profile = await prisma.studentProfile.findFirst({
      where: { userId: student2.id }
    });
    
    if (!student2Profile) {
      student2Profile = await prisma.studentProfile.upsert({
        where: { studentIndex: 'BBA2022002' },
        update: {},
        create: {
          userId: student2.id,
          studentIndex: 'BBA2022002',
          year: 2,
          studyProgramId: 2, // Bachelor of Business Administration
          phoneNumber: '+381 64 7654321',
          status: 'ACTIVE',
          enrollmentYear: '2022',
          jmbg: '1234567890002' // Unique JMBG
        }
      });
    }

    // 2. Library Items
    console.log('Creating library items...');
    
    await prisma.libraryItem.upsert({
      where: { id: 1 },
      update: {},
      create: {
        title: 'Introduction to Computer Science',
        author: 'John Smith',
        isbn: '978-0123456789',
        type: 'BOOK',
        category: 'Computer Science',
        description: 'Comprehensive introduction to computer science fundamentals.',
        copies: 3,
        totalCopies: 3,
        available: 2,
        isActive: true
      }
    });

    await prisma.libraryItem.upsert({
      where: { id: 2 },
      update: {},
      create: {
        title: 'Advanced Algorithms',
        author: 'Jane Doe',
        isbn: '978-0987654321',
        type: 'BOOK',
        category: 'Computer Science',
        description: 'Deep dive into advanced algorithmic concepts.',
        copies: 2,
        totalCopies: 2,
        available: 1,
        isActive: true
      }
    });

    await prisma.libraryItem.upsert({
      where: { id: 3 },
      update: {},
      create: {
        title: 'Business Management Principles',
        author: 'Michael Johnson',
        isbn: '978-1234567890',
        type: 'BOOK',
        category: 'Business',
        description: 'Essential principles of modern business management.',
        copies: 4,
        totalCopies: 4,
        available: 3,
        isActive: true
      }
    });

    await prisma.libraryItem.upsert({
      where: { id: 4 },
      update: {},
      create: {
        title: 'IEEE Computer Science Journal',
        author: 'IEEE',
        type: 'JOURNAL',
        category: 'Academic Journal',
        description: 'Monthly journal covering latest research in computer science.',
        copies: 12,
        totalCopies: 12,
        available: 10,
        isActive: true
      }
    });

    await prisma.libraryItem.upsert({
      where: { id: 5 },
      update: {},
      create: {
        title: 'Programming Language Reference Manual',
        author: 'Tech Publications',
        type: 'MANUAL',
        category: 'Technical Reference',
        description: 'Complete reference manual for modern programming languages.',
        copies: 5,
        totalCopies: 5,
        available: 4,
        isActive: true
      }
    });

    // 3. Library Borrowings
    console.log('Creating library borrowings...');
    
    const today = new Date();
    const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const twoWeeksFromNow = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    await prisma.libraryBorrowing.upsert({
      where: { id: 1 },
      update: {},
      create: {
        libraryItemId: 1,
        studentId: student1.id,
        borrowedAt: today,
        dueDate: twoWeeksFromNow,
        notes: 'Required for CS101 course',
        status: 'BORROWED'
      }
    });

    await prisma.libraryBorrowing.upsert({
      where: { id: 2 },
      update: {},
      create: {
        libraryItemId: 2,
        studentId: student2.id,
        borrowedAt: today,
        dueDate: oneWeekFromNow,
        notes: 'Research material for final project',
        status: 'BORROWED'
      }
    });

    await prisma.libraryBorrowing.upsert({
      where: { id: 3 },
      update: {},
      create: {
        libraryItemId: 3,
        studentId: student1.id,
        borrowedAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        dueDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        returnedAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        notes: 'Business course requirement',
        status: 'RETURNED'
      }
    });

    // 4. Inventory Items
    console.log('Creating inventory items...');
    
    await prisma.inventoryItem.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Laptop - Dell Latitude 5520',
        description: 'Business laptop for student use, Intel i5, 8GB RAM, 256GB SSD',
        category: 'ELECTRONICS',
        quantity: 15,
        minStock: 3,
        unit: 'piece',
        isActive: true
      }
    });

    await prisma.inventoryItem.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Wireless Mouse',
        description: 'Logitech wireless optical mouse',
        category: 'COMPUTER_ACCESSORIES',
        quantity: 25,
        minStock: 5,
        unit: 'piece',
        isActive: true
      }
    });

    await prisma.inventoryItem.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Notebook - A4 Lined',
        description: 'Standard A4 lined notebooks for student use',
        category: 'STATIONERY',
        quantity: 100,
        minStock: 20,
        unit: 'piece',
        isActive: true
      }
    });

    await prisma.inventoryItem.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: 'Projector - Epson EB-X41',
        description: 'Classroom projector for presentations',
        category: 'EQUIPMENT',
        quantity: 8,
        minStock: 2,
        unit: 'piece',
        isActive: true
      }
    });

    await prisma.inventoryItem.upsert({
      where: { id: 5 },
      update: {},
      create: {
        name: 'Whiteboard Markers',
        description: 'Set of colored whiteboard markers',
        category: 'OFFICE_SUPPLIES',
        quantity: 50,
        minStock: 10,
        unit: 'set',
        isActive: true
      }
    });

    await prisma.inventoryItem.upsert({
      where: { id: 6 },
      update: {},
      create: {
        name: 'Cleaning Supplies Kit',
        description: 'Basic cleaning supplies for classroom maintenance',
        category: 'CLEANING_SUPPLIES',
        quantity: 30,
        minStock: 5,
        unit: 'kit',
        isActive: true
      }
    });

    // 5. Inventory Issuances
    console.log('Creating inventory issuances...');
    
    await prisma.inventoryIssuance.upsert({
      where: { id: 1 },
      update: {},
      create: {
        inventoryItemId: 1,
        studentId: student1.id,
        quantity: 1,
        quantityIssued: 1,
        issuedAt: today,
        notes: 'Laptop for semester project work',
        issuedBy: staffUser.id,
        isActive: true
      }
    });

    await prisma.inventoryIssuance.upsert({
      where: { id: 2 },
      update: {},
      create: {
        inventoryItemId: 2,
        studentId: student2.id,
        quantity: 1,
        quantityIssued: 1,
        issuedAt: today,
        notes: 'Mouse for laptop use',
        issuedBy: staffUser.id,
        isActive: true
      }
    });

    await prisma.inventoryIssuance.upsert({
      where: { id: 3 },
      update: {},
      create: {
        inventoryItemId: 3,
        studentId: student1.id,
        quantity: 5,
        quantityIssued: 5,
        issuedAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        returnedAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        notes: 'Notebooks for coursework',
        returnNotes: 'All notebooks returned in good condition',
        issuedBy: staffUser.id,
        isActive: true
      }
    });

    // 6. Inventory Requests
    console.log('Creating inventory requests...');
    
    await prisma.inventoryRequest.upsert({
      where: { id: 1 },
      update: {},
      create: {
        inventoryItemId: 4,
        requesterId: student2.id,
        quantity: 1,
        quantityRequested: 1,
        status: 'PENDING',
        notes: 'Need projector for presentation next week',
        reason: 'Academic presentation requirement'
      }
    });

    await prisma.inventoryRequest.upsert({
      where: { id: 2 },
      update: {},
      create: {
        inventoryItemId: 5,
        requesterId: student1.id,
        approverId: staffUser.id,
        quantity: 2,
        quantityRequested: 2,
        status: 'APPROVED',
        notes: 'Whiteboard markers for group project',
        reason: 'Group project presentation materials'
      }
    });

    await prisma.inventoryRequest.upsert({
      where: { id: 3 },
      update: {},
      create: {
        inventoryItemId: 1,
        requesterId: student2.id,
        approverId: staffUser.id,
        quantity: 1,
        quantityRequested: 1,
        status: 'COMPLETED',
        notes: 'Laptop for thesis work',
        reason: 'Final thesis preparation'
      }
    });

    console.log('Library & Inventory seed completed successfully!');
    
    return {
      users: 3,
      studentProfiles: 2,
      libraryItems: 5,
      libraryBorrowings: 3,
      inventoryItems: 6,
      inventoryIssuances: 3,
      inventoryRequests: 3
    };

  } catch (error) {
    console.error('Library & Inventory seed failed:', error);
    throw error;
  }
}

// Export for use in main seed file
export { seedLibraryInventoryData };

// Direct execution
if (require.main === module) {
  seedLibraryInventoryData()
    .then((result) => {
      console.log('Library & Inventory seed results:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Library & Inventory seed failed:', error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}
