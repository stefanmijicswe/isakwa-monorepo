import { FusekiService } from './fuseki.service';

async function setupFusekiDataset() {
  console.log('🔧 Setting up Fuseki dataset for universities...');

  try {
    const fusekiService = new FusekiService();

    // Check if Fuseki is accessible
    const isHealthy = await fusekiService.healthCheck();
    if (!isHealthy) {
      throw new Error('Fuseki server is not accessible. Please ensure it is running.');
    }
    console.log('✅ Fuseki server is accessible');

    // Create the universities dataset using curl to admin API
    console.log('📝 Creating universities dataset...');
    
    // Create dataset via Fuseki admin interface
    const createDatasetUrl = 'http://localhost:3030/$/datasets';
    const response = await fetch(createDatasetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'dbName=universities&dbType=tdb2',
    });

    if (response.ok) {
      console.log('✅ Universities dataset created successfully');
    } else if (response.status === 409) {
      console.log('ℹ️  Universities dataset already exists');
    } else {
      const errorText = await response.text();
      throw new Error(`Failed to create dataset: ${response.status} - ${errorText}`);
    }

    // Test the dataset
    console.log('🧪 Testing dataset...');
    const testQuery = `
      SELECT (COUNT(*) as ?count) WHERE {
        ?s ?p ?o .
      }
    `;
    
    try {
      const results = await fusekiService.query(testQuery);
      console.log('✅ Dataset is working, count:', results[0]?.count?.value || '0');
    } catch (error) {
      console.log('⚠️  Dataset query test failed:', error.message);
    }

    console.log('🎉 Fuseki setup completed successfully!');

  } catch (error) {
    console.error('❌ Error during Fuseki setup:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  setupFusekiDataset()
    .then(() => {
      console.log('✨ Setup script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Setup script failed:', error);
      process.exit(1);
    });
}

export { setupFusekiDataset };
