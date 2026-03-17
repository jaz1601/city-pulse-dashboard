# MintBird API Endpoints Reference

Base URL: `https://api.poplinks.io/api/ai`

Authentication: Bearer Token in Authorization header

---

## Products

### List Products
```
GET /products
```

**Response:** Array of Product objects

---

### Get Product
```
GET /products/{id}
```

**Parameters:**
- `id` (path): Product ID

**Response:** Product object

---

### Create Product
```
POST /products
```

**Request Body:**
```json
{
  "name": "Product Name",
  "price": 49.00,
  "type": "digital",
  "description": "Product description",
  "category_id": 1919,
  "status": "active"
}
```

**Required Fields:**
- `name`
- `price`

**Optional Fields:**
- `type` (default: "digital")
- `description`
- `category_id`
- `status` (default: "active")

**Response:** Created Product object

---

### Update Product
```
PUT /products/{id}
```

**Parameters:**
- `id` (path): Product ID

**Request Body:** Partial or complete Product object

**Response:** Updated Product object

---

### Delete Product
```
DELETE /products/{id}
```

**Parameters:**
- `id` (path): Product ID

**Response:** Success confirmation

---

## Lead Pages

### List Lead Pages
```
GET /lead-pages
```

**Response:** Array of LeadPage objects

---

### Get Lead Page
```
GET /lead-pages/{id}
```

**Parameters:**
- `id` (path): Lead page ID

**Response:** LeadPage object with full details

---

### Create Lead Page
```
POST /lead-pages
```

**Request Body:**
```json
{
  "name": "Page Name",
  "category_id": 1919,
  "template_id": 1,
  "title": "Page Headline",
  "content": "<p>Page content</p>"
}
```

**Required Fields:**
- `name`
- `category_id`

**Optional Fields:**
- `template_id` (default: 1)
- `title`
- `content`

**Response:** Created LeadPage object

---

### Update Lead Page
```
PUT /lead-pages/{id}
```

**Parameters:**
- `id` (path): Lead page ID

**Request Body:** Partial or complete LeadPage object

**Response:** Updated LeadPage object

---

### Delete Lead Page
```
DELETE /lead-pages/{id}
```

**Parameters:**
- `id` (path): Lead page ID

**Response:** Success confirmation

---

## Categories

### List Categories
```
GET /categories
```

**Response:** Array of Category objects

---

### Create Category
```
POST /categories
```

**Request Body:**
```json
{
  "name": "Category Name",
  "type": "NICHE"
}
```

**Required Fields:**
- `name`

**Optional Fields:**
- `type` (default: "NICHE", options: "NICHE", "LOCAL")

**Response:** Created Category object

---

## Templates

### List Templates
```
GET /templates
```

**Response:** Array of Template objects

---

### Get Template
```
GET /templates/{id}
```

**Parameters:**
- `id` (path): Template ID

**Response:** Template object

---

## Orders (Future Implementation)

### List Orders
```
GET /orders
```

**Query Parameters:**
- `status`: Filter by status
- `start_date`: Filter from date
- `end_date`: Filter to date
- `page`: Page number
- `per_page`: Items per page

**Response:** Array of Order objects

---

### Get Order
```
GET /orders/{id}
```

**Parameters:**
- `id` (path): Order ID

**Response:** Order object with full details

---

## Analytics (Future Implementation)

### Get Page Stats
```
GET /analytics/pages/{id}
```

**Parameters:**
- `id` (path): Page ID
- `start_date` (query): Start date
- `end_date` (query): End date

**Response:** Analytics data object

---

### Get Funnel Stats
```
GET /analytics/funnels/{id}
```

**Parameters:**
- `id` (path): Funnel ID
- `start_date` (query): Start date
- `end_date` (query): End date

**Response:** Funnel analytics data

---

## User Information

### Get Current User
```
GET /user
```

**Response:** User object with account details

---

## Error Responses

### 401 Unauthorized
```json
{
  "status": false,
  "message": "Unauthorized",
  "error": "Invalid API key"
}
```

### 404 Not Found
```json
{
  "status": false,
  "message": "Resource not found",
  "error": "The requested resource does not exist"
}
```

### 422 Validation Error
```json
{
  "status": false,
  "message": "Validation failed",
  "errors": {
    "name": ["The name field is required"],
    "price": ["The price must be a positive number"]
  }
}
```

### 429 Rate Limited
```json
{
  "status": false,
  "message": "Too many requests",
  "retry_after": 60
}
```

---

## Notes

- All timestamps are in UTC
- All monetary values are in USD
- Boolean values should be sent as `true`/`false` (JSON boolean)
- HTML content is supported in page content fields
- Rate limits: 100 requests/minute, 10 requests/second burst
