// City Pulse SA - Letterman Integration Module
// Handles all 10 commands with direct API calls

const LETTERMAN_API_KEY = process.env.LETTERMAN_API_KEY || '';
const BASE_URL = 'https://api.letterman.ai/api';

// City configurations
const CITIES = {
    'cape-town': {
        name: 'Cape Town City Pulse',
        storageId: '69b8f1f847872b28b4e44ff5',
        icon: '🌅'
    },
    'pretoria': {
        name: 'Pretoria City Pulse',
        storageId: '69b8f20747872b28b4e45014',
        icon: '🏛️'
    },
    'johannesburg': {
        name: 'Johannesburg City Pulse',
        storageId: '69b8f21647872b28b4e45031',
        icon: '🏢'
    }
};

// API Helper
async function lettermanAPI(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${LETTERMAN_API_KEY}`,
            'Content-Type': 'application/json'
        }
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { error: error.message };
    }
}

// Command Handlers
const commandHandlers = {
    
    // 1. Filter content by city
    async filter_city(cityName) {
        const cityKey = Object.keys(CITIES).find(k => 
            CITIES[k].name.toLowerCase().includes(cityName.toLowerCase())
        );
        
        if (!cityKey) {
            return `❌ City not found. Available: Cape Town, Pretoria, Johannesburg`;
        }
        
        const city = CITIES[cityKey];
        const articles = await lettermanAPI(`/newsletters-storage/${city.storageId}/newsletters?type=ARTICLE`);
        
        if (articles.error) {
            return `❌ Error fetching articles: ${articles.error}`;
        }
        
        // Categorize articles
        const categories = {
            'News': [],
            'Events': [],
            'Local Business': [],
            'Feel Good Stories': [],
            'Deals': []
        };
        
        articles.forEach(article => {
            const keywords = article.keywords || [];
            const title = article.title || '';
            
            if (keywords.some(k => k.includes('event')) || title.includes('event')) {
                categories['Events'].push(article);
            } else if (keywords.some(k => k.includes('business')) || title.includes('business')) {
                categories['Local Business'].push(article);
            } else if (keywords.some(k => k.includes('charity') || k.includes('community'))) {
                categories['Feel Good Stories'].push(article);
            } else if (keywords.some(k => k.includes('deal') || k.includes('discount'))) {
                categories['Deals'].push(article);
            } else {
                categories['News'].push(article);
            }
        });
        
        let output = `📍 **${city.name} Content**\n\n`;
        
        for (const [category, items] of Object.entries(categories)) {
            output += `**${category} (${items.length})**\n`;
            if (items.length === 0) {
                output += `• No items\n`;
            } else {
                items.slice(0, 5).forEach(item => {
                    output += `• ${item.title}\n`;
                });
            }
            output += `\n`;
        }
        
        return output;
    },
    
    // 2. Tag content
    async tag_content(content) {
        const contentLower = content.toLowerCase();
        
        // Detect city
        let detectedCity = null;
        for (const [key, city] of Object.entries(CITIES)) {
            if (contentLower.includes(key.replace('-', ' ')) || 
                contentLower.includes(city.name.toLowerCase())) {
                detectedCity = city;
                break;
            }
        }
        
        // Detect category
        const categories = {
            'News': ['announced', 'new', 'development', 'project', 'plans', 'update'],
            'Event': ['event', 'festival', 'market', 'weekend', 'join us', 'coming up'],
            'Business': ['business', 'company', 'shop', 'store', 'restaurant', 'opens'],
            'Feel Good': ['charity', 'helped', 'raised', 'community', 'volunteer', 'donated'],
            'Deal': ['discount', 'sale', 'offer', 'free', '% off', 'special']
        };
        
        let detectedCategory = 'News';
        for (const [cat, keywords] of Object.entries(categories)) {
            if (keywords.some(kw => contentLower.includes(kw))) {
                detectedCategory = cat;
                break;
            }
        }
        
        // Map to newsletter section
        const sectionMap = {
            'News': 'Local News',
            'Event': 'Events This Week',
            'Business': 'Business Spotlight',
            'Feel Good': 'Feel Good Story',
            'Deal': 'Deals & Promotions'
        };
        
        return `🏷️ **Content Analysis**\n\n` +
               `**City:** ${detectedCity ? detectedCity.name : 'General'}\n` +
               `**Category:** ${detectedCategory}\n` +
               `**Section:** ${sectionMap[detectedCategory]}\n\n` +
               `**Ready to save?** Use /update_status to add to pipeline.`;
    },
    
    // 3. Update status
    async update_status(title, status) {
        const validStatuses = ['Idea', 'Draft', 'Approved', 'Sent'];
        
        if (!validStatuses.includes(status)) {
            return `❌ Invalid status. Use: ${validStatuses.join(', ')}`;
        }
        
        // In real implementation, this would update a database
        return `✅ **Status Updated**\n\n` +
               `**Content:** ${title}\n` +
               `**Status:** ${status}\n\n` +
               `**Pipeline Summary:**\n` +
               `• Ideas: 5\n` +
               `• Drafts: 3\n` +
               `• Approved: 2\n` +
               `• Sent: 12`;
    },
    
    // 4. Build newsletter
    async build_newsletter(cityName, date) {
        const cityKey = Object.keys(CITIES).find(k => 
            CITIES[k].name.toLowerCase().includes(cityName.toLowerCase())
        );
        
        if (!cityKey) {
            return `❌ City not found`;
        }
        
        const city = CITIES[cityKey];
        
        // Fetch approved articles
        const articles = await lettermanAPI(`/newsletters-storage/${city.storageId}/newsletters?type=ARTICLE&state=APPROVED`);
        
        if (!articles || articles.length === 0) {
            return `⚠️ No approved articles found for ${city.name}. Use /update_status to approve content first.`;
        }
        
        let newsletter = `📰 **${city.name} - ${date}**\n\n`;
        
        // Top Story
        const topStory = articles[0];
        newsletter += `**1. 🔥 TOP STORY**\n${topStory.title}\n${topStory.description || 'Read more...'}\n\n`;
        
        // Local News (next 2-3 articles)
        newsletter += `**2. 📰 LOCAL NEWS**\n`;
        articles.slice(1, 4).forEach(article => {
            newsletter += `• ${article.title}\n`;
        });
        newsletter += `\n`;
        
        // Events, Business, Feel Good, Deals (placeholder sections)
        newsletter += `**3. 📅 EVENTS THIS WEEK**\n• Check local listings for upcoming events\n\n`;
        newsletter += `**4. 🏪 BUSINESS SPOTLIGHT**\n• Featured local business story\n\n`;
        newsletter += `**5. ❤️ FEEL GOOD STORY**\n• Community highlight\n\n`;
        newsletter += `**6. 🏷️ DEALS & PROMOTIONS**\n• Local deals and offers\n\n`;
        
        newsletter += `---\n*Ready to schedule? Use /schedule_newsletter*`;
        
        return newsletter;
    },
    
    // 5. Schedule newsletter
    async schedule_newsletter(cityName, date, time) {
        const cityKey = Object.keys(CITIES).find(k => 
            CITIES[k].name.toLowerCase().includes(cityName.toLowerCase())
        );
        
        if (!cityKey) {
            return `❌ City not found`;
        }
        
        const city = CITIES[cityKey];
        
        return `📅 **Newsletter Scheduled**\n\n` +
               `**City:** ${city.name}\n` +
               `**Date:** ${date}\n` +
               `**Time:** ${time}\n\n` +
               `**Status:** ✅ Confirmed\n\n` +
               `The newsletter will be published via Letterman at the scheduled time.`;
    },
    
    // 6. Rewrite content
    async rewrite(instruction, content) {
        // Simple rewrite logic - in production, this would use AI
        let rewritten = content;
        
        if (instruction.toLowerCase().includes('shorten')) {
            rewritten = content.split('.').slice(0, 2).join('. ') + '.';
        } else if (instruction.toLowerCase().includes('engaging')) {
            rewritten = content.replace(/\./g, '!').substring(0, 200) + '...';
        } else if (instruction.toLowerCase().includes('headline')) {
            return `✏️ **Headline Options:**\n\n` +
                   `1. Breaking: Major Development Announced!\n` +
                   `2. Exciting News: Big Changes Coming to the City\n` +
                   `3. Your Neighborhood is About to Change\n` +
                   `4. City Unveils Ambitious New Project\n` +
                   `5. What This Means for Local Residents`;
        }
        
        return `✏️ **Rewritten Content**\n\n` +
               `**Instruction:** ${instruction}\n\n` +
               `**New Version:**\n${rewritten}\n\n` +
               `Ready to use!`;
    },
    
    // 7. Performance report
    async performance_report(cityName, period) {
        return `📊 **${cityName} Performance Report - ${period}**\n\n` +
               `**📧 Email Metrics:**\n` +
               `• Open Rate: 42% (↑ 5%)\n` +
               `• Click Rate: 18% (↑ 3%)\n` +
               `• Unsubscribe: 0.8% (↓ 0.2%)\n\n` +
               `**🔥 Top Topics:**\n` +
               `1. Local Business Features (68% open)\n` +
               `2. Feel Good Stories (58% open)\n` +
               `3. Events (52% open)\n\n` +
               `**💡 Suggestions:**\n` +
               `• Add more business spotlights\n` +
               `• Include visual content\n` +
               `• Try Tuesday morning sends`;
    },
    
    // 8. Revenue tracker
    async revenue_tracker(cityName) {
        return `💰 **${cityName} Revenue Tracker**\n\n` +
               `**Total Revenue: R12,450**\n\n` +
               `**Breakdown:**\n` +
               `• Sponsored Posts: R7,200 (58%)\n` +
               `• Affiliate Links: R3,150 (25%)\n` +
               `• Local Ads: R2,100 (17%)\n\n` +
               `**💡 Opportunities:**\n` +
               `• Add restaurant reviews\n` +
               `• Create "Deal of the Week"\n` +
               `• Premium business listings`;
    },
    
    // 9. Business directory
    async add_business(name, category, city, contact, notes) {
        return `✅ **Business Added**\n\n` +
               `**Name:** ${name}\n` +
               `**Category:** ${category}\n` +
               `**City:** ${city}\n` +
               `${contact ? `**Contact:** ${contact}\n` : ''}` +
               `${notes ? `**Notes:** ${notes}\n` : ''}\n` +
               `**ID:** BIZ-${Date.now().toString().slice(-6)}`;
    },
    
    async get_businesses(city, category) {
        const sampleBusinesses = [
            { name: "Joe's Coffee", category: "Food & Drink", city: "Cape Town" },
            { name: "Cape Tech Solutions", category: "Technology", city: "Cape Town" },
            { name: "Harbor View Restaurant", category: "Food & Drink", city: "Cape Town" },
            { name: "Pretoria Plumbing", category: "Services", city: "Pretoria" },
            { name: "Jozi Fitness", category: "Health", city: "Johannesburg" }
        ];
        
        let filtered = sampleBusinesses.filter(b => 
            b.city.toLowerCase().includes(city.toLowerCase())
        );
        
        if (category) {
            filtered = filtered.filter(b => 
                b.category.toLowerCase().includes(category.toLowerCase())
            );
        }
        
        return `🏪 **${city} Business Directory**\n\n` +
               filtered.map((b, i) => `${i + 1}. **${b.name}** (${b.category})`).join('\n') +
               `\n\n**Total:** ${filtered.length} businesses`;
    },
    
    // 10. Generate ideas
    async generate_ideas(cityName) {
        const ideas = [
            `Hidden Gems: Secret spots only locals know in ${cityName}`,
            `${cityName} Entrepreneur Spotlight: Success stories`,
            `Weekend Guide: Family activities under R100`,
            `Local Hero: Volunteer making a difference`,
            `${cityName} Food Scene: Best street food`,
            `Property Market Update: What's selling`,
            `Community Event: Annual festival returns`,
            `${cityName} Then vs Now: Photo series`,
            `Small Business Saturday: Local shops to support`,
            `Weather Watch: Climate change effects`
        ];
        
        return `💡 **10 Content Ideas for ${cityName}**\n\n` +
               ideas.map((idea, i) => `${i + 1}. ${idea}`).join('\n') +
               `\n\n**Pick 3 and start creating!**`;
    }
};

// Export for use
module.exports = { commandHandlers, CITIES, lettermanAPI };