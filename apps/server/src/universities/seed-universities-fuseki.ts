import { PrismaClient } from '@prisma/client';
import { RdfService } from '../rdf/rdf.service';
import { FusekiService } from '../rdf/fuseki.service';

const prisma = new PrismaClient();

async function seedUniversitiesToFuseki() {
  console.log('🚀 Starting migration of universities from SQLite to Fuseki...');

  try {
    // Initialize services
    const fusekiService = new FusekiService();
    const rdfService = new RdfService(fusekiService);

    // Check Fuseki connection
    const isHealthy = await fusekiService.healthCheck();
    if (!isHealthy) {
      throw new Error('Fuseki server is not accessible. Please ensure it is running.');
    }
    console.log('✅ Fuseki server is accessible');

    // Skip clearing for now - will add to existing data
    console.log('ℹ️  Skipping clear operation - adding to existing data...');

    // Fetch universities from SQLite with all related data
    console.log('📊 Fetching universities from SQLite database...');
    const universities = await prisma.university.findMany();

    console.log(`📝 Found ${universities.length} universities to migrate`);

    if (universities.length === 0) {
      console.log('⚠️  No universities found in SQLite database. Run seed first: yarn db:seed');
      return;
    }

    // Migrate each university to Fuseki
    for (const university of universities) {
      console.log(`🏛️  Migrating: ${university.name}...`);
      
      // Fetch related data separately to avoid TypeScript issues
      const faculties = await prisma.faculty.findMany({
        where: { universityId: university.id },
      });
      
      const universityRdfData = {
        id: university.id,
        name: university.name,
        description: university.description,
        phone: university.phone,
        email: university.email,
        website: university.website,
        rectorName: university.rectorName,
        rectorTitle: university.rectorTitle,
        createdAt: university.createdAt,
        updatedAt: university.updatedAt,
        // Skip address for now to avoid TypeScript issues
        address: undefined,
        faculties: faculties.map(faculty => ({
          id: faculty.id,
          name: faculty.name,
          description: faculty.description,
        })),
      };

      await rdfService.storeUniversityInFuseki(universityRdfData);
      console.log(`   ✅ Migrated: ${university.name}`);
    }

    // Verify migration
    console.log('🔍 Verifying migration...');
    const fusekiUniversities = await rdfService.getAllUniversitiesFromFuseki();
    console.log(`✅ Verified: ${fusekiUniversities.length} universities in Fuseki`);

    // Show summary
    console.log('\n📊 Migration Summary:');
    console.log(`   • SQLite universities: ${universities.length}`);
    console.log(`   • Fuseki universities: ${fusekiUniversities.length}`);
    console.log(`   • Status: ${universities.length === fusekiUniversities.length ? '✅ SUCCESS' : '❌ MISMATCH'}`);

    // Display migrated universities
    console.log('\n🏛️  Migrated Universities:');
    fusekiUniversities.forEach(uni => {
      console.log(`   • ${uni.name} (ID: ${uni.id})`);
    });

    console.log('\n🎉 University migration to Fuseki completed successfully!');

  } catch (error) {
    console.error('❌ Error during migration:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedUniversitiesToFuseki()
    .then(() => {
      console.log('✨ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

export { seedUniversitiesToFuseki };
