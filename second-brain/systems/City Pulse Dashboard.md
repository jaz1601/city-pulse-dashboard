# City Pulse Article Dashboard

## Overview
Web-based dashboard for managing articles across all three City Pulse publications (Cape Town, Pretoria, Johannesburg).

## Features

### 📊 Article Management
- **Create Articles:** Form-based article creation with all fields
- **Edit Articles:** Modify existing articles
- **Delete Articles:** Remove articles with confirmation
- **Organize by City:** Filter articles by city or view all

### 🏙️ City Support
- Cape Town City Pulse
- Pretoria City Pulse  
- Johannesburg City Pulse

### 📥 Drag & Drop Export
- Drag any article to the drop zone
- Automatically generates Letterman API JSON
- Copy-paste ready for API calls
- Includes correct storageId for each city

### 💾 Data Storage
- Uses browser localStorage
- Data persists between sessions
- No server database required

## Access

**Local URL:** http://localhost:3000

**File Location:**
```
/root/.openclaw/workspace/dashboard/index.html
/root/.openclaw/workspace/dashboard/server.js
```

## How to Use

### 1. View Articles
- Click city name in sidebar to filter
- Click "All Cities" to see everything
- Stats show total, drafts, and published counts

### 2. Create New Article
- Click "+ New Article" button
- Select city from dropdown
- Fill in headline, subheadline, content
- Add keywords (comma-separated)
- Add summary for preview
- Click "Save Article"

### 3. Export to Letterman
**Method 1 - Drag & Drop:**
1. Drag article card to drop zone
2. JSON automatically generates
3. Click "Copy to Clipboard"
4. Use in your API call

**Method 2 - Export Button:**
1. Click "Export" on any article
2. JSON appears in export panel
3. Copy and use

### 4. Edit Article
- Click "Edit" on any article
- Form pre-fills with current data
- Make changes
- Save (old version is replaced)

### 5. Delete Article
- Click "Delete" on any article
- Confirm deletion
- Article removed permanently

## JSON Export Format

Example export for Letterman API:
```json
{
  "storageId": "69b8f1f847872b28b4e44ff5",
  "type": "ARTICLE",
  "articleOptions": {
    "contentFrom": "CONTENT",
    "keepOriginal": true,
    "headline": "Article Title",
    "subHeadline": "Article Subtitle",
    "content": "<p>HTML content...</p>",
    "keywords": ["keyword1", "keyword2"],
    "summary": {
      "title": "Summary Title",
      "description": "Summary description",
      "content": "<p>Summary HTML</p>"
    }
  }
}
```

## Starting the Dashboard

```bash
cd /root/.openclaw/workspace/dashboard
node server.js
```

Then open http://localhost:3000 in your browser.

## Pre-loaded Articles

Dashboard comes with 3 sample articles:
1. Cape Town - Waterfront Development
2. Pretoria - Smart City Initiative
3. Johannesburg - Green Spaces Project

## Future Enhancements

- [ ] Direct API integration (publish straight to Letterman)
- [ ] Image upload support
- [ ] Article templates
- [ ] Bulk export
- [ ] Publishing schedule
- [ ] Analytics dashboard

---

*Created: March 17, 2026*
*Related: [[Projects/City Pulse Network]], [[Knowledge/Letterman AI API Skill]]*