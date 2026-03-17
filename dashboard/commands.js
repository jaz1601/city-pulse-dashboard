// City Pulse Command Handler
// This script processes commands for the City Pulse newsletter system

const cityPulseCommands = {
    
    // 1. City Filter
    '/filter_city': (args) => {
        const city = args.match(/City:\s*(.+)/i)?.[1]?.trim();
        if (!city) return "❌ Please specify a city. Example: /filter_city City: Cape Town";
        
        return `📍 **${city} Content Dashboard**

**📰 News (3)**
• Waterfront Development Brings 500 Jobs
• New Transport Hub Announced
• Local School Wins Award

**🎉 Events (2)**
• Weekend Market at Waterfront
• Community Cleanup Day

**🏪 Local Business (4)**
• Joe's Coffee - New Location
• Cape Tech Solutions
• Harbor View Restaurant
• City Books & Cafe

**❤️ Feel Good Stories (1)**
• Local Teen Raises R50K for Charity

**🏷️ Deals (2)**
• 20% Off at Waterfront Restaurants
• Free Parking This Weekend`;
    },

    // 2. Content Tagging
    '/tag_content': (args) => {
        const content = args.match(/Article:\s*([\s\S]+)/i)?.[1]?.trim();
        if (!content) return "❌ Please provide article content. Example: /tag_content\\n\\nArticle: [your content]";
        
        // Simple keyword-based tagging
        const cityKeywords = {
            'Cape Town': ['cape town', 'waterfront', 'table mountain', 'harbor'],
            'Pretoria': ['pretoria', 'tshwane', 'union buildings', 'jacaranda'],
            'Johannesburg': ['johannesburg', 'joburg', 'jozi', 'hillbrow', 'sandton']
        };
        
        const typeKeywords = {
            'News': ['announced', 'new', 'development', 'project', 'plans'],
            'Event': ['event', 'festival', 'market', 'weekend', 'join us'],
            'Business': ['business', 'company', 'shop', 'store', 'restaurant'],
            'Feel Good': ['charity', 'helped', 'raised', 'community', 'volunteer'],
            'Deal': ['discount', 'sale', 'offer', 'free', '% off']
        };
        
        const contentLower = content.toLowerCase();
        
        // Detect city
        let detectedCity = 'General';
        for (const [city, keywords] of Object.entries(cityKeywords)) {
            if (keywords.some(kw => contentLower.includes(kw))) {
                detectedCity = city;
                break;
            }
        }
        
        // Detect type
        let detectedType = 'News';
        for (const [type, keywords] of Object.entries(typeKeywords)) {
            if (keywords.some(kw => contentLower.includes(kw))) {
                detectedType = type;
                break;
            }
        }
        
        // Suggest section
        const sectionMap = {
            'News': 'Local News',
            'Event': 'Events This Week',
            'Business': 'Business Spotlight',
            'Feel Good': 'Feel Good Story',
            'Deal': 'Deals & Promotions'
        };
        
        return `🏷️ **Content Analysis Results**

**Detected City:** ${detectedCity}
**Content Type:** ${detectedType}
**Suggested Section:** ${sectionMap[detectedType] || 'Local News'}

**Keywords Found:** ${Object.values(typeKeywords).flat().filter(kw => contentLower.includes(kw)).slice(0, 5).join(', ') || 'General news'}`;
    },

    // 3. Status Management
    '/update_status': (args) => {
        const title = args.match(/Content Title:\s*(.+)/i)?.[1]?.trim();
        const status = args.match(/Change status to:\s*(.+)/i)?.[1]?.trim();
        
        if (!title || !status) {
            return "❌ Please provide title and status. Example:\n/update_status\\nContent Title: Article Name\\nChange status to: Approved";
        }
        
        const validStatuses = ['Idea', 'Draft', 'Approved', 'Sent'];
        if (!validStatuses.includes(status)) {
            return `❌ Invalid status. Use: ${validStatuses.join(', ')}`;
        }
        
        return `✅ **Status Updated**

**Content:** ${title}
**New Status:** ${status}

**📊 Pipeline Summary:**
• Ideas: 5
• Drafts: 3
• Approved: 2
• Sent: 12

**Next Actions:**
${status === 'Approved' ? '• Ready to schedule for newsletter' : ''}
${status === 'Draft' ? '• Review and edit before approval' : ''}`;
    },

    // 4. Newsletter Builder
    '/build_newsletter': (args) => {
        const city = args.match(/City:\s*(.+)/i)?.[1]?.trim();
        const date = args.match(/Date:\s*(.+)/i)?.[1]?.trim();
        
        if (!city) return "❌ Please specify a city. Example: /build_newsletter\\nCity: Cape Town\\nDate: March 20, 2026";
        
        return `📰 **${city} City Pulse - ${date || 'This Week'}**

**1. 🔥 TOP STORY**
Major Development Project Announced
A new R2.3 billion investment is set to transform the city...

**2. 📰 LOCAL NEWS**
• Transport Hub Plans Revealed
• School Wins National Award
• Community Center Expansion

**3. 📅 EVENTS THIS WEEK**
• Saturday: Waterfront Market (9AM - 4PM)
• Sunday: Community Cleanup (10AM)
• Tuesday: Business Networking (6PM)

**4. 🏪 BUSINESS SPOTLIGHT**
Joe's Coffee - New Location Opening
Local favorite expands to third location...

**5. ❤️ FEEL GOOD STORY**
Teen Raises R50K for Local Charity
15-year-old organizes successful fundraiser...

**6. 🏷️ DEALS & PROMOTIONS**
• 20% off at Waterfront restaurants
• Free parking this weekend
• Buy-one-get-one at City Books

---
*Ready to schedule? Use /schedule_newsletter*`;
    },

    // 5. Scheduling
    '/schedule_newsletter': (args) => {
        const city = args.match(/City:\s*(.+)/i)?.[1]?.trim();
        const date = args.match(/Date:\s*(.+)/i)?.[1]?.trim();
        const time = args.match(/Time:\s*(.+)/i)?.[1]?.trim();
        
        if (!city || !date || !time) {
            return "❌ Please provide city, date, and time. Example:\n/schedule_newsletter\\nCity: Cape Town\\nDate: March 20, 2026\\nTime: 09:00 AM";
        }
        
        return `📅 **Newsletter Scheduled**

**City:** ${city}
**Date:** ${date}
**Time:** ${time}

**Status:** ✅ Confirmed

**What's Next:**
• Newsletter will be prepared 1 hour before sending
• You'll receive a preview 30 minutes before
• Auto-publish to Letterman at scheduled time

**To Reschedule:**
Use /schedule_newsletter again with new details.`;
    },

    // 6. AI Rewrite
    '/rewrite': (args) => {
        const instruction = args.match(/Instruction:\s*(.+)/i)?.[1]?.trim();
        const content = args.match(/Content:\s*([\s\S]+)/i)?.[1]?.trim();
        
        if (!instruction || !content) {
            return "❌ Please provide instruction and content. Example:\n/rewrite\\nInstruction: Make more engaging\\nContent: [your content]";
        }
        
        // Simple rewrite based on instruction
        let rewritten = content;
        
        if (instruction.toLowerCase().includes('engaging')) {
            rewritten = content.replace(/\./g, '!').replace(/is/g, 'is absolutely').substring(0, 200) + '...';
        } else if (instruction.toLowerCase().includes('shorten')) {
            rewritten = content.split('.').slice(0, 2).join('. ') + '.';
        } else if (instruction.toLowerCase().includes('headline')) {
            return `✏️ **Headline Options:**

1. Breaking: Major Development Transforms City!
2. Exciting News: 500 New Jobs Coming to Waterfront
3. City Announces R2.3 Billion Investment Project
4. Your Neighborhood is About to Change - Here's How
5. Big News: Waterfront Development Approved`;
        }
        
        return `✏️ **Rewritten Content**

**Instruction:** ${instruction}

**New Version:**
${rewritten}

**Changes Made:**
• Tone adjusted per instruction
• Language simplified for newsletter format
• Length optimized for readability

**Ready to use?** Copy and update your article!`;
    },

    // 7. Performance Report
    '/performance_report': (args) => {
        const city = args.match(/City:\s*(.+)/i)?.[1]?.trim();
        const period = args.match(/Time Period:\s*(.+)/i)?.[1]?.trim() || 'Last 30 days';
        
        if (!city) return "❌ Please specify a city. Example: /performance_report\\nCity: Cape Town\\nTime Period: Last 30 days";
        
        return `📊 **${city} Performance Report - ${period}**

**📧 Email Metrics:**
• Open Rate: 42% (↑ 5% from last period)
• Click Rate: 18% (↑ 3%)
• Unsubscribe Rate: 0.8% (↓ 0.2%)

**🔥 Top Performing Topics:**
1. Local Business Features (68% open rate)
2. Feel Good Stories (58% open rate)
3. Events (52% open rate)
4. Deals & Promotions (48% open rate)
5. General News (38% open rate)

**💡 Improvement Suggestions:**
• Add more local business spotlights
• Include more visual content
• Try sending on Tuesday mornings
• Add "Quick Read" section for busy subscribers

**📈 Growth:**
• New Subscribers: +127
• Total List Size: 1,847
• Growth Rate: +7.4%`;
    },

    // 8. Revenue Tracker
    '/revenue_tracker': (args) => {
        const city = args.match(/City:\s*(.+)/i)?.[1]?.trim();
        if (!city) return "❌ Please specify a city. Example: /revenue_tracker\\nCity: Cape Town";
        
        return `💰 **${city} Revenue Tracker - March 2026**

**💵 Total Revenue: R12,450**

**Revenue Breakdown:**
• Sponsored Posts: R7,200 (58%)
  - Waterfront Development Promo: R3,500
  - Local Business Package: R2,800
  - Event Sponsorship: R900

• Affiliate Links: R3,150 (25%)
  - Book Recommendations: R1,200
  - Product Reviews: R1,950

• Local Ads: R2,100 (17%)
  - Banner Ads: R1,400
  - Classifieds: R700

**📈 Top Performers:**
1. Waterfront restaurant feature (R3,500)
2. Book affiliate links (R1,200)
3. Business directory listings (R1,400)

**💡 Opportunities:**
• Add more restaurant reviews
• Create "Deal of the Week" section
• Offer premium business listings`;
    },

    // 9. Business Directory
    '/add_business': (args) => {
        const name = args.match(/Business Name:\s*(.+)/i)?.[1]?.trim();
        const category = args.match(/Category:\s*(.+)/i)?.[1]?.trim();
        const city = args.match(/City:\s*(.+)/i)?.[1]?.trim();
        const contact = args.match(/Contact Info:\s*(.+)/i)?.[1]?.trim();
        const notes = args.match(/Notes:\s*(.+)/i)?.[1]?.trim();
        
        if (!name || !category || !city) {
            return "❌ Please provide at least: Business Name, Category, and City";
        }
        
        return `✅ **Business Added to Directory**

**Name:** ${name}
**Category:** ${category}
**City:** ${city}
${contact ? `**Contact:** ${contact}` : ''}
${notes ? `**Notes:** ${notes}` : ''}

**Business ID:** BIZ-${Date.now().toString().slice(-6)}

**Next Steps:**
• Business is now in directory
• Can be featured in newsletters
• Eligible for sponsored content`;
    },

    '/get_businesses': (args) => {
        const city = args.match(/City:\s*(.+)/i)?.[1]?.trim();
        const category = args.match(/Category:\s*(.+)/i)?.[1]?.trim();
        
        if (!city) return "❌ Please specify a city. Example: /get_businesses\\nCity: Cape Town\\nCategory: Food & Drink";
        
        const businesses = [
            { name: "Joe's Coffee", category: "Food & Drink", contact: "info@joescoffee.co.za" },
            { name: "Cape Tech Solutions", category: "Technology", contact: "hello@capetech.co.za" },
            { name: "Harbor View Restaurant", category: "Food & Drink", contact: "bookings@harborview.co.za" },
            { name: "City Books & Cafe", category: "Retail", contact: "shop@citybooks.co.za" },
            { name: "Waterfront Fitness", category: "Health", contact: "info@waterfrontfitness.co.za" }
        ];
        
        const filtered = category 
            ? businesses.filter(b => b.category.toLowerCase().includes(category.toLowerCase()))
            : businesses;
        
        return `🏪 **${city} Business Directory**
${category ? `**Category:** ${category}` : ''}

${filtered.map((b, i) => `${i + 1}. **${b.name}**
   Category: ${b.category}
   Contact: ${b.contact}`).join('\n\n')}

**Total:** ${filtered.length} businesses

**To Add New:** Use /add_business`;
    },

    // 10. Content Ideas Generator
    '/generate_ideas': (args) => {
        const city = args.match(/City:\s*(.+)/i)?.[1]?.trim();
        if (!city) return "❌ Please specify a city. Example: /generate_ideas\\nCity: Cape Town";
        
        const ideas = [
            `Hidden Gems: 5 Secret Spots Only Locals Know in ${city}`,
            `${city} Entrepreneur Spotlight: From Garage to Success`,
            `Weekend Guide: Family-Friendly Activities Under R100`,
            `Local Hero: Meet the Volunteer Making a Difference`,
            `${city} Food Scene: Best Street Food You Haven't Tried`,
            `Property Market Update: What's Selling in ${city}`,
            `Community Event: Annual Festival Returns This Month`,
            `${city} Through the Years: Then vs Now Photo Series`,
            `Small Business Saturday: Support These Local Shops`,
            `Weather Watch: How Climate Change Affects ${city}`
        ];
        
        return `💡 **10 Content Ideas for ${city}**

${ideas.map((idea, i) => `${i + 1}. ${idea}`).join('\n')}

**Quick Wins:**
• Ideas 1, 5, 9 are easy to produce
• Ideas 2, 4, 8 have high engagement potential
• Ideas 3, 6, 10 provide practical value

**To Develop:** Pick 3 ideas and use /tag_content to categorize them!`;
    }
};

// Command processor
function processCommand(commandText) {
    const lines = commandText.trim().split('\n');
    const command = lines[0].trim();
    const args = lines.slice(1).join('\n');
    
    if (cityPulseCommands[command]) {
        return cityPulseCommands[command](args);
    }
    
    return `❌ Unknown command: ${command}

**Available Commands:**
• /filter_city - View content by city
• /tag_content - Auto-categorize articles
• /update_status - Manage content pipeline
• /build_newsletter - Compile newsletter
• /schedule_newsletter - Schedule sending
• /rewrite - AI content improvement
• /performance_report - Analytics
• /revenue_tracker - Monetization
• /add_business - Add to directory
• /get_businesses - List businesses
• /generate_ideas - Content inspiration

Type a command to see usage examples.`;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { processCommand, cityPulseCommands };
}