/**
 * Letterman API Tests
 * 
 * Run with: node integrations/tests/letterman-api.test.js
 */

const LettermanAPI = require('../letterman-api');

// Test configuration
const TEST_CONFIG = {
  apiKey: '0f0a673396fac81d0149fac486adad8b82da3b928c0444b733a28daeb1443047',
  testArticleTitle: 'Test Article - ' + new Date().toISOString().slice(0, 10)
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
    const api = new LettermanAPI(TEST_CONFIG.apiKey);
    if (!api) throw new Error('API instance not created');
    if (api.baseURL !== 'https://api.letterman.ai/api/ai') {
      throw new Error('Base URL incorrect');
    }
    console.log('   ✓ API module loaded');
    console.log('   ✓ Base URL configured');
  }),

  test('Get current user', async () => {
    const api = new LettermanAPI(TEST_CONFIG.apiKey);
    const response = await api.getUser();
    
    if (!response.user) {
      throw new Error('User data not returned');
    }
    
    console.log(`   ✓ User: ${response.user.name} (${response.user.email})`);
    console.log(`   ✓ Role: ${response.user.role}`);
    console.log(`   ✓ Access Level: ${response.user.accessLevel}`);
    console.log(`   ✓ Available AI Models: ${response.availableAIModels?.join(', ')}`);
    
    // Store user ID for later tests
    TEST_CONFIG.userId = response.user.id;
  }),

  test('Get publications (newsletter storage)', async () => {
    const api = new LettermanAPI(TEST_CONFIG.apiKey);
    const response = await api.getPublications();
    
    if (!Array.isArray(response)) {
      throw new Error('Expected array of publications');
    }
    
    console.log(`   ✓ Found ${response.length} publications`);
    
    if (response.length > 0) {
      const pub = response[0];
      console.log(`   ✓ First publication: "${pub.name}"`);
      console.log(`   ✓ Type: ${pub.type}`);
      console.log(`   ✓ Status: ${pub.status ? 'Active' : 'Inactive'}`);
      
      // Store for article tests
      TEST_CONFIG.storageId = pub._id;
      TEST_CONFIG.publicationName = pub.name;
    } else {
      console.log('   ⚠️ No publications found - article tests will be skipped');
    }
  }),

  test('Get articles from publication', async () => {
    if (!TEST_CONFIG.storageId) {
      console.log('   ⚠️ Skipping - no publication available');
      return;
    }
    
    const api = new LettermanAPI(TEST_CONFIG.apiKey);
    const response = await api.getArticles(TEST_CONFIG.storageId);
    
    if (!Array.isArray(response)) {
      throw new Error('Expected array of articles');
    }
    
    console.log(`   ✓ Found ${response.length} articles`);
    
    if (response.length > 0) {
      const article = response[0];
      console.log(`   ✓ First article: "${article.title}"`);
      console.log(`   ✓ State: ${article.state}`);
      console.log(`   ✓ Word count: ${article.wordCount || 'N/A'}`);
      
      // Store for get article test
      TEST_CONFIG.articleId = article._id;
    }
  }),

  test('Get specific article', async () => {
    if (!TEST_CONFIG.articleId) {
      console.log('   ⚠️ Skipping - no article available');
      return;
    }
    
    const api = new LettermanAPI(TEST_CONFIG.apiKey);
    const response = await api.getArticle(TEST_CONFIG.articleId);
    
    if (!response._id) {
      throw new Error('Article data not returned');
    }
    
    console.log(`   ✓ Retrieved article: "${response.title}"`);
    console.log(`   ✓ State: ${response.state}`);
    console.log(`   ✓ URL: ${response.fullUrl || 'N/A'}`);
    
    if (response.summary) {
      console.log(`   ✓ Has summary: ${response.summary.title}`);
    }
  }),

  test('Create article with EXACT content (keepOriginal)', async () => {
    if (!TEST_CONFIG.storageId) {
      console.log('   ⚠️ Skipping - no publication available');
      return;
    }
    
    const api = new LettermanAPI(TEST_CONFIG.apiKey);
    const articleData = {
      headline: TEST_CONFIG.testArticleTitle,
      subHeadline: 'This is a test article created via API - exact content mode',
      content: `
        <h1>${TEST_CONFIG.testArticleTitle}</h1>
        <p>This is test content created via the Letterman API.</p>
        <p><strong>Features tested:</strong></p>
        <ul>
          <li>Exact content preservation</li>
          <li>No AI processing</li>
          <li>HTML content support</li>
        </ul>
        <p>This content should appear exactly as written.</p>
      `,
      keywords: ['test', 'api', 'letterman', 'automation'],
      summary: {
        title: 'Test Article Summary',
        description: 'A test article to verify API integration',
        content: '<p>This is the summary content for the test article.</p>'
      }
    };
    
    const response = await api.createArticleExact(TEST_CONFIG.storageId, articleData);
    
    if (!response._id) {
      throw new Error(`Article creation failed: ${JSON.stringify(response)}`);
    }
    
    console.log(`   ✓ Created article: "${response.title}"`);
    console.log(`   ✓ Article ID: ${response._id}`);
    console.log(`   ✓ State: ${response.state}`);
    console.log(`   ✓ URL Path: ${response.urlPath}`);
    
    // Store for update test
    TEST_CONFIG.createdArticleId = response._id;
  }),

  test('Update article', async () => {
    if (!TEST_CONFIG.createdArticleId) {
      console.log('   ⚠️ Skipping - no article created');
      return;
    }
    
    const api = new LettermanAPI(TEST_CONFIG.apiKey);
    const updates = {
      title: TEST_CONFIG.testArticleTitle + ' - UPDATED',
      description: 'Updated description via API test'
    };
    
    const response = await api.updateArticle(TEST_CONFIG.createdArticleId, updates);
    
    if (!response._id) {
      throw new Error(`Article update failed: ${JSON.stringify(response)}`);
    }
    
    console.log(`   ✓ Updated article title: "${response.title}"`);
    console.log(`   ✓ Updated description: "${response.description}"`);
  }),

  test('Update article SEO', async () => {
    if (!TEST_CONFIG.createdArticleId) {
      console.log('   ⚠️ Skipping - no article created');
      return;
    }
    
    const api = new LettermanAPI(TEST_CONFIG.apiKey);
    const seoData = {
      title: 'SEO Title - ' + Date.now(),
      description: 'SEO description for test article',
      keywords: ['seo', 'test', 'letterman']
    };
    
    const response = await api.updateArticleSEO(TEST_CONFIG.createdArticleId, seoData);
    
    if (!response._id) {
      throw new Error(`SEO update failed: ${JSON.stringify(response)}`);
    }
    
    console.log(`   ✓ Updated SEO title: "${seoData.title}"`);
    console.log(`   ✓ Keywords: ${seoData.keywords.join(', ')}`);
  }),

  test('Create article from content (AI-processed)', async () => {
    if (!TEST_CONFIG.storageId) {
      console.log('   ⚠️ Skipping - no publication available');
      return;
    }
    
    const api = new LettermanAPI(TEST_CONFIG.apiKey);
    const content = `
      Artificial intelligence is transforming how we work and live. 
      From automated customer service to content creation, AI tools are becoming essential.
      This article explores practical ways to leverage AI for business growth.
    `;
    
    const response = await api.createArticleFromContent(
      TEST_CONFIG.storageId,
      content,
      300, // word count
      'AI, automation, business',
      'OPEN_AI'
    );
    
    if (!response._id) {
      throw new Error(`Article creation failed: ${JSON.stringify(response)}`);
    }
    
    console.log(`   ✓ AI-processed article created: "${response.title}"`);
    console.log(`   ✓ Article ID: ${response._id}`);
    console.log(`   ✓ Description: ${response.description?.slice(0, 60)}...`);
  }),

  test('Get articles filtered by state', async () => {
    if (!TEST_CONFIG.storageId) {
      console.log('   ⚠️ Skipping - no publication available');
      return;
    }
    
    const api = new LettermanAPI(TEST_CONFIG.apiKey);
    
    // Get DRAFT articles
    const draftResponse = await api.getArticles(TEST_CONFIG.storageId, 'DRAFT');
    console.log(`   ✓ Found ${draftResponse.length} DRAFT articles`);
    
    // Get PUBLISHED articles
    const publishedResponse = await api.getArticles(TEST_CONFIG.storageId, 'PUBLISHED');
    console.log(`   ✓ Found ${publishedResponse.length} PUBLISHED articles`);
  })
];

// ==========================================
// RUN TESTS
// ==========================================

async function runTests() {
  console.log('\n═══════════════════════════════════════════');
  console.log('  LETTERMAN API TEST SUITE');
  console.log('═══════════════════════════════════════════');
  console.log(`API Key: ${TEST_CONFIG.apiKey.slice(0, 15)}...`);
  console.log(`Base URL: https://api.letterman.ai/api/ai`);
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
