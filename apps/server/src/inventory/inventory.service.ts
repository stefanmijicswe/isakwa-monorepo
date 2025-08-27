import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateInventoryItemDto, 
  UpdateInventoryItemDto, 
  CreateInventoryRequestDto, 
  UpdateInventoryRequestDto,
  CreateInventoryIssuanceDto
} from './dto';
import { InventoryRequestStatus } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // Inventory Items Management
  async createInventoryItem(data: CreateInventoryItemDto) {
    return this.prisma.inventoryItem.create({
      data: {
        name: data.name,
        category: data.category,
        description: data.description,
        quantity: data.quantity,
        unit: data.unit,
        minStock: data.minStock || 0,
      },
    });
  }

  async findAllInventoryItems(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [items, total] = await Promise.all([
      this.prisma.inventoryItem.findMany({
        where: { isActive: true },
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              requests: {
                where: { 
                  status: { in: [InventoryRequestStatus.PENDING, InventoryRequestStatus.APPROVED] }
                },
              },
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.inventoryItem.count({ where: { isActive: true } }),
    ]);

    // Mark items with low stock
    const itemsWithStatus = items.map(item => ({
      ...item,
      isLowStock: item.quantity <= item.minStock,
      hasPendingRequests: item._count.requests > 0,
    }));

    return {
      data: itemsWithStatus,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findInventoryItemById(id: number) {
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id },
      include: {
        requests: {
          include: {
            requester: {
              select: { firstName: true, lastName: true, email: true, role: true },
            },
            approver: {
              select: { firstName: true, lastName: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }

    return item;
  }

  async updateInventoryItem(id: number, data: UpdateInventoryItemDto) {
    await this.findInventoryItemById(id);

    return this.prisma.inventoryItem.update({
      where: { id },
      data,
    });
  }

  async deleteInventoryItem(id: number) {
    await this.findInventoryItemById(id);

    // Check if item has pending requests
    const pendingRequests = await this.prisma.inventoryRequest.count({
      where: {
        inventoryItemId: id,
        status: { in: [InventoryRequestStatus.PENDING, InventoryRequestStatus.APPROVED] },
      },
    });

    if (pendingRequests > 0) {
      throw new BadRequestException('Cannot delete item with pending requests');
    }

    return this.prisma.inventoryItem.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Inventory Issuance Management
  async createInventoryIssuance(issuedBy: number, data: CreateInventoryIssuanceDto) {
    // Check if inventory item exists and has enough quantity
    const inventoryItem = await this.prisma.inventoryItem.findUnique({
      where: { id: data.inventoryItemId },
    });

    if (!inventoryItem || !inventoryItem.isActive) {
      throw new NotFoundException('Inventory item not found or inactive');
    }

    if (data.quantityIssued > inventoryItem.quantity) {
      throw new BadRequestException(
        `Cannot issue ${data.quantityIssued} items. Only ${inventoryItem.quantity} available.`
      );
    }

    // Check if student exists
    const student = await this.prisma.studentProfile.findUnique({
      where: { userId: data.studentId },
    });

    if (!student || student.status !== 'ACTIVE') {
      throw new NotFoundException('Student not found or inactive');
    }

    // Create issuance and update inventory quantity
    const [issuance] = await this.prisma.$transaction([
      this.prisma.inventoryIssuance.create({
        data: {
          inventoryItemId: data.inventoryItemId,
          studentId: student.id, // Use student.id (StudentProfile.id), not data.studentId (User.id)
          quantityIssued: data.quantityIssued,
          issuedBy: issuedBy,
          notes: data.notes,
        },
        include: {
          inventoryItem: true,
          student: {
            include: {
              user: true,
            },
          },
          issuedByUser: true,
        },
      }),
      this.prisma.inventoryItem.update({
        where: { id: data.inventoryItemId },
        data: {
          quantity: {
            decrement: data.quantityIssued,
          },
        },
      }),
    ]);

    return issuance;
  }

  async findAllInventoryIssuances(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where = { isActive: true };

    const [issuances, total] = await Promise.all([
      this.prisma.inventoryIssuance.findMany({
        where,
        skip,
        take: limit,
        orderBy: { issuedAt: 'desc' },
        include: {
          inventoryItem: true,
          student: {
            include: {
              user: true,
            },
          },
          issuedByUser: true,
        },
      }),
      this.prisma.inventoryIssuance.count({ where }),
    ]);

    return {
      issuances,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllInventoryIssuancesAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [issuances, total] = await Promise.all([
      this.prisma.inventoryIssuance.findMany({
        skip,
        take: limit,
        orderBy: { issuedAt: 'desc' },
        include: {
          inventoryItem: true,
          student: {
            include: {
              user: true,
            },
          },
          issuedByUser: true,
        },
      }),
      this.prisma.inventoryIssuance.count({}),
    ]);

    return {
      issuances,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Inventory Requests Management
  async createInventoryRequest(requesterId: number, data: CreateInventoryRequestDto) {
    // Check if inventory item exists
    const inventoryItem = await this.prisma.inventoryItem.findUnique({
      where: { id: data.inventoryItemId },
    });

    if (!inventoryItem || !inventoryItem.isActive) {
      throw new NotFoundException('Inventory item not found or inactive');
    }

    // Check if requested quantity is reasonable (not more than current stock)
    if (data.quantityRequested > inventoryItem.quantity && inventoryItem.quantity > 0) {
      throw new BadRequestException(
        `Cannot request ${data.quantityRequested} items. Only ${inventoryItem.quantity} available.`
      );
    }

    return this.prisma.inventoryRequest.create({
      data: {
        requesterId,
        inventoryItemId: data.inventoryItemId,
        quantityRequested: data.quantityRequested,
        reason: data.reason,
      },
      include: {
        requester: {
          select: { firstName: true, lastName: true, email: true, role: true },
        },
        inventoryItem: {
          select: { name: true, category: true, unit: true },
        },
      },
    });
  }

  async findAllInventoryRequests(page = 1, limit = 10, status?: InventoryRequestStatus) {
    const skip = (page - 1) * limit;
    const where: any = { isActive: true };
    
    if (status) {
      where.status = status;
    }
    
    const [requests, total] = await Promise.all([
      this.prisma.inventoryRequest.findMany({
        where,
        skip,
        take: limit,
        include: {
          requester: {
            select: { firstName: true, lastName: true, email: true, role: true },
          },
          approver: {
            select: { firstName: true, lastName: true, email: true },
          },
          inventoryItem: {
            select: { name: true, category: true, unit: true, quantity: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.inventoryRequest.count({ where }),
    ]);

    return {
      data: requests,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateInventoryRequest(id: number, approverId: number, data: UpdateInventoryRequestDto) {
    const request = await this.prisma.inventoryRequest.findUnique({
      where: { id },
      include: {
        inventoryItem: true,
      },
    });

    if (!request) {
      throw new NotFoundException('Inventory request not found');
    }

    if (request.status !== InventoryRequestStatus.PENDING) {
      throw new BadRequestException('Only pending requests can be updated');
    }

    // If approving, check stock availability
    if (data.status === InventoryRequestStatus.APPROVED) {
      if (request.quantityRequested > request.inventoryItem.quantity) {
        throw new BadRequestException('Insufficient stock to approve this request');
      }
    }

    const updateData: any = {
      status: data.status,
      notes: data.notes,
      approvedBy: approverId,
      approvedAt: new Date(),
    };

    // If fulfilled, update inventory quantity and set fulfilled date
    if (data.status === InventoryRequestStatus.FULFILLED) {
      updateData.fulfilledAt = new Date();
      
      // Reduce inventory quantity
      await this.prisma.inventoryItem.update({
        where: { id: request.inventoryItemId },
        data: {
          quantity: {
            decrement: request.quantityRequested,
          },
        },
      });
    }

    return this.prisma.inventoryRequest.update({
      where: { id },
      data: updateData,
      include: {
        requester: {
          select: { firstName: true, lastName: true, email: true, role: true },
        },
        approver: {
          select: { firstName: true, lastName: true, email: true },
        },
        inventoryItem: {
          select: { name: true, category: true, unit: true },
        },
      },
    });
  }

  async getUserRequests(userId: number) {
    return this.prisma.inventoryRequest.findMany({
      where: { requesterId: userId },
      include: {
        inventoryItem: {
          select: { name: true, category: true, unit: true },
        },
        approver: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLowStockItems() {
    return this.prisma.inventoryItem.findMany({
      where: {
        isActive: true,
        quantity: { lte: this.prisma.inventoryItem.fields.minStock },
      },
      orderBy: { quantity: 'asc' },
    });
  }

  async searchInventoryItems(query: string) {
    return this.prisma.inventoryItem.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
      },
      include: {
        _count: {
          select: {
            requests: {
              where: { 
                status: { in: [InventoryRequestStatus.PENDING, InventoryRequestStatus.APPROVED] }
              },
            },
          },
        },
      },
    });
  }

  async markAsReturned(issuanceId: number, returnNotes?: string) {
    // Find the issuance
    const issuance = await this.prisma.inventoryIssuance.findUnique({
      where: { id: issuanceId },
      include: { inventoryItem: true },
    });

    if (!issuance) {
      throw new NotFoundException('Issuance not found');
    }

    if (!issuance.isActive) {
      throw new BadRequestException('Item has already been returned');
    }

    // Use transaction to ensure data consistency
    return this.prisma.$transaction(async (tx) => {
      // Mark issuance as inactive (returned)
      const updatedIssuance = await tx.inventoryIssuance.update({
        where: { id: issuanceId },
        data: {
          isActive: false,
          returnNotes,
          returnedAt: new Date(),
        },
      });

      // Increase inventory quantity
      await tx.inventoryItem.update({
        where: { id: issuance.inventoryItemId },
        data: {
          quantity: {
            increment: issuance.quantityIssued,
          },
        },
      });

      return updatedIssuance;
    });
  }
}
