#!/usr/bin/env python3
"""
Clone an existing MintBird lead page
"""
import argparse
import json
import sys
from mintbird_client import MintBirdLeadPages


def main():
    parser = argparse.ArgumentParser(
        description='Clone an existing MintBird lead page'
    )
    parser.add_argument(
        '--api-key',
        help='MintBird API key (or set MINTBIRD_API_KEY env var)'
    )
    parser.add_argument(
        '--source-page-id',
        required=True,
        type=int,
        help='Page ID to clone'
    )
    parser.add_argument(
        '--new-name',
        required=True,
        help='Name for the new page'
    )
    parser.add_argument(
        '--new-category-id',
        type=int,
        help='Different category for new page (optional)'
    )
    parser.add_argument(
        '--update-title',
        help='Update the headline/title'
    )
    parser.add_argument(
        '--json-output',
        action='store_true',
        help='Output raw JSON'
    )
    
    args = parser.parse_args()
    
    try:
        client = MintBirdLeadPages(api_key=args.api_key)
        
        # Get source page
        print(f"Fetching source page {args.source_page_id}...")
        source = client.get_page(args.source_page_id)
        
        if not source:
            print(f"Source page {args.source_page_id} not found.")
            sys.exit(1)
        
        print(f"✓ Source: {source.get('name')}")
        print(f"  Template: {source.get('template_id')}")
        print(f"  Category: {source.get('category_id')}")
        
        # Prepare clone data
        category_id = args.new_category_id or source.get('category_id')
        title = args.update_title or source.get('title')
        
        print(f"\nCreating clone: {args.new_name}...")
        
        result = client.create_page(
            name=args.new_name,
            category_id=category_id,
            template_id=source.get('template_id', 1),
            title=title,
            content=source.get('content', '')
        )
        
        if args.json_output:
            print(json.dumps(result, indent=2))
        else:
            if result.get('status'):
                data = result.get('data', {})
                print(f"\n✅ Page cloned successfully!")
                print(f"\nOriginal: {source.get('name')} (ID: {source.get('id')})")
                print(f"Clone: {data.get('name')} (ID: {data.get('id')})")
                print(f"\nNew URL: {data.get('full_url')}")
                print(f"\nNext steps:")
                print(f"  1. Customize the cloned page")
                print(f"  2. Update content as needed")
                print(f"  3. Test before publishing")
                print(f"  4. Publish when ready")
            else:
                print(f"\n❌ Failed to clone page")
                print(f"   Error: {result.get('message')}")
                
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
