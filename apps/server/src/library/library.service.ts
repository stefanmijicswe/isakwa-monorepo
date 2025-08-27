import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLibraryItemDto, UpdateLibraryItemDto, BorrowItemDto, ReturnItemDto } from './dto';

enum BorrowingStatus {
  BORROWED = 'BORROWED',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
}


@Injectable()
export class LibraryService {
  constructor(private prisma: PrismaService) {}

  // Library Items Management
  async createLibraryItem(data: CreateLibraryItemDto) {
    return this.prisma.libraryItem.create({
      data: {
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        type: data.type,
        category: data.category,
        description: data.description,
        totalCopies: data.totalCopies || 1,
      },
    });
  }

  async findAllLibraryItems(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [items, total] = await Promise.all([
      this.prisma.libraryItem.findMany({
        where: { isActive: true },
        skip,
        take: limit,
        include: {
                     borrowings: {
             where: { isActive: true },
             include: {
               student: {
                 include: {
                   user: { select: { firstName: true, lastName: true } },
                 },
               },
             },
           },
           _count: {
             select: {
               borrowings: {
                 where: { isActive: true },
               },
             },
           },
        },
        orderBy: { title: 'asc' },
      }),
      this.prisma.libraryItem.count({ where: { isActive: true } }),
    ]);

    // Calculate available copies
    const itemsWithAvailability = items.map(item => ({
      ...item,
      availableCopies: item.totalCopies - item._count.borrowings,
    }));

    return {
      data: itemsWithAvailability,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findLibraryItemById(id: number) {
    const item = await this.prisma.libraryItem.findUnique({
      where: { id },
      include: {
        borrowings: {
          include: {
            student: {
              include: {
                user: { select: { firstName: true, lastName: true, email: true } },
              },
            },
          },
          orderBy: { borrowedAt: 'desc' },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Library item with ID ${id} not found`);
    }

    return item;
  }

  async updateLibraryItem(id: number, data: UpdateLibraryItemDto) {
    await this.findLibraryItemById(id);

    return this.prisma.libraryItem.update({
      where: { id },
      data,
    });
  }

  async deleteLibraryItem(id: number) {
    await this.findLibraryItemById(id);

         // Check if item has active borrowings
     const activeBorrowings = await this.prisma.libraryBorrowing.count({
       where: {
         libraryItemId: id,
         isActive: true,
       },
     });

    if (activeBorrowings > 0) {
      throw new BadRequestException('Cannot delete item with active borrowings');
    }

    return this.prisma.libraryItem.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Borrowing Management
  async borrowItem(data: BorrowItemDto) {
    // Check if library item exists and is available
    const libraryItem = await this.prisma.libraryItem.findUnique({
      where: { id: data.libraryItemId },
      include: {
        _count: {
          select: {
            borrowings: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    if (!libraryItem || !libraryItem.isActive) {
      throw new NotFoundException('Library item not found or inactive');
    }

    if (libraryItem._count.borrowings >= libraryItem.totalCopies) {
      throw new BadRequestException('No copies available for borrowing');
    }

    // Check if student exists
    const student = await this.prisma.studentProfile.findUnique({
      where: { userId: data.studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

         // Check if student already has this item borrowed
     const existingBorrowing = await this.prisma.libraryBorrowing.findFirst({
       where: {
         studentId: student.id, // Use student.id (StudentProfile.id), not data.studentId (User.id)
         libraryItemId: data.libraryItemId,
         isActive: true,
       },
     });

    if (existingBorrowing) {
      throw new BadRequestException('Student already has this item borrowed');
    }

    return this.prisma.libraryBorrowing.create({
      data: {
        studentId: student.id, // Use student.id (StudentProfile.id), not data.studentId (User.id)
        libraryItemId: data.libraryItemId,
        dueDate: new Date(data.dueDate),
        notes: data.notes,
      },
      include: {
        student: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        },
        libraryItem: {
          select: { title: true, author: true, type: true },
        },
      },
    });
  }

  async returnItem(borrowingId: number, data: ReturnItemDto) {
    const borrowing = await this.prisma.libraryBorrowing.findUnique({
      where: { id: borrowingId },
      include: {
        libraryItem: { select: { title: true } },
        student: {
          include: {
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!borrowing) {
      throw new NotFoundException('Borrowing record not found');
    }

    if (!borrowing.isActive) {
      throw new BadRequestException('Item already returned');
    }

    return this.prisma.libraryBorrowing.update({
      where: { id: borrowingId },
      data: {
        returnedAt: new Date(),
        isActive: false,
        notes: data.notes || null,
      },
      include: {
        student: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        },
        libraryItem: {
          select: { title: true, author: true, type: true },
        },
      },
    });
  }

  async getStudentBorrowings(studentId: number) {
    return this.prisma.libraryBorrowing.findMany({
      where: { studentId },
      include: {
        libraryItem: {
          select: { title: true, author: true, type: true, isbn: true },
        },
      },
      orderBy: { borrowedAt: 'desc' },
    });
  }

     async getOverdueItems() {
     const now = new Date();
     
     return this.prisma.libraryBorrowing.findMany({
       where: {
         isActive: true,
         dueDate: { lt: now },
       },
      include: {
        student: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        },
        libraryItem: {
          select: { title: true, author: true, type: true },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async getAllBorrowings() {
    return this.prisma.libraryBorrowing.findMany({
      where: {}, // No filter - get ALL borrowings (active and returned)
      include: {
        student: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        },
        libraryItem: {
          select: { title: true, author: true, type: true },
        },
      },
      orderBy: { borrowedAt: 'desc' },
    });
  }

  async searchLibraryItems(query: string) {
    return this.prisma.libraryItem.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: query } },
          { author: { contains: query } },
          { isbn: { contains: query } },
          { category: { contains: query } },
        ],
      },
      include: {
        _count: {
          select: {
            borrowings: {
              where: { status: BorrowingStatus.BORROWED },
            },
          },
        },
      },
    });
  }
}
