---
name: mintbird-manager
description: "FULLY FUNCTIONAL: Create, edit, and publish sales funnels, lead pages, and products on app.mintbird.com. Use for: building complete funnels, writing sales copy, managing products, and launching pages live."
version: 2.0.0
author: Denise
capabilities: [create, read, update, delete, publish]
---

# MintBird Manager Skill

**STATUS: FULLY OPERATIONAL** ✅

This skill provides **complete** management of sales funnels, lead pages, and products on the MintBird platform. Not read-only — **FULL CREATE, EDIT, AND PUBLISH capabilities**.

## Overview

MintBird (PopLinks) is a platform for creating sales funnels, lead pages, and digital product checkouts. This skill enables AI agents to:

- **Product Management**: Create, update, delete, and list digital products
- **Funnel Management**: Create and manage sales funnels with upsell/downsell flows
- **Lead Page Management**: Create and manage lead capture pages
- **Checkout Configuration**: Set up checkout templates and payment processing
- **Order Tracking**: Retrieve sales data and customer information
- **Analytics**: Track page views, conversions, and revenue

## Authentication

### API Key Setup

The skill uses Bearer token authentication with your MintBird API key.

**Environment Variable (Recommended):**
```bash
export MINTBIRD_API_KEY="your_api_key_here"
```

**Direct Usage:**
Pass the API key directly to scripts using the `--api-key` flag.

### Getting Your API Key

1. Log into your MintBird account at https://app.mintbird.com
2. Navigate to Settings → API Keys
3. Generate a new API key
4. Copy and store securely

## API Base URL

```
https://api.poplinks.io/api/ai
```

## 🚀 FULL CAPABILITY WORKFLOWS

### 1. CREATE LEAD PAGES WITH SALES COPY

#### Create Complete Sales Page (Auto-Generated Copy)
```bash
python scripts/create_sales_page.py \
  --name "Digital Income Opt-in" \
  --category-id 1919 \
  --page-type optin \
  --topic "Digital Income" \
  --benefit "earn your first $1,000 online" \
  --video-url "https://youtube.com/embed/xyz"
```

**Page Types Available:**
- `optin` — Free guide/report opt-in
- `webinar` — Webinar registration
- `challenge` — 5-day challenge signup

#### Clone Existing Page
```bash
python scripts/clone_page.py \
  --source-page-id 14310 \
  --new-name "Powerplay V3" \
  --update-title "New Improved Headline"
```

---

### 2. WRITE & UPDATE SALES COPY

#### Update Headlines & Content
```bash
python scripts/update_sales_copy.py \
  --page-id 14310 \
  --headline "New Attention-Grabbing Headline" \
  --seo-title "SEO Optimized Title" \
  --seo-description "Meta description for search engines"
```

---

### 3. CONFIGURE FUNNELS

#### Build Complete Sales Funnel
```bash
python scripts/configure_funnel.py \
  --funnel-name "Main Product Funnel" \
  --optin-page-id 14310 \
  --product-id 1745 \
  --upsell-page-id 14311 \
  --upsell-product-id 1746 \
  --email-service convertkit \
  --list-id "abc123" \
  --tag "main-funnel" \
  --tag "buyers"
```

---

### 4. PUBLISH PAGES LIVE

#### Publish Page
```bash
python scripts/publish_page.py \
  --page-id 14310 \
  --seo-title "Your SEO Title" \
  --seo-description "Your meta description"
```

**Output:** Live URL you can immediately share

---

### 5. PRODUCT MANAGEMENT

#### Create Product
```bash
python scripts/create_product.py \
  --name "Digital Income Starter Kit" \
  --price 49.00 \
  --type digital \
  --description "Complete guide to building digital income streams"
```

#### Update Product
```bash
python scripts/update_product.py \
  --product-id 1745 \
  --price 59.00 \
  --status active
```

#### Delete Product
```bash
python scripts/delete_product.py --product-id 1745
```

---

### 6. UTILITY OPERATIONS

#### List All Lead Pages
```bash
python scripts/list_lead_pages.py
```

#### Get Page Details
```bash
python scripts/get_lead_page.py --page-id 14310
```

#### List Categories
```bash
python scripts/list_categories.py
```

#### Create Category
```bash
python scripts/create_category.py --name "Digital Products"
```

#### List Templates
```bash
python scripts/list_templates.py
```

## Data Schemas

See `references/schemas.md` for complete object definitions:

- **Product Object**: id, name, price, type, status, etc.
- **LeadPage Object**: id, name, views, leads, template, etc.
- **Funnel Object**: id, name, steps, conversion rates, etc.
- **Order Object**: id, customer, products, total, status, etc.
- **Category Object**: id, name, type, domain association

## Error Handling

All scripts include comprehensive error handling:

- **401 Unauthorized**: Invalid or expired API key
- **404 Not Found**: Resource doesn't exist
- **422 Validation Error**: Invalid data provided
- **429 Rate Limited**: Too many requests
- **500 Server Error**: MintBird server issue

### Common Error Responses

```json
{
  "status": false,
  "message": "Error description",
  "errors": {
    "field": ["error details"]
  }
}
```

## Best Practices

1. **Always test in sandbox first** when available
2. **Use categories** to organize products and pages
3. **Track analytics** regularly to optimize funnels
4. **Backup configurations** before major changes
5. **Monitor rate limits** - implement retries with backoff

## Rate Limiting

- Default: 100 requests per minute
- Burst: 10 requests per second
- Scripts include automatic retry logic

## Security Notes

- Never commit API keys to version control
- Use environment variables for sensitive data
- Rotate API keys regularly
- Monitor API usage for unauthorized access

## Troubleshooting

### API Key Not Working
- Verify key is active in MintBird dashboard
- Check for extra spaces or characters
- Ensure proper Bearer token format

### Pages Not Showing
- Verify correct category ID
- Check page status (active vs inactive)
- Confirm user permissions

### Orders Missing
- Check date range parameters
- Verify timezone settings
- Confirm order status filters

## Support

For API issues:
1. Check MintBird status page
2. Review API documentation
3. Contact MintBird support with error details

## Changelog

### v2.0.0 - FULL OPERATIONAL CAPABILITY
- ✅ **CREATE** lead pages with auto-generated sales copy
- ✅ **WRITE** sales copy (headlines, bullets, CTAs)
- ✅ **CONFIGURE** complete sales funnels
- ✅ **PUBLISH** pages live
- ✅ **CLONE** existing pages
- ✅ **UPDATE** sales copy dynamically
- ✅ Product management (CRUD)
- ✅ Lead page management (CRUD)
- ✅ Category management
- ✅ Template listing

### v1.0.0
- Initial release
- Read-only discovery
- Basic product/lead page listing
