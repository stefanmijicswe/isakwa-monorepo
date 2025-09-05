import { FusekiService } from './fuseki.service';

async function testFusekiConnection() {
  console.log('🧪 Testing Fuseki connection...');

  try {
    const fusekiService = new FusekiService();

    // Test health check
    console.log('Testing health check...');
    const isHealthy = await fusekiService.healthCheck();
    console.log(`   Health check: ${isHealthy ? 'OK' : 'FAILED'}`);

    if (!isHealthy) {
      console.log('Fuseki server is not accessible');
      return;
    }

    // Test simple query
    console.log('Testing simple query...');
    try {
      const testQuery = `
        SELECT (COUNT(*) as ?count) WHERE {
          ?s ?p ?o .
        }
      `;
      const results = await fusekiService.query(testQuery);
      console.log(`   Query result: ${results.length > 0 ? 'OK' : 'Empty results'}`);
      if (results.length > 0) {
        console.log(`   Triple count: ${results[0]?.count?.value || 'unknown'}`);
      }
    } catch (error) {
      console.log(`   Query test: FAILED - ${error.message}`);
    }

    // Test simple update
    console.log('Testing simple update...');
    try {
      const testUpdate = `
        PREFIX test: <http://test.example/>
        INSERT DATA {
          test:subject test:predicate "test value" .
        }
      `;
      await fusekiService.update(testUpdate);
      console.log('   Update test: OK');

      // Verify the insert worked
      const verifyQuery = `
        PREFIX test: <http://test.example/>
        SELECT ?o WHERE {
          test:subject test:predicate ?o .
        }
      `;
      const verifyResults = await fusekiService.query(verifyQuery);
      console.log(`Verification: ${verifyResults.length > 0 ? 'Data inserted' : 'No data found'}`);

    } catch (error) {
      console.log(`Update test:  FAILED - ${error.message}`);
    }

    console.log('Connection test completed!');

  } catch (error) {
    console.error('Error during connection test:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  testFusekiConnection()
    .then(() => {
      console.log('Test completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}

export { testFusekiConnection };
