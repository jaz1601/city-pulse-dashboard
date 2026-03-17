#!/usr/bin/env python3
"""
Get detailed information about a specific lead page
"""
import argparse
import json
import sys
from mintbird_client import MintBirdLeadPages


def main():
    parser = argparse.ArgumentParser(
        description='Get detailed information about a lead page'
    )
    parser.add_argument(
        '--api-key',
        help='MintBird API key (or set MINTBIRD_API_KEY env var)'
    )
    parser.add_argument(
        '--page-id',
        required=True,
        type=int,
        help='Lead page ID'
    )
    parser.add_argument(
        '--json-output',
        action='store_true',
        help='Output raw JSON response'
    )
    
    args = parser.parse_args()
    
    try:
        client = MintBirdLeadPages(api_key=args.api_key)
        page = client.get_page(args.page_id)
        
        if not page:
            print(f"Lead page {args.page_id} not found.")
            sys.exit(1)
        
        if args.json_output:
            print(json.dumps(page, indent=2))
        else:
            print(f"\n{'='*60}")
            print(f"LEAD PAGE DETAILS")
            print(f"{'='*60}")
            
            print(f"\nBasic Information:")
            print(f"  ID: {page.get('id')}")
            print(f"  Name: {page.get('name')}")
            print(f"  Status: {'Active' if page.get('status') else 'Inactive'}")
            print(f"  Created: {page.get('created_at')}")
            print(f"  Updated: {page.get('updated_at')}")
            
            print(f"\nPerformance:")
            views = page.get('views', 0)
            leads = page.get('leads', 0)
            print(f"  Views: {views}")
            print(f"  Leads: {leads}")
            if views > 0:
                conversion = (leads / views) * 100
                print(f"  Conversion Rate: {conversion:.2f}%")
            
            print(f"\nConfiguration:")
            print(f"  Category ID: {page.get('category_id')}")
            print(f"  Template ID: {page.get('template_id')}")
            print(f"  URL Path: {page.get('url_path')}")
            
            if page.get('title'):
                print(f"\nContent:")
                print(f"  Title: {page.get('title')}")
                content = page.get('content', '')
                if content:
                    # Truncate long content
                    content_preview = content[:200] + '...' if len(content) > 200 else content
                    print(f"  Content Preview: {content_preview}")
            
            print(f"\n{'='*60}")
            
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
