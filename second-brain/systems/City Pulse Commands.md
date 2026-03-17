# City Pulse Command Reference

## Available Commands for Denise

### 1. 📍 City Filter
**Command:** `/filter_city`

**Usage:**
```
/filter_city City: Cape Town
```

**Returns:**
- News
- Events
- Local Business
- Feel Good Stories
- Deals

---

### 2. 🏷️ Content Tagging
**Command:** `/tag_content`

**Usage:**
```
/tag_content

Article:
[PASTE CONTENT]
```

**Returns:**
- City
- Content Type (News, Event, Business, Feel Good, Deal)
- Suggested Newsletter Section

---

### 3. 📊 Status Management
**Command:** `/update_status`

**Usage:**
```
/update_status
Content Title: Waterfront Development
Change status to: Approved
```

**Returns:** Confirmation + pipeline summary

---

### 4. 📰 Newsletter Builder
**Command:** `/build_newsletter`

**Usage:**
```
/build_newsletter
City: Cape Town
Date: March 20, 2026
```

**Structure:**
1. Top Story
2. Local News
3. Events This Week
4. Business Spotlight
5. Feel Good Story
6. Deals / Promotions

---

### 5. 📅 Scheduling
**Command:** `/schedule_newsletter`

**Usage:**
```
/schedule_newsletter
City: Cape Town
Date: March 20, 2026
Time: 09:00 AM
```

---

### 6. ✏️ AI Rewrite
**Command:** `/rewrite`

**Usage:**
```
/rewrite
Instruction: Make more engaging
Content:
[PASTE CONTENT]
```

---

### 7. 📈 Performance Report
**Command:** `/performance_report`

**Usage:**
```
/performance_report
City: Cape Town
Time Period: Last 30 days
```

**Returns:**
- Open rates
- Click rates
- Top topics
- Improvement suggestions

---

### 8. 💰 Revenue Tracker
**Command:** `/revenue_tracker`

**Usage:**
```
/revenue_tracker
City: Cape Town
```

**Tracks:**
- Sponsored posts
- Affiliate links
- Local ads

---

### 9. 🏪 Business Directory
**Commands:**
- `/add_business` - Add new business
- `/get_businesses` - List businesses

**Usage:**
```
/add_business
Business Name: Joe's Coffee
Category: Food & Drink
City: Cape Town
Contact: info@joescoffee.co.za

/get_businesses
City: Cape Town
Category: Food & Drink
```

---

### 10. 💡 Content Ideas
**Command:** `/generate_ideas`

**Usage:**
```
/generate_ideas
City: Cape Town
```

**Returns:** 10 newsletter content ideas

---

## Quick Reference Card

| Command | Purpose |
|---------|---------|
| `/filter_city` | View content by city |
| `/tag_content` | Auto-categorize articles |
| `/update_status` | Manage content pipeline |
| `/build_newsletter` | Compile newsletter |
| `/schedule_newsletter` | Schedule sending |
| `/rewrite` | AI content improvement |
| `/performance_report` | Analytics & insights |
| `/revenue_tracker` | Monetization tracking |
| `/add_business` | Business directory |
| `/generate_ideas` | Content inspiration |

---

*Command System v1.0 - March 17, 2026*