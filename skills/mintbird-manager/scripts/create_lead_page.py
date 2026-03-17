#!/usr/bin/env python3
"""
Create a new lead page in MintBird
"""
import argparse
import json
import sys
from mintbird_client import MintBirdLeadPages, MintBirdCategories


def main():
    parser = argparse.ArgumentParser(
        description='Create a new lead page in MintBird'
    )
    parser.add_argument(
        '--api-key',
        help='MintBird API key (or set MINTBIRD_API_KEY env var)'
    )
    parser.add_argument(
        '--name',
        required=True,
        help='Lead page name'
    )
    parser.add_argument(
        '--category-id',
        required=True,
        type=int,
        help='Category ID to assign page to'
    )
    parser.add_argument(
        '--template-id',
        type=int,
        default=1,
        help='Template style ID (default: 1)'
    )
    parser.add_argument(
        '--title',
        default='',
        help='Page headline/title'
    )
    parser.add_argument(
        '--content',
        default='',
        help='Page body content (HTML allowed)'
    )
    parser.add_argument(
        '--list-categories',
        action='store_true',
        help='List available categories and exit'
    )
    parser.add_argument(
        '--json-output',
        action='store_true',
        help='Output raw JSON response'
    )
    
    args = parser.parse_args()
    
    try:
        # List categories if requested
        if args.list_categories:
            cat_client = MintBirdCategories(api_key=args.api_key)
            categories = cat_client.list_categories()
            
            print("\nAvailable Categories:")
            print(f"{'ID':<8} {'Name':<30} {'Type':<10}")
            print("-" * 50)
            for cat in categories:
                print(f"{cat.get('id', 'N/A'):<8} {cat.get('name', 'Unnamed'):<30} {cat.get('type', 'N/A'):<10}")
            return
        
        client = MintBirdLeadPages(api_key=args.api_key)
        
        print(f"Creating lead page: {args.name}...")
        
        result = client.create_page(
            name=args.name,
            category_id=args.category_id,
            template_id=args.template_id,
            title=args.title,
            content=args.content
        )
        
        if args.json_output:
            print(json.dumps(result, indent=2))
        else:
            if result.get('status'):
                data = result.get('data', {})
                print(f"\n✓ Lead page created successfully!")
                print(f"  ID: {data.get('id')}")
                print(f"  Name: {data.get('name')}")
                print(f"  URL Path: {data.get('url_path')}")
                print(f"  Full URL: {data.get('full_url')}")
                print(f"\nNext steps:")
                print(f"  1. Customize the page content")
                print(f"  2. Set up email integration")
                print(f"  3. Test the opt-in flow")
            else:
                print(f"\n✗ Failed to create lead page")
                print(f"  Error: {result.get('message')}")
                
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
