import { PrismaService } from '../prisma/prisma.service';
import { InventoryCategory } from '@prisma/client';

export async function seedInventory(prisma: PrismaService) {
  console.log('Seeding inventory...');

  const inventoryItems = [
    {
      name: 'Olovke',
      category: InventoryCategory.STATIONERY,
      description: 'Grafitne olovke HB',
      quantity: 100,
      unit: 'kom',
      minStock: 20,
    },
    {
      name: 'Papir A4',
      category: InventoryCategory.OFFICE_SUPPLIES,
      description: 'Beli papir A4 80g',
      quantity: 50,
      unit: 'paketa',
      minStock: 10,
    },
    {
      name: 'Markeri za tablu',
      category: InventoryCategory.OFFICE_SUPPLIES,
      description: 'Markeri različitih boja',
      quantity: 15,
      unit: 'kom',
      minStock: 5,
    },
    {
      name: 'Sredstvo za čišćenje',
      category: InventoryCategory.CLEANING_SUPPLIES,
      description: 'Univerzalno sredstvo za čišćenje',
      quantity: 8,
      unit: 'litar',
      minStock: 2,
    },
    {
      name: 'USB memorije',
      category: InventoryCategory.COMPUTER_ACCESSORIES,
      description: 'USB 3.0 16GB',
      quantity: 20,
      unit: 'kom',
      minStock: 5,
    },
    {
      name: 'Stolice',
      category: InventoryCategory.FURNITURE,
      description: 'Kancelarijske stolice',
      quantity: 5,
      unit: 'kom',
      minStock: 2,
    },
    {
      name: 'Hemijske olovke',
      category: InventoryCategory.STATIONERY,
      description: 'Plave hemijske olovke',
      quantity: 75,
      unit: 'kom',
      minStock: 15,
    },
    {
      name: 'Fotokopir papir',
      category: InventoryCategory.OFFICE_SUPPLIES,
      description: 'Papir za fotokopiranje A4',
      quantity: 30,
      unit: 'paketa',
      minStock: 8,
    },
    {
      name: 'Tastature',
      category: InventoryCategory.COMPUTER_ACCESSORIES,
      description: 'USB tastature',
      quantity: 12,
      unit: 'kom',
      minStock: 3,
    },
    {
      name: 'Miševi',
      category: InventoryCategory.COMPUTER_ACCESSORIES,
      description: 'Optički miševi',
      quantity: 18,
      unit: 'kom',
      minStock: 4,
    },
  ];

  for (const item of inventoryItems) {
    await prisma.inventoryItem.create({
      data: item,
    });
    console.log(`Created inventory item: ${item.name}`);
  }

  console.log('Inventory seeding completed!');
}
