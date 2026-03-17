# MintBird API Data Schemas

This document describes the data structures used in the MintBird (PopLinks) API.

## Product Object

```json
{
  "id": 1745,
  "name": "The Digital Empire",
  "description": "Complete digital income system",
  "price": 49.00,
  "type": "digital",
  "status": "active",
  "category_id": 1919,
  "user_id": 18846,
  "image_url": "https://example.com/image.jpg",
  "sales_count": 0,
  "revenue": 0.00,
  "created_at": "2025-10-30T12:00:00.000000Z",
  "updated_at": "2025-10-30T12:00:00.000000Z"
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique product identifier |
| `name` | string | Product name (required) |
| `description` | string | Product description |
| `price` | float | Product price in USD |
| `type` | string | Product type: `digital` or `physical` |
| `status` | string | Product status: `active` or `inactive` |
| `category_id` | integer | Associated category ID |
| `user_id` | integer | Owner user ID |
| `image_url` | string | Product image URL |
| `sales_count` | integer | Number of sales |
| `revenue` | float | Total revenue generated |
| `created_at` | datetime | Creation timestamp |
| `updated_at` | datetime | Last update timestamp |

---

## Lead Page Object

```json
{
  "id": 14310,
  "name": "OLSP Webinar",
  "title": "Free Webinar: How to Build Digital Income",
  "content": "<p>Join our free webinar...</p>",
  "user_id": 18846,
  "category_id": 1919,
  "template_id": 1,
  "views": 8,
  "leads": 0,
  "status": true,
  "url_path": "olsp-webinar",
  "full_url": "https://redeyedeal.com/l/olsp-webinar",
  "created_at": "2025-11-28T10:00:00.000000Z",
  "updated_at": "2025-11-28T10:00:00.000000Z"
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique page identifier |
| `name` | string | Page name (internal) |
| `title` | string | Page headline/title |
| `content` | string | Page body content (HTML) |
| `user_id` | integer | Owner user ID |
| `category_id` | integer | Associated category ID |
| `template_id` | integer | Template style ID |
| `views` | integer | Total page views |
| `leads` | integer | Total leads captured |
| `status` | boolean | Page active status |
| `url_path` | string | URL slug |
| `full_url` | string | Complete page URL |
| `created_at` | datetime | Creation timestamp |
| `updated_at` | datetime | Last update timestamp |

---

## Category Object

```json
{
  "id": 1919,
  "name": "The Digital Empire",
  "type": "NICHE",
  "user_id": 18846,
  "domain_id": 2724,
  "created_at": "2025-10-30T12:12:13.000000Z",
  "updated_at": "2025-10-30T12:12:13.000000Z"
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique category identifier |
| `name` | string | Category name |
| `type` | string | Category type: `NICHE` or `LOCAL` |
| `user_id` | integer | Owner user ID |
| `domain_id` | integer | Associated domain ID |
| `created_at` | datetime | Creation timestamp |
| `updated_at` | datetime | Last update timestamp |

### Category Types

- **NICHE**: For niche/interest-based organizations
- **LOCAL**: For location-based organizations

---

## Template Object

```json
{
  "id": 1,
  "name": "Classic Opt-in",
  "category": "Lead Generation",
  "thumbnail": "https://example.com/thumb.jpg",
  "settings": {
    "show_header": true,
    "show_footer": true,
    "color_scheme": "default"
  }
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Template identifier |
| `name` | string | Template name |
| `category` | string | Template category |
| `thumbnail` | string | Preview image URL |
| `settings` | object | Template configuration |

---

## Order Object

```json
{
  "id": 98765,
  "order_number": "ORD-2026-001",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "products": [
    {
      "id": 1745,
      "name": "The Digital Empire",
      "price": 49.00,
      "quantity": 1
    }
  ],
  "subtotal": 49.00,
  "tax": 0.00,
  "total": 49.00,
  "status": "completed",
  "payment_method": "stripe",
  "created_at": "2026-03-12T10:00:00.000000Z"
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Order identifier |
| `order_number` | string | Human-readable order ID |
| `customer` | object | Customer details |
| `products` | array | Purchased products |
| `subtotal` | float | Subtotal before tax |
| `tax` | float | Tax amount |
| `total` | float | Final total |
| `status` | string | Order status |
| `payment_method` | string | Payment processor |
| `created_at` | datetime | Order timestamp |

### Order Status Values

- `pending`: Awaiting payment
- `completed`: Payment received, order fulfilled
- `refunded`: Order refunded
- `cancelled`: Order cancelled

---

## API Response Structure

### Success Response

```json
{
  "status": true,
  "message": "Operation successful",
  "data": {
    // Response data object or array
  }
}
```

### Error Response

```json
{
  "status": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Error message for this field"]
  }
}
```

---

## Common Query Parameters

### Pagination

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (default: 1) |
| `per_page` | integer | Items per page (default: 20, max: 100) |

### Filtering

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status |
| `category_id` | integer | Filter by category |
| `start_date` | date | Filter from date (YYYY-MM-DD) |
| `end_date` | date | Filter to date (YYYY-MM-DD) |

### Sorting

| Parameter | Type | Description |
|-----------|------|-------------|
| `sort_by` | string | Field to sort by |
| `sort_order` | string | `asc` or `desc` |

---

## Rate Limits

- **Standard**: 100 requests per minute
- **Burst**: 10 requests per second
- **Error Retry**: Exponential backoff recommended

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 422 | Validation Error |
| 429 | Rate Limited |
| 500 | Server Error |
