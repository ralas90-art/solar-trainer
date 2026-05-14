---
name: firecrawl-scraper
description: Scrapes a website using Firecrawl to extract brand identity, colors, typography, images, and content.
---

# Firecrawl Scraper Skill

This skill allows you to scrape a website to gather comprehensive information for rebuilding or analyzing its design and content. It uses the Firecrawl API.

## Prerequisites

- Python 3 installed.
- `firecrawl-py` installed: `pip install firecrawl-py`
- Firecrawl API Key set in `FIRECRAWL_API_KEY` environment variable.

## Usage

Run the python script `scrape.py` located in this directory.

```bash
python scrape.py <url> [--output <path/to/output.json>]
```

### Example

```bash
python scrape.py https://example.com --output example_brand_data.json
```

## Output

The script returns a JSON object containing:
- `branding`: Colors, fonts, typography, button styles, etc.
- `markdown`: The text content of the page in Markdown.
- `screenshot`: A URL to a screenshot of the page.
- `links`: A list of links found on the page.
