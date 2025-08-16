import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateUniversityData {
  name: string;
  description?: string;
  addressId?: number;
  phone?: string;
  email?: string;
  website?: string;
  rectorName?: string;
  rectorTitle?: string;
}

export interface UpdateUniversityData {
  name?: string;
  description?: string;
  addressId?: number;
  phone?: string;
  email?: string;
  website?: string;
  rectorName?: string;
  rectorTitle?: string;
}

@Injectable()
export class UniversitiesService {
  constructor(private prisma: PrismaService) {}

  // Ova metoda je sada samo za administrativne potrebe/seeding
  async create(data: CreateUniversityData) {
    return this.prisma.university.create({
      data: {
        name: data.name,
        description: data.description,
        addressId: data.addressId,
        phone: data.phone,
        email: data.email,
        website: data.website,
        rectorName: data.rectorName,
        rectorTitle: data.rectorTitle,
      },
      include: {
        address: true,
        faculties: true,
      },
    });
  }

  async findAll() {
    return this.prisma.university.findMany({
      include: {
        address: true,
        faculties: true,
      },
    });
  }

  async findOne(id: number) {
    const university = await this.prisma.university.findUnique({
      where: { id },
      include: {
        address: true,
        faculties: {
          include: {
            studyPrograms: true,
          },
        },
      },
    });

    if (!university) {
      throw new NotFoundException(`Univerzitet sa ID ${id} nije pronađen`);
    }

    return university;
  }

  // Metoda za dobijanje glavnog univerziteta (pretpostavljamo da je uvek ID = 1)
  async getMainUniversity() {
    const mainUniversity = await this.prisma.university.findFirst({
      include: {
        address: true,
        faculties: {
          include: {
            studyPrograms: {
              include: {
                subjects: true,
              },
            },
          },
        },
      },
    });

    if (!mainUniversity) {
      throw new NotFoundException('Glavni univerzitet nije pronađen. Potrebno je kreiranje seed podataka.');
    }

    return mainUniversity;
  }

  async getUniversityWithFaculties(id: number) {
    const university = await this.prisma.university.findUnique({
      where: { id },
      include: {
        address: true,
        faculties: {
          include: {
            studyPrograms: {
              include: {
                subjects: true,
              },
            },
          },
        },
      },
    });

    if (!university) {
      throw new NotFoundException(`Univerzitet sa ID ${id} nije pronađen`);
    }

    return university;
  }
}
