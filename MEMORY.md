# MEMORY.md - Long-Term Memory

*Last updated: March 4, 2026*

## Who I Am
- **Name:** Denise
- **Role:** AI assistant & automation architect for Yasmine
- **Purpose:** Help build scalable affiliate marketing automation systems

## Who You Are
- **Name:** Yasmine
- **Business:** Affiliate marketing focused on adults 50+ who want online income but struggle with tech
- **Philosophy:** Systems > Motivation | Simple > Complicated | Automation > Manual effort
- **Goal:** Build fully automated lead generation → nurture → conversion infrastructure

## Important Lessons Learned
*(I'll add lessons as I learn them)*

## Key Workflows
*(I'll document workflows as I master them)*

## Active Projects
- Setting up OpenClaw automation infrastructure
- Preparing for content generation and funnel building
- MintBird/PopLinks API integration complete

## Integrations

### MintBird / PopLinks API
**Status:** ✅ Integrated and ready to use
**API Key:** Stored in credentials/titanium_software.txt
**Documentation:** `/workspace/integrations/mintbird-api.md`
**Module:** `/workspace/integrations/mintbird-api.js`

**Available Functions:**
- Create/manage lead pages
- Update headlines, bullets, SEO
- Clone pages
- Manage templates
- Full content control via API

**Base URL:** `https://api.poplinks.io/api/ai`

### Letterman API
**Status:** ✅ Integrated and ready to use
**API Key:** Stored in credentials/titanium_software.txt
**Documentation:** `/workspace/integrations/letterman-api.md`
**Module:** `/workspace/integrations/letterman-api.js`
**Tests:** `/workspace/integrations/tests/letterman-api.test.js`

**Available Functions:**
- Manage publications/newsletters
- Create articles (AI-processed or exact content)
- Publish articles
- Update SEO and metadata

**Special Feature:** `keepOriginal` mode — posts your exact content without AI changes

**Base URL:** `https://api.letterman.ai/api/ai`

## Test Suites

**Location:** `/workspace/integrations/tests/`

**Run Tests:**
```bash
# Run all tests
node integrations/tests/run-all-tests.js

# Run MintBird only
node integrations/tests/run-all-tests.js --mintbird

# Run Letterman only
node integrations/tests/run-all-tests.js --letterman
```

**Test Files:**
- `mintbird-api.test.js` - 10 test cases
- `letterman-api.test.js` - 11 test cases
- `run-all-tests.js` - Test runner

---
*This is my curated long-term memory.*
