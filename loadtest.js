import('loadtest').then((module) => {
    const loadtest = module.default;
  
    const loadBalancers = [
      {
        name: 'Load Balancer',
        url: 'http://joexsparta.social/api/loadtest' 
      }
    ];
  
    const options = {
      maxRequests: 1000,
      concurrency: 50,
      method: 'GET',
      contentType: 'application/json',
      body: JSON.stringify({}),
    };
  
    function printResult(balancerName, error, result) {
      if (error) {
        console.error(`Error during load test for ${balancerName}:`, error);
      } else {
        console.log(`\n=== Load Test Results for ${balancerName} ===`);
        console.log('Total Requests :', result.totalRequests);
        console.log('Total Errors  :', result.totalErrors);
        console.log('Total Time    :', result.totalTimeSeconds, 'seconds');
        console.log('Requests/sec  :', result.rps);
        console.log('Mean Latency  :', result.meanLatencyMs, 'ms');
        console.log('Max Latency   :', result.maxLatencyMs, 'ms');
        console.log('Min Latency   :', result.minLatencyMs, 'ms');
        console.log('======================\n');
      }
    }
  
    async function runTests() {
      for (const balancer of loadBalancers) {
        console.log(`Starting load test for ${balancer.name}...`);
        const testOptions = { ...options, url: balancer.url };
        
        try {
          await new Promise((resolve, reject) => {
            loadtest.loadTest(testOptions, (error, result) => {
              printResult(balancer.name, error, result);
              if (error) reject(error);
              else resolve(result);
            });
          });
        } catch (error) {
          console.error(`Failed to test ${balancer.name}:`, error);
        }
        
        // Wait between tests
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  
    console.log('Starting load tests for all load balancers...');
    runTests().then(() => console.log('All tests completed'));
  }); 
  