import os
import sys
import json
import argparse
from firecrawl import Firecrawl

def scrape_website(url, api_key=None, output_file=None):
    if not api_key:
        api_key = os.environ.get("FIRECRAWL_API_KEY")
    
    if not api_key:
        print("Error: FIRECRAWL_API_KEY not found in environment variables and not provided.")
        sys.exit(1)
        
    try:
        app = Firecrawl(api_key=api_key)
        
        # Scrape with branding, markdown, screenshot, and links
        print(f"Scraping {url}...")
        data = app.scrape(
            url,
            formats=['branding', 'markdown', 'screenshot', 'links']
        )
        
        # The SDK might return the data directly or wrapped. 
        # Based on docs: "SDKs will return the data object directly"
        # So 'data' is the object.
        

        # Helper to convert objects (like Pydantic models) to dicts
        def recursive_to_dict(obj):
            if hasattr(obj, 'model_dump'):
                return obj.model_dump()
            if hasattr(obj, 'dict'):
                return obj.dict()
            if hasattr(obj, '__dict__'):
                return obj.__dict__
            if isinstance(obj, list):
                return [recursive_to_dict(i) for i in obj]
            return obj

        serializable_data = recursive_to_dict(data)

        result = {
            "success": True,
            "data": serializable_data
        }

        if output_file:
            # Ensure directory exists
            output_dir = os.path.dirname(output_file)
            if output_dir and not os.path.exists(output_dir):
                os.makedirs(output_dir)
                
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, default=str)
            print(f"Scrape results saved to {output_file}")
        else:
            print(json.dumps(result, indent=2, default=str))
            
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Scrape a website using Firecrawl.")
    parser.add_argument("url", help="The URL to scrape.")
    parser.add_argument("--api-key", help="Firecrawl API Key (optional if env var set).")
    parser.add_argument("--output", help="Output file path (JSON).")
    
    args = parser.parse_args()
    
    scrape_website(args.url, args.api_key, args.output)
