// Letterman API Integration Module
// Real-time publishing to Letterman

const LETTERMAN_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWI0MjNlZDQ3ODcyYjI4YjRkZDcwZTkiLCJrZXkiOiI5YmNkZWY2ZjJjN2Q3MmRhOTMyNjExMmE2ZTRmYzZjZiIsImlkIjoiNjliNDI3Nzg0Nzg3MmIyOGI0ZGQ3NzQ3IiwiaWF0IjoxNzczNDE0MjY0LCJleHAiOjE4MDQ5NTAyNjR9.l5Yvk2m0Uhpl0t8OZ_ApRgsPXa9hcjxVzNbGrfTP3GY';
const LETTERMAN_BASE_URL = 'https://api.letterman.ai/api';

// City configurations with storage IDs
const CITY_CONFIGS = {
    'cape-town': {
        name: 'Cape Town City Pulse',
        storageId: '69b8f1f847872b28b4e44ff5'
    },
    'pretoria': {
        name: 'Pretoria City Pulse',
        storageId: '69b8f20747872b28b4e45014'
    },
    'johannesburg': {
        name: 'Johannesburg City Pulse',
        storageId: '69b8f21647872b28b4e45031'
    }
};

// Publish article to Letterman
async function publishToLetterman(article) {
    const cityConfig = CITY_CONFIGS[article.city];
    
    if (!cityConfig) {
        throw new Error('Invalid city configuration');
    }
    
    const payload = {
        storageId: cityConfig.storageId,
        type: "ARTICLE",
        articleOptions: {
            contentFrom: "CONTENT",
            keepOriginal: true,
            headline: article.headline,
            subHeadline: article.subtitle || '',
            content: article.content,
            keywords: article.keywords || [],
            imageUrl: article.image || '',
            summary: {
                title: article.headline,
                description: article.subtitle || article.headline,
                content: `<p>${article.subtitle || ''}</p>`
            }
        }
    };
    
    try {
        const response = await fetch(`${LETTERMAN_BASE_URL}/newsletters`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${LETTERMAN_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return {
            success: true,
            articleId: data._id,
            url: data.fullUrl,
            message: 'Article published successfully!'
        };
        
    } catch (error) {
        console.error('Letterman API Error:', error);
        throw error;
    }
}

// Update article in Letterman
async function updateLettermanArticle(lettermanId, article) {
    const payload = {
        name: article.headline,
        title: article.headline,
        description: article.subtitle,
        keywords: article.keywords,
        imageUrl: article.image,
        state: 'DRAFT'
    };
    
    try {
        const response = await fetch(`${LETTERMAN_BASE_URL}/newsletters/${lettermanId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${LETTERMAN_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return { success: true, message: 'Article updated successfully!' };
        
    } catch (error) {
        console.error('Letterman Update Error:', error);
        throw error;
    }
}

// Delete article from Letterman
async function deleteLettermanArticle(lettermanId) {
    try {
        const response = await fetch(`${LETTERMAN_BASE_URL}/newsletters/${lettermanId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${LETTERMAN_API_KEY}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return { success: true, message: 'Article deleted from Letterman!' };
        
    } catch (error) {
        console.error('Letterman Delete Error:', error);
        throw error;
    }
}

// Get articles from Letterman
async function getLettermanArticles(storageId, state = 'DRAFT') {
    try {
        const response = await fetch(
            `${LETTERMAN_BASE_URL}/newsletters-storage/${storageId}/newsletters?type=ARTICLE&state=${state}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${LETTERMAN_API_KEY}`
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('Letterman Fetch Error:', error);
        throw error;
    }
}

// Export for use in dashboard
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        publishToLetterman,
        updateLettermanArticle,
        deleteLettermanArticle,
        getLettermanArticles,
        CITY_CONFIGS
    };
}