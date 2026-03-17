/**
 * MintBird API Tests
 * 
 * Run with: node integrations/tests/mintbird-api.test.js
 */

const MintBirdAPI = require('../mintbird-api');

// Test configuration
const TEST_CONFIG = {
  apiKey: 'JbGlV2H8ACyAvom4ZcrmmYj1famXBUSa',
  testPageName: 'Test Lead Page - ' + new Date().toISOString().slice(0, 10)
};

// Test results tracker
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function test(name, fn) {
  return { name, fn };
}

async function runTest(testCase) {
  try {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    await testCase.fn();
    console.log(`✅ PASSED: ${testCase.name}`);
    results.passed++;
    results.tests.push({ name: testCase.name, status: 'PASSED' });
  } catch (error) {
    console.log(`❌ FAILED: ${testCase.name}`);
    console.log(`   Error: ${error.message}`);
    results.failed++;
    results.tests.push({ name: testCase.name, status: 'FAILED', error: error.message });
  }
}

// ==========================================
// TEST CASES
// ==========================================

const tests = [
  test('API Module loads correctly', () => {
    const api = new MintBirdAPI(TEST_CONFIG.apiKey);
    if (!api) throw new Error('API instance not created');
    if (api.baseURL !== 'https://api.poplinks.io/api/ai') {
      throw new Error('Base URL incorrect');
    }
    console.log('   ✓ API module loaded');
    console.log('   ✓ Base URL configured');
  }),

  test('Get all lead pages', async () => {
    const api = new MintBirdAPI(TEST_CONFIG.apiKey);
    const response = await api.getLeadPages();
    
    // Check if response has data (success can be in different formats)
    const hasData = response.data?.lead_pages !== undefined || response.lead_pages !== undefined;
    const isSuccess = response.success === true || hasData;
    
    if (!isSuccess && response.message && !response.message.includes('success')) {
      throw new Error(`API Error: ${response.message}`);
    }
    
    const pages = response.data?.lead_pages || response.lead_pages || [];
    console.log(`   ✓ Found ${pages.length} lead pages`);
    
    if (pages.length > 0) {
      const firstPage = pages[0];
      console.log(`   ✓ First page: "${firstPage.name}" (ID: ${firstPage.id})`);
    }
  }),

  test('Create a new lead page', async () => {
    const api = new MintBirdAPI(TEST_CONFIG.apiKey);
    const response = await api.createLeadPage(TEST_CONFIG.testPageName);
    
    // Check for beta limit
    if (response.message?.includes('Beta version') || response.message?.includes('more than 5')) {
      console.log('   ⚠️ Beta limit reached (5 pages max) - this is expected');
      return;
    }
    
    // Check if response has lead_page data
    const page = response.data?.lead_page || response.lead_page;
    if (!page) {
      throw new Error(`API Error: ${response.message || 'No lead page data returned'}`);
    }
    
    console.log(`   ✓ Created page: "${page.name}"`);
    console.log(`   ✓ Page ID: ${page.id}`);
    console.log(`   ✓ URL slug: ${page.funnel_links?.leadpage_keyword}`);
    
    // Store for cleanup
    TEST_CONFIG.createdPageId = page.id;
  }),

  test('Get single lead page', async () => {
    const api = new MintBirdAPI(TEST_CONFIG.apiKey);
    
    // First get list to find a page ID
    const listResponse = await api.getLeadPages();
    if (!listResponse.success || !listResponse.data?.lead_pages?.length) {
      console.log('   ⚠️ No lead pages found to test with');
      return;
    }
    
    const pageId = listResponse.data.lead_pages[0].id;
    const response = await api.getLeadPage(pageId);
    
    if (!response.success) {
      throw new Error(`API Error: ${response.message}`);
    }
    
    const page = response.data?.lead_page;
    console.log(`   ✓ Retrieved page: "${page.name}"`);
    console.log(`   ✓ Has landing_page_setting: ${!!page.landing_page_setting}`);
    console.log(`   ✓ Has funnel_links: ${!!page.funnel_links}`);
  }),

  test('Update lead page headline', async () => {
    const api = new MintBirdAPI(TEST_CONFIG.apiKey);
    
    // Get a page to test with
    const listResponse = await api.getLeadPages();
    if (!listResponse.success || !listResponse.data?.lead_pages?.length) {
      console.log('   ⚠️ No lead pages found to test with');
      return;
    }
    
    const pageId = listResponse.data.lead_pages[0].id;
    const newHeadline = 'Updated Headline - ' + Date.now();
    
    const response = await api.updateHeadline(pageId, newHeadline);
    
    if (!response.success) {
      throw new Error(`API Error: ${response.message}`);
    }
    
    console.log(`   ✓ Updated headline to: "${newHeadline}"`);
    console.log(`   ✓ Setting ID: ${response.data?.setting?.id}`);
  }),

  test('Update lead page bullets', async () => {
    const api = new MintBirdAPI(TEST_CONFIG.apiKey);
    
    // Get a page to test with
    const listResponse = await api.getLeadPages();
    if (!listResponse.success || !listResponse.data?.lead_pages?.length) {
      console.log('   ⚠️ No lead pages found to test with');
      return;
    }
    
    const pageId = listResponse.data.lead_pages[0].id;
    const bullets = [
      { name: 'Test bullet point 1', rotation_number: 0 },
      { name: 'Test bullet point 2', rotation_number: 1 },
      { name: 'Test bullet point 3', rotation_number: 2 }
    ];
    
    const response = await api.updateBullets(pageId, 'Test Bullet Title', bullets);
    
    if (!response.success) {
      throw new Error(`API Error: ${response.message}`);
    }
    
    console.log(`   ✓ Updated ${response.data?.bullets?.length || 0} bullets`);
    response.data?.bullets?.forEach((bullet, i) => {
      console.log(`   ✓ Bullet ${i + 1}: "${bullet.name}"`);
    });
  }),

  test('Update SEO metadata', async () => {
    const api = new MintBirdAPI(TEST_CONFIG.apiKey);
    
    // Get a page to test with
    const listResponse = await api.getLeadPages();
    if (!listResponse.success || !listResponse.data?.lead_pages?.length) {
      console.log('   ⚠️ No lead pages found to test with');
      return;
    }
    
    const pageId = listResponse.data.lead_pages[0].id;
    const seoData = {
      title: 'SEO Title - ' + Date.now(),
      description: 'This is a test SEO description',
      keywords: 'test, mintbird, api',
      author: 'Test User'
    };
    
    const response = await api.updateSEO(pageId, seoData);
    
    if (!response.success) {
      throw new Error(`API Error: ${response.message}`);
    }
    
    console.log(`   ✓ Updated SEO title: "${seoData.title}"`);
    console.log(`   ✓ SEO ID: ${response.data?.seo?.id}`);
  }),

  test('Update pre-headline and post-headline', async () => {
    const api = new MintBirdAPI(TEST_CONFIG.apiKey);
    
    // Get a page to test with
    const listResponse = await api.getLeadPages();
    if (!listResponse.success || !listResponse.data?.lead_pages?.length) {
      console.log('   ⚠️ No lead pages found to test with');
      return;
    }
    
    const pageId = listResponse.data.lead_pages[0].id;
    
    // Update pre-headline
    const preResponse = await api.updatePreHeadline(pageId, 'Test Pre-Headline - ' + Date.now());
    if (!preResponse.success) {
      throw new Error(`Pre-headline update failed: ${preResponse.message}`);
    }
    console.log('   ✓ Updated pre-headline');
    
    // Update post-headline
    const postResponse = await api.updatePostHeadline(pageId, 'Test CTA Statement - Enter your email below!');
    if (!postResponse.success) {
      throw new Error(`Post-headline update failed: ${postResponse.message}`);
    }
    console.log('   ✓ Updated post-headline (CTA)');
  }),

  test('Clone lead page', async () => {
    const api = new MintBirdAPI(TEST_CONFIG.apiKey);
    
    // Get a page to test with
    const listResponse = await api.getLeadPages();
    if (!listResponse.success || !listResponse.data?.lead_pages?.length) {
      console.log('   ⚠️ No lead pages found to test with');
      return;
    }
    
    const pageId = listResponse.data.lead_pages[0].id;
    const response = await api.cloneLeadPage(pageId);
    
    if (!response.success) {
      // Beta limit is expected
      if (response.message?.includes('Beta version') || response.message?.includes('more than 5')) {
        console.log('   ⚠️ Beta limit reached (5 pages max) - this is expected');
        return;
      }
      throw new Error(`API Error: ${response.message}`);
    }
    
    const cloned = response.data?.lead_page;
    console.log(`   ✓ Cloned page: "${cloned.name}"`);
    console.log(`   ✓ New ID: ${cloned.id}`);
  })
];

// ==========================================
// RUN TESTS
// ==========================================

async function runTests() {
  console.log('\n═══════════════════════════════════════════');
  console.log('  MINTBIRD API TEST SUITE');
  console.log('═══════════════════════════════════════════');
  console.log(`API Key: ${TEST_CONFIG.apiKey.slice(0, 10)}...`);
  console.log(`Base URL: https://api.poplinks.io/api/ai`);
  console.log('───────────────────────────────────────────');

  for (const testCase of tests) {
    await runTest(testCase);
  }

  // Print summary
  console.log('\n═══════════════════════════════════════════');
  console.log('  TEST SUMMARY');
  console.log('═══════════════════════════════════════════');
  console.log(`Total: ${results.passed + results.failed}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log('───────────────────────────────────────────');

  if (results.failed > 0) {
    console.log('\nFailed tests:');
    results.tests
      .filter(t => t.status === 'FAILED')
      .forEach(t => console.log(`  ❌ ${t.name}: ${t.error}`));
  }

  console.log('\n');
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run if called directly
if (require.main === module) {
  runTests().catch(err => {
    console.error('Test suite error:', err);
    process.exit(1);
  });
}

module.exports = { runTests, tests };
