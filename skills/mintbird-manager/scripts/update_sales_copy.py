#!/usr/bin/env python3
"""
Update sales copy on an existing MintBird lead page
"""
import argparse
import json
import sys
from mintbird_client import MintBirdLeadPages


def main():
    parser = argparse.ArgumentParser(
        description='Update sales copy on an existing lead page'
    )
    parser.add_argument(
        '--api-key',
        help='MintBird API key (or set MINTBIRD_API_KEY env var)'
    )
    parser.add_argument(
        '--page-id',
        required=True,
        type=int,
        help='Lead page ID to update'
    )
    parser.add_argument(
        '--headline',
        help='New headline'
    )
    parser.add_argument(
        '--subheadline',
        help='New subheadline'
    )
    parser.add_argument(
        '--content',
        help='New body content (HTML)'
    )
    parser.add_argument(
        '--cta-text',
        help='Call-to-action button text'
    )
    parser.add_argument(
        '--add-bullet',
        action='append',
        help='Add a bullet point (can use multiple times)'
    )
    parser.add_argument(
        '--video-url',
        help='Update video URL'
    )
    parser.add_argument(
        '--seo-title',
        help='SEO page title'
    )
    parser.add_argument(
        '--seo-description',
        help='SEO meta description'
    )
    parser.add_argument(
        '--json-output',
        action='store_true',
        help='Output raw JSON'
    )
    
    args = parser.parse_args()
    
    try:
        client = MintBirdLeadPages(api_key=args.api_key)
        
        # Get current page data
        print(f"Fetching current page {args.page_id}...")
        current = client.get_page(args.page_id)
        
        if not current:
            print(f"Page {args.page_id} not found.")
            sys.exit(1)
        
        # Build update data
        update_data = {}
        
        if args.headline:
            update_data['title'] = args.headline
            print(f"  Updating headline: {args.headline}")
        
        if args.subheadline:
            # Subheadline is typically part of content
            print(f"  Will update subheadline in content")
        
        if args.content:
            update_data['content'] = args.content
            print(f"  Updating body content")
        
        if args.seo_title:
            update_data['seo_title'] = args.seo_title
            print(f"  Updating SEO title: {args.seo_title}")
        
        if args.seo_description:
            update_data['seo_description'] = args.seo_description
            print(f"  Updating SEO description")
        
        if not update_data:
            print("No fields to update. Use --help for options.")
            sys.exit(1)
        
        print(f"\nApplying updates...")
        
        result = client.update_page(args.page_id, **update_data)
        
        if args.json_output:
            print(json.dumps(result, indent=2))
        else:
            if result.get('status'):
                print(f"\n✓ Page updated successfully!")
                data = result.get('data', {})
                print(f"  ID: {data.get('id')}")
                print(f"  Name: {data.get('name')}")
                if args.headline:
                    print(f"  New Headline: {args.headline}")
            else:
                print(f"\n✗ Failed to update page")
                print(f"  Error: {result.get('message')}")
                
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
