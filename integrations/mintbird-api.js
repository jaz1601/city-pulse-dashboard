/**
 * MintBird / PopLinks API Integration Module
 * 
 * This module provides easy access to all MintBird API endpoints
 * for managing lead pages, funnels, and marketing assets.
 */

class MintBirdAPI {
  constructor(apiKey) {
    this.baseURL = 'https://api.poplinks.io/api/ai';
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
  // LEAD PAGES
  // ==========================================

  /**
   * Get all lead capture pages
   */
  async getLeadPages() {
    return this.request('/lead-pages');
  }

  /**
   * Get a single lead page with full details
   * @param {number} id - Lead page ID
   */
  async getLeadPage(id) {
    return this.request(`/lead-pages/${id}`);
  }

  /**
   * Create a new lead page
   * @param {string} name - Page name
   * @param {number} templateId - Optional template ID
   * @param {number} categoryId - Optional category ID
   */
  async createLeadPage(name, templateId = null, categoryId = null) {
    return this.request('/lead-pages', {
      method: 'POST',
      body: { name, template_id: templateId, category_id: categoryId }
    });
  }

  /**
   * Update lead page URL configuration
   * @param {number} id - Lead page ID
   * @param {object} urlConfig - URL configuration
   */
  async updateLeadPageURL(id, urlConfig) {
    return this.request(`/lead-pages/${id}/url`, {
      method: 'PUT',
      body: urlConfig
    });
  }

  /**
   * Clone a lead page
   * @param {number} id - Lead page ID to clone
   */
  async cloneLeadPage(id) {
    return this.request(`/lead-pages/${id}/clone`, {
      method: 'POST'
    });
  }

  /**
   * Rename a lead page
   * @param {number} id - Lead page ID
   * @param {string} name - New name
   */
  async renameLeadPage(id, name) {
    return this.request(`/lead-pages/${id}/rename`, {
      method: 'PUT',
      body: { name }
    });
  }

  /**
   * Update lead page category
   * @param {number} id - Lead page ID
   * @param {number} categoryId - Category ID
   */
  async updateLeadPageCategory(id, categoryId) {
    return this.request(`/lead-pages/${id}/category`, {
      method: 'PUT',
      body: { category_id: categoryId }
    });
  }

  // ==========================================
  // CONTENT MANAGEMENT
  // ==========================================

  /**
   * Update SEO metadata
   * @param {number} id - Lead page ID
   * @param {object} seo - SEO data (title, description, keywords, author)
   */
  async updateSEO(id, seo) {
    return this.request(`/lead-pages/${id}/seo`, {
      method: 'PUT',
      body: seo
    });
  }

  /**
   * Update pre-headline (sub-headline)
   * @param {number} id - Lead page ID
   * @param {string} subHeadline - Sub-headline text
   */
  async updatePreHeadline(id, subHeadline) {
    return this.request(`/lead-pages/${id}/pre-headline`, {
      method: 'PUT',
      body: { sub_headline: subHeadline }
    });
  }

  /**
   * Update main headline
   * @param {number} id - Lead page ID
   * @param {string} mainHeadline - Main headline text
   */
  async updateHeadline(id, mainHeadline) {
    return this.request(`/lead-pages/${id}/headline`, {
      method: 'PUT',
      body: { main_headline: mainHeadline }
    });
  }

  /**
   * Update post-headline (CTA statement)
   * @param {number} id - Lead page ID
   * @param {string} ctaStatement - CTA text
   */
  async updatePostHeadline(id, ctaStatement) {
    return this.request(`/lead-pages/${id}/post-headline`, {
      method: 'PUT',
      body: { cta_statement: ctaStatement }
    });
  }

  /**
   * Update video settings
   * @param {number} id - Lead page ID
   * @param {boolean} enabled - Enable/disable video
   * @param {string} videoType - Video platform (youtube, vimeo)
   * @param {string} videoUrl - Video URL
   */
  async updateVideo(id, enabled, videoType = null, videoUrl = null) {
    return this.request(`/lead-pages/${id}/video`, {
      method: 'PUT',
      body: {
        is_video_enabled: enabled,
        video_type: videoType,
        video_url: videoUrl
      }
    });
  }

  /**
   * Update description text block
   * @param {number} id - Lead page ID
   * @param {boolean} enabled - Enable/disable text block
   * @param {string} content - HTML content
   */
  async updateDescription(id, enabled, content = '') {
    return this.request(`/lead-pages/${id}/description`, {
      method: 'PUT',
      body: {
        is_textblock_enabled: enabled,
        textblock_content: content
      }
    });
  }

  /**
   * Update bullet points (replaces all existing)
   * @param {number} id - Lead page ID
   * @param {string} title - Bullet section title
   * @param {array} bullets - Array of bullet objects {name, rotation_number}
   */
  async updateBullets(id, title, bullets) {
    return this.request(`/lead-pages/${id}/bullets`, {
      method: 'PUT',
      body: {
        bullet_title: title,
        bullets: bullets
      }
    });
  }

  // ==========================================
  // TEMPLATES
  // ==========================================

  /**
   * Change template
   * @param {number} id - Lead page ID
   * @param {number} templateId - Template ID
   */
  async changeTemplate(id, templateId) {
    return this.request(`/lead-pages/${id}/template`, {
      method: 'PUT',
      body: { template_id: templateId }
    });
  }

  /**
   * Apply AI template preset
   * @param {number} id - Lead page ID
   */
  async applyAITemplate(id) {
    return this.request(`/lead-pages/${id}/change-template`, {
      method: 'POST'
    });
  }
}

// Export for use in other modules
module.exports = MintBirdAPI;

// Example usage:
// const MintBirdAPI = require('./mintbird-api');
// const mintbird = new MintBirdAPI('YOUR_API_KEY');
// const pages = await mintbird.getLeadPages();
