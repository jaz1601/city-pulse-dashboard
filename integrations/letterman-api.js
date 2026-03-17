/**
 * Letterman API Integration Module
 * 
 * This module provides easy access to all Letterman API endpoints
 * for managing newsletters, publications, and articles.
 */

class LettermanAPI {
  constructor(apiKey) {
    this.baseURL = 'https://api.letterman.ai/api/ai';
    this.apiKey = apiKey;
  }

  // Helper method for API calls
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    return response.json();
  }

  // ==========================================
  // USER & ACCOUNT
  // ==========================================

  /**
   * Get current user profile
   */
  async getUser() {
    return this.request('/user');
  }

  // ==========================================
  // PUBLICATIONS (Newsletter Storage)
  // ==========================================

  /**
   * List all publications/newsletters
   */
  async getPublications() {
    return this.request('/newsletters-storage');
  }

  // ==========================================
  // ARTICLES
  // ==========================================

  /**
   * List articles in a publication
   * @param {string} storageId - Publication ID
   * @param {string} state - Filter: DRAFT, PUBLISHED, NEED_APPROVAL
   */
  async getArticles(storageId, state = null) {
    let endpoint = `/newsletters-storage/${storageId}/newsletters?type=ARTICLE`;
    if (state) {
      endpoint += `&state=${state}`;
    }
    return this.request(endpoint);
  }

  /**
   * Get a specific article
   * @param {string} articleId - Article ID
   */
  async getArticle(articleId) {
    return this.request(`/newsletters/${articleId}`);
  }

  /**
   * Create article from URL (AI-processed)
   * @param {string} storageId - Publication ID
   * @param {string} url - Source URL
   * @param {number} wordCount - Target word count
   * @param {string} keywords - Comma-separated keywords
   * @param {string} imageUrl - Hero image URL
   * @param {string} aiModel - AI model: OPEN_AI, GOOGLE_GEN_AI, GROK, CLAUDE
   */
  async createArticleFromURL(storageId, url, wordCount = 200, keywords = '', imageUrl = '', aiModel = 'OPEN_AI') {
    return this.request('/newsletters', {
      method: 'POST',
      body: {
        storageId,
        type: 'ARTICLE',
        articleOptions: {
          contentFrom: 'URL',
          url,
          wordsCount: wordCount,
          keywords,
          imageUrl,
          aiModel
        }
      }
    });
  }

  /**
   * Create article from content (AI-processed)
   * @param {string} storageId - Publication ID
   * @param {string} content - Raw text content
   * @param {number} wordCount - Target word count
   * @param {string} keywords - Comma-separated keywords
   * @param {string} aiModel - AI model: OPEN_AI, GOOGLE_GEN_AI, GROK, CLAUDE
   */
  async createArticleFromContent(storageId, content, wordCount = 200, keywords = '', aiModel = 'OPEN_AI') {
    return this.request('/newsletters', {
      method: 'POST',
      body: {
        storageId,
        type: 'ARTICLE',
        articleOptions: {
          contentFrom: 'CONTENT',
          content,
          wordsCount: wordCount,
          keywords,
          aiModel
        }
      }
    });
  }

  /**
   * Create article with EXACT content (NO AI processing) ⭐
   * @param {string} storageId - Publication ID
   * @param {object} articleData - Article data object
   * @param {string} articleData.headline - Article title (exact)
   * @param {string} articleData.subHeadline - Subtitle (exact)
   * @param {string} articleData.content - HTML content (exact)
   * @param {array} articleData.keywords - SEO keywords array
   * @param {string} articleData.imageUrl - Hero image URL
   * @param {object} articleData.summary - Summary object
   */
  async createArticleExact(storageId, articleData) {
    return this.request('/newsletters', {
      method: 'POST',
      body: {
        storageId,
        type: 'ARTICLE',
        articleOptions: {
          contentFrom: 'CONTENT',
          keepOriginal: true,
          headline: articleData.headline,
          subHeadline: articleData.subHeadline,
          content: articleData.content,
          keywords: articleData.keywords || [],
          imageUrl: articleData.imageUrl || '',
          summary: articleData.summary || null
        }
      }
    });
  }

  /**
   * Update an article
   * @param {string} articleId - Article ID
   * @param {object} updates - Fields to update
   */
  async updateArticle(articleId, updates) {
    return this.request(`/newsletters/${articleId}`, {
      method: 'PUT',
      body: updates
    });
  }

  /**
   * Publish an article (change state to PUBLISHED)
   * @param {string} articleId - Article ID
   */
  async publishArticle(articleId) {
    return this.updateArticle(articleId, { state: 'PUBLISHED' });
  }

  /**
   * Update article SEO
   * @param {string} articleId - Article ID
   * @param {object} seo - SEO data
   */
  async updateArticleSEO(articleId, seo) {
    return this.updateArticle(articleId, {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords
    });
  }
}

// Export for use in other modules
module.exports = LettermanAPI;

// Example usage:
// const LettermanAPI = require('./letterman-api');
// const letterman = new LettermanAPI('YOUR_API_KEY');
// 
// // Get publications
// const publications = await letterman.getPublications();
// 
// // Create article with exact content (no AI changes)
// const article = await letterman.createArticleExact('storage-id', {
//   headline: 'Your Exact Title',
//   subHeadline: 'Your exact subtitle',
//   content: '<p>Your exact HTML content</p>',
//   keywords: ['keyword1', 'keyword2']
// });
