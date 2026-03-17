/**
 * Test Runner for All Integrations
 * 
 * Run all tests: node integrations/tests/run-all-tests.js
 * Run MintBird only: node integrations/tests/run-all-tests.js --mintbird
 * Run Letterman only: node integrations/tests/run-all-tests.js --letterman
 */

const { runTests: runMintBirdTests } = require('./mintbird-api.test');
const { runTests: runLettermanTests } = require('./letterman-api.test');

const args = process.argv.slice(2);
const runMintbird = args.includes('--mintbird') || args.length === 0;
const runLetterman = args.includes('--letterman') || args.length === 0;

async function runAllTests() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║     TITANIUM SOFTWARE API TEST SUITE                  ║');
  console.log('║     MintBird + Letterman Integration Tests            ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  if (runMintbird) {
    console.log('\n┌────────────────────────────────────────────────────────┐');
    console.log('│ RUNNING MINTBIRD TESTS                                 │');
    console.log('└────────────────────────────────────────────────────────┘');
    await runMintBirdTests();
  }

  if (runLetterman) {
    console.log('\n┌────────────────────────────────────────────────────────┐');
    console.log('│ RUNNING LETTERMAN TESTS                                │');
    console.log('└────────────────────────────────────────────────────────┘');
    await runLettermanTests();
  }

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║     ALL TESTS COMPLETED                               ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
}

// Usage help
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node run-all-tests.js [options]

Options:
  --mintbird    Run only MintBird tests
  --letterman   Run only Letterman tests
  --help, -h    Show this help message

Examples:
  node run-all-tests.js              # Run all tests
  node run-all-tests.js --mintbird   # Run MintBird only
  node run-all-tests.js --letterman  # Run Letterman only
`);
  process.exit(0);
}

runAllTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
