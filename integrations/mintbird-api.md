# MintBird/PopLinks API Integration

**API Base URL:** `https://api.poplinks.io/api/ai`

**Authentication:** Bearer Token (API Key)

---

## Available Endpoints

### Lead Pages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/lead-pages` | Get all lead capture pages |
| GET | `/lead-pages/:id` | Get single lead page with full details |
| POST | `/lead-pages` | Create new lead page |
| PUT | `/lead-pages/:id/url` | Update URL configuration |
| POST | `/lead-pages/:id/clone` | Clone a lead page |
| PUT | `/lead-pages/:id/rename` | Rename lead page |
| PUT | `/lead-pages/:id/category` | Update category |
| PUT | `/lead-pages/:id/seo` | Update SEO metadata |
| PUT | `/lead-pages/:id/pre-headline` | Update sub-headline |
| PUT | `/lead-pages/:id/headline` | Update main headline |
| PUT | `/lead-pages/:id/post-headline` | Update CTA statement |
| PUT | `/lead-pages/:id/video` | Update video settings |
| PUT | `/lead-pages/:id/description` | Update description text block |
| PUT | `/lead-pages/:id/bullets` | Update bullet points (bulk) |
| PUT | `/lead-pages/:id/template` | Change template |
| POST | `/lead-pages/:id/change-template` | Apply AI template preset |

---

## Key Features

### Lead Page Structure
- **Landing Page** - Main capture page with form
- **Confirmation Page** - Thank you page after opt-in
- **Popup Settings** - Exit intent and timed popups
- **Funnel Links** - URL slugs and domains
- **SEO Metadata** - Title, description, keywords, OG image
- **Bullet Points** - Feature/benefit list
- **CSS Styling** - Template-based design

### Limitations (Beta)
- Max 5 lead pages per user
- Max 5MB for OG images

---

## Usage Example

```javascript
const MintBirdAPI = {
  baseURL: 'https://api.poplinks.io/api/ai',
  apiKey: 'YOUR_API_KEY',
  
  async getLeadPages() {
    const response = await fetch(`${this.baseURL}/lead-pages`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },
  
  async createLeadPage(name, templateId = null, categoryId = null) {
    const response = await fetch(`${this.baseURL}/lead-pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, template_id: templateId, category_id: categoryId })
    });
    return response.json();
  }
};
```

---

## Your API Key

Stored in: `credentials/titanium_software.txt`
- MintBird: `JbGlV2H8ACyAvom4ZcrmmYj1famXBUSa`

---

*Last updated: March 10, 2026*
