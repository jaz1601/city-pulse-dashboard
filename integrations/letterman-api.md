# Letterman API Integration

**API Base URL:** `https://api.letterman.ai/api/ai`

**Authentication:** Bearer Token (API Key)

---

## Available Endpoints

### User & Account

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user` | Get current user profile |

### Publications (Newsletter Storage)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/newsletters-storage` | List all publications |

### Articles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/newsletters-storage/:storageId/newsletters?type=ARTICLE` | List articles in publication |
| POST | `/newsletters` | Create new article |
| GET | `/newsletters/:id` | Get specific article |
| PUT | `/newsletters/:id` | Update article |

---

## Key Features

### Content Creation Modes

**Mode 1: From URL (AI-Processed)**
- Extracts and summarizes content from a web URL
- Uses AI to generate article

**Mode 2: From Content (AI-Processed)**
- Processes raw text using AI
- Generates article from your content

**Mode 3: keepOriginal (NO AI Processing)** ⭐ **IMPORTANT**
- Uses your content **exactly** as provided
- No AI modifications to headline, content, or summary
- Perfect for OpenClaw integration

### Article States
- `DRAFT` - Working draft
- `PUBLISHED` - Live article
- `NEED_APPROVAL` - Pending approval

---

## Usage Example

```javascript
const LettermanAPI = {
  baseURL: 'https://api.letterman.ai/api/ai',
  apiKey: 'YOUR_API_KEY',
  
  async getUser() {
    const response = await fetch(`${this.baseURL}/user`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },
  
  async createArticle(storageId, articleData) {
    const response = await fetch(`${this.baseURL}/newsletters`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        storageId,
        type: 'ARTICLE',
        articleOptions: articleData
      })
    });
    return response.json();
  }
};
```

---

## Your API Key

Stored in: `credentials/titanium_software.txt`
- Letterman: `0f0a673396fac81d0149fac486adad8b82da3b928c0444b733a28daeb1443047`

---

*Last updated: March 10, 2026*
