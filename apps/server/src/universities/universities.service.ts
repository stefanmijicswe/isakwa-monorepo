import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RdfService } from '../rdf/rdf.service';

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
  constructor(
    private prisma: PrismaService,
    private rdfService: RdfService,
  ) {}

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
    try {
      // Read from Fuseki server instead of SQLite
      return await this.rdfService.getAllUniversitiesFromFuseki();
    } catch (error) {
      // Fallback to SQLite if Fuseki is not available
      console.warn('Fuseki not available, falling back to SQLite:', error.message);
      return this.prisma.university.findMany({
        include: {
          address: true,
          faculties: true,
        },
      });
    }
  }

  async findOne(id: number) {
    try {
      // Read from Fuseki server instead of SQLite
      const university = await this.rdfService.getUniversityByIdFromFuseki(id);
      
      if (!university) {
        throw new NotFoundException(`Univerzitet sa ID ${id} nije pronađen`);
      }

      return university;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      // Fallback to SQLite if Fuseki is not available
      console.warn('Fuseki not available, falling back to SQLite:', error.message);
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
  }

  async getMainUniversity() {
    try {
      // Try to get from Fuseki first
      const university = await this.rdfService.getUniversityByIdFromFuseki(1);
      if (university) {
        return university;
      }
    } catch (error) {
      console.warn('Fuseki not available for main university, falling back to SQLite:', error.message);
    }

    // Fallback to SQLite
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
    try {
      // Try to get from Fuseki with faculties
      const universitiesWithFaculties = await this.rdfService.getUniversitiesWithFacultiesFromFuseki();
      const university = universitiesWithFaculties.find(uni => uni.id === id);
      
      if (university) {
        return university;
      }
    } catch (error) {
      console.warn('Fuseki not available for university with faculties, falling back to SQLite:', error.message);
    }

    // Fallback to SQLite
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
