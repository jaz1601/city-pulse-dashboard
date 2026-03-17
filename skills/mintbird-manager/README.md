# MintBird Manager Skill

A comprehensive OpenClaw skill for managing sales funnels, products, and checkouts on the MintBird (PopLinks) platform.

## 🎯 Overview

This skill enables AI agents to programmatically manage:

- ✅ **Products** - Create, update, delete digital products
- ✅ **Lead Pages** - Build and manage opt-in pages
- ✅ **Categories** - Organize products and pages
- ✅ **Templates** - Access page design templates
- 🔄 **Orders** - Track sales and customer data (coming soon)
- 🔄 **Analytics** - View performance metrics (coming soon)

## 📁 Structure

```
mintbird-manager/
├── SKILL.md                    # Main skill documentation
├── README.md                   # This file
├── scripts/
│   ├── setup.py               # Installation and setup
│   ├── mintbird_client.py     # Core API client library
│   ├── list_products.py       # List all products
│   ├── create_product.py      # Create new product
│   ├── update_product.py      # Update existing product
│   ├── delete_product.py      # Delete product
│   ├── list_lead_pages.py     # List all lead pages
│   ├── get_lead_page.py       # Get page details
│   ├── create_lead_page.py    # Create new lead page
│   ├── update_lead_page.py    # Update lead page
│   ├── delete_lead_page.py    # Delete lead page
│   ├── list_categories.py     # List categories
│   ├── create_category.py     # Create category
│   └── list_templates.py      # List templates
└── references/
    ├── endpoints.md           # API endpoint reference
    └── schemas.md             # Data structure schemas
```

## 🚀 Quick Start

### 1. Setup

```bash
cd /root/.openclaw/workspace/skills/mintbird-manager
python scripts/setup.py
```

### 2. Configure API Key

```bash
export MINTBIRD_API_KEY="your_api_key_here"
```

Or pass `--api-key` to individual scripts.

### 3. Test Connection

```bash
python scripts/list_products.py
```

## 📖 Common Tasks

### Product Management

```bash
# List all products
python scripts/list_products.py

# Create a product
python scripts/create_product.py \
  --name "Digital Income Starter Kit" \
  --price 49.00 \
  --description "Complete guide to building digital income"

# Update a product
python scripts/update_product.py \
  --product-id 1745 \
  --price 59.00 \
  --status active

# Delete a product
python scripts/delete_product.py --product-id 1745
```

### Lead Page Management

```bash
# List all lead pages
python scripts/list_lead_pages.py

# View page details
python scripts/get_lead_page.py --page-id 14310

# Create a lead page
python scripts/create_lead_page.py \
  --name "Free Guide Opt-in" \
  --category-id 1919 \
  --title "Get Your Free Guide" \
  --content "<p>Enter your email...</p>"

# Update a lead page
python scripts/update_lead_page.py \
  --page-id 14310 \
  --title "New Headline"

# Delete a lead page
python scripts/delete_lead_page.py --page-id 14310
```

### Category Management

```bash
# List categories
python scripts/list_categories.py

# Create a category
python scripts/create_category.py \
  --name "Digital Products" \
  --type NICHE
```

## 🔧 API Client Usage

For programmatic access, use the `MintBirdAPI` client:

```python
from scripts.mintbird_client import MintBirdProducts, MintBirdLeadPages

# Initialize client
products = MintBirdProducts(api_key="your_key")

# List products
all_products = products.list_products()

# Create product
new_product = products.create_product(
    name="My Product",
    price=49.00,
    description="Product description"
)

# Lead pages
pages = MintBirdLeadPages(api_key="your_key")
page = pages.get_page(14310)
```

## 📊 Data Schemas

See `references/schemas.md` for complete object definitions:

- **Product**: id, name, price, type, status, sales_count, revenue
- **LeadPage**: id, name, views, leads, status, url_path
- **Category**: id, name, type, domain_id
- **Template**: id, name, category, settings

## 🔐 Authentication

The skill uses Bearer token authentication:

```
Authorization: Bearer {your_api_key}
```

**Getting your API key:**
1. Log into https://app.mintbird.com
2. Go to Settings → API Keys
3. Generate a new key
4. Store securely (use environment variables)

## ⚙️ Configuration

### Environment Variables

```bash
export MINTBIRD_API_KEY="your_api_key"
```

### Script Arguments

All scripts support:
- `--api-key`: Override environment variable
- `--json-output`: Output raw JSON
- `--help`: Show usage information

## 🐛 Error Handling

Scripts include comprehensive error handling:

- **401**: Invalid API key
- **404**: Resource not found
- **422**: Validation error
- **429**: Rate limited (auto-retry)
- **500**: Server error

## 📈 Rate Limits

- **Standard**: 100 requests/minute
- **Burst**: 10 requests/second
- Scripts include automatic retry with exponential backoff

## 📝 Best Practices

1. **Use environment variables** for API keys
2. **Test in sandbox** when available
3. **Organize with categories** for easier management
4. **Monitor analytics** to optimize performance
5. **Backup configurations** before major changes

## 🔄 Future Enhancements

Planned features:
- Order management and tracking
- Sales analytics and reporting
- Funnel builder with upsell/downsell
- Customer management
- Webhook integration
- Bulk operations

## 📚 Documentation

- `SKILL.md` - Complete skill documentation
- `references/endpoints.md` - API endpoint reference
- `references/schemas.md` - Data structure schemas

## 🤝 Support

For issues:
1. Check API key is valid
2. Verify rate limits not exceeded
3. Review error messages carefully
4. Contact MintBird support with error details

## 📄 License

This skill is provided as-is for use with OpenClaw and the MintBird platform.

---

**Version:** 1.0.0  
**Author:** Denise  
**Last Updated:** 2026-03-12
