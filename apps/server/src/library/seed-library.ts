import { PrismaService } from '../prisma/prisma.service';
import { LibraryItemType } from '@prisma/client';

export async function seedLibrary(prisma: PrismaService) {
  console.log('Seeding library...');

  const libraryItems = [
    {
      title: 'Uvod u programiranje',
      author: 'Petar Petrović',
      isbn: '978-86-123-4567-8',
      type: LibraryItemType.BOOK,
      category: 'Informatika',
      description: 'Osnove programiranja za početnike',
      totalCopies: 5,
    },
    {
      title: 'Algoritmi i strukture podataka',
      author: 'Marko Marković',
      isbn: '978-86-123-4568-9',
      type: LibraryItemType.BOOK,
      category: 'Informatika',
      description: 'Napredni algoritmi i strukture podataka',
      totalCopies: 3,
    },
    {
      title: 'Osnove baze podataka',
      author: 'Ana Anić',
      isbn: '978-86-123-4569-0',
      type: LibraryItemType.BOOK,
      category: 'Informatika',
      description: 'Relacione baze podataka',
      totalCopies: 4,
    },
    {
      title: 'Web dizajn i razvoj',
      author: 'Stefan Stefanović',
      isbn: '978-86-123-4570-6',
      type: LibraryItemType.BOOK,
      category: 'Web tehnologije',
      description: 'Moderne web tehnologije',
      totalCopies: 6,
    },
    {
      title: 'Računarski časopis',
      author: 'Redakcija',
      type: LibraryItemType.MAGAZINE,
      category: 'Periodična izdanja',
      description: 'Mesečni časopis o računarstvu',
      totalCopies: 10,
    },
    {
      title: 'Diplomski rad - AI u obrazovanju',
      author: 'Jovana Jovanović',
      type: LibraryItemType.THESIS,
      category: 'Diplomski radovi',
      description: 'Primena AI u obrazovnom sistemu',
      totalCopies: 1,
    },
    {
      title: 'Priručnik za C++ programiranje',
      author: 'Nikola Nikolić',
      isbn: '978-86-123-4571-3',
      type: LibraryItemType.MANUAL,
      category: 'Priručnici',
      description: 'Kompletni priručnik za C++',
      totalCopies: 3, // Increased from 2 to 3
    },
    {
      title: 'Časopis za poslovnu ekonomiju',
      author: 'Ekonomski fakultet',
      type: LibraryItemType.JOURNAL,
      category: 'Naučni časopisi',
      description: 'Kvartalni naučni časopis',
      totalCopies: 8,
    },
    {
      title: 'Python za početnike',
      author: 'Milan Milanović',
      isbn: '978-86-123-4572-4',
      type: LibraryItemType.BOOK,
      category: 'Informatika',
      description: 'Učenje Pythona od nule',
      totalCopies: 4,
    },
    {
      title: 'Machine Learning osnove',
      author: 'Jelena Jelenić',
      isbn: '978-86-123-4573-5',
      type: LibraryItemType.BOOK,
      category: 'AI/ML',
      description: 'Uvod u mašinsko učenje',
      totalCopies: 2,
    },
  ];

  for (const item of libraryItems) {
    await prisma.libraryItem.create({
      data: item,
    });
    console.log(`Created library item: ${item.title}`);
  }

  console.log('Library seeding completed!');
}
