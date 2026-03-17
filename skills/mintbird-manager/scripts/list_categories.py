#!/usr/bin/env python3
"""
List all categories in your MintBird account
"""
import argparse
import json
import sys
from mintbird_client import MintBirdCategories


def main():
    parser = argparse.ArgumentParser(
        description='List all categories in your MintBird account'
    )
    parser.add_argument(
        '--api-key',
        help='MintBird API key (or set MINTBIRD_API_KEY env var)'
    )
    parser.add_argument(
        '--format',
        choices=['table', 'json'],
        default='table',
        help='Output format'
    )
    
    args = parser.parse_args()
    
    try:
        client = MintBirdCategories(api_key=args.api_key)
        categories = client.list_categories()
        
        if not categories:
            print("No categories found in your account.")
            return
        
        if args.format == 'json':
            print(json.dumps(categories, indent=2))
        else:
            print(f"\n{'ID':<8} {'Name':<30} {'Type':<10}")
            print("-" * 50)
            
            for cat in categories:
                cid = cat.get('id', 'N/A')
                name = cat.get('name', 'Unnamed')[:28]
                ctype = cat.get('type', 'N/A')
                
                print(f"{cid:<8} {name:<30} {ctype:<10}")
            
            print(f"\nTotal categories: {len(categories)}")
            
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
