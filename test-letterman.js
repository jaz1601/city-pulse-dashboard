const LettermanAPI = require('./integrations/letterman-api');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTA4N2UzYmRiZWQ3OWRkMGNkMWQ1MzMiLCJrZXkiOiJhNzUzZDU0YThkMjFhNzE3ZWMwODIzMjFlNjg3NWMwOSIsImlkIjoiNjliMWJmZGQ0Nzg3MmIyOGI0ZDlkZWZmIiwiaWF0IjoxNzczMjU2NjY5LCJleHAiOjE4MDQ3OTI2Njl9.cUVrfskWhm7Xav8qUAjRVM1-fWMdsSNmVKMZHiKkLGQ';

async function testLetterman() {
  console.log('🧪 Testing Letterman API...\n');
  
  const letterman = new LettermanAPI(API_KEY);
  
  try {
    // Step 1: Get user profile
    console.log('1️⃣ Getting user profile...');
    const user = await letterman.getUser();
    console.log('✅ User:', user.user?.name || user.user?.email || 'Unknown');
    console.log('   Access Level:', user.user?.accessLevel || 'N/A');
    console.log('');
    
    // Step 2: Get publications
    console.log('2️⃣ Getting publications...');
    const publications = await letterman.getPublications();
    
    if (!publications || publications.length === 0) {
      console.log('⚠️ No publications found. You need to create one in the Letterman dashboard first.');
      console.log('   Go to: https://letterman.ai/dashboard and create a newsletter/publication.');
      return;
    }
    
    console.log(`✅ Found ${publications.length} publication(s):`);
    publications.forEach((pub, i) => {
      console.log(`   ${i + 1}. ${pub.name} (ID: ${pub._id})`);
      console.log(`      Status: ${pub.status ? 'Active' : 'Inactive'}`);
      console.log(`      Articles: ${pub.articleCount?.PUBLISHED || 0} published, ${pub.articleCount?.DRAFT || 0} drafts`);
    });
    console.log('');
    
    // Use the first publication for testing
    const testPub = publications[0];
    console.log(`3️⃣ Using publication: "${testPub.name}"`);
    
    // Step 3: Create a test article with exact content (no AI processing)
    console.log('4️⃣ Creating test article...');
    const testArticle = await letterman.createArticleExact(testPub._id, {
      headline: 'Test Newsletter: Welcome to My Digital Income Journey',
      subHeadline: 'A behind-the-scenes look at building automated income streams for beginners',
      content: `
        <h2>Welcome!</h2>
        <p>Hello and welcome to my very first newsletter! I'm excited to share my journey of building digital income streams, especially for those of us who didn't grow up with technology but are ready to learn.</p>
        
        <h2>What You'll Learn Here</h2>
        <ul>
          <li>Simple, step-by-step strategies for online income</li>
          <li>Tools and systems that actually work (no tech overwhelm)</li>
          <li>Real results and lessons from my own experience</li>
          <li>Automation tips to free up your time</li>
        </ul>
        
        <h2>Why I'm Doing This</h2>
        <p>After years of trying complicated systems and feeling overwhelmed, I discovered that success comes from simple, consistent actions. I want to share what's working so you can skip the frustration and get straight to results.</p>
        
        <h2>What's Next</h2>
        <p>In the next issue, I'll share the exact 3-step system I'm using to generate my first online income. It's simpler than you think!</p>
        
        <p>Thanks for joining me on this journey!</p>
      `,
      keywords: ['digital income', 'online business', 'automation', 'beginner friendly'],
      imageUrl: '',
      summary: {
        short: 'Welcome to the journey of building simple, automated income streams.',
        medium: 'An introduction to building digital income without tech overwhelm. Learn simple strategies that work.',
        long: 'Welcome to the first newsletter! Discover simple, step-by-step strategies for building digital income streams without tech overwhelm. Learn about automation tools, proven systems, and real results from someone who\'s been there.'
      }
    });
    
    console.log('✅ Test article created successfully!');
    console.log('   Article ID:', testArticle._id || testArticle.id);
    console.log('   Title:', testArticle.title || 'Test Newsletter');
    console.log('   State:', testArticle.state || 'DRAFT');
    console.log('');
    
    // Step 4: Get articles in the publication
    console.log('5️⃣ Listing articles in publication...');
    const articles = await letterman.getArticles(testPub._id);
    console.log(`✅ Found ${articles.length} article(s)`);
    
    console.log('\n🎉 Letterman API test completed successfully!');
    console.log('\nNext steps:');
    console.log('- Review your article in the Letterman dashboard');
    console.log('- Publish when ready');
    console.log('- Set up email sending if not already configured');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
  }
}

testLetterman();
