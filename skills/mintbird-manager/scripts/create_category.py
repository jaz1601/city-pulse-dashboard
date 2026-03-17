#!/usr/bin/env python3
"""
Create a new category in MintBird
"""
import argparse
import json
import sys
from mintbird_client import MintBirdCategories


def main():
    parser = argparse.ArgumentParser(
        description='Create a new category in MintBird'
    )
    parser.add_argument(
        '--api-key',
        help='MintBird API key (or set MINTBIRD_API_KEY env var)'
    )
    parser.add_argument(
        '--name',
        required=True,
        help='Category name'
    )
    parser.add_argument(
        '--type',
        choices=['NICHE', 'LOCAL'],
        default='NICHE',
        help='Category type (default: NICHE)'
    )
    parser.add_argument(
        '--json-output',
        action='store_true',
        help='Output raw JSON response'
    )
    
    args = parser.parse_args()
    
    try:
        client = MintBirdCategories(api_key=args.api_key)
        
        print(f"Creating category: {args.name}...")
        
        result = client.create_category(
            name=args.name,
            category_type=args.type
        )
        
        if args.json_output:
            print(json.dumps(result, indent=2))
        else:
            if result.get('status'):
                data = result.get('data', {})
                print(f"\n✓ Category created successfully!")
                print(f"  ID: {data.get('id')}")
                print(f"  Name: {data.get('name')}")
                print(f"  Type: {data.get('type')}")
            else:
                print(f"\n✗ Failed to create category")
                print(f"  Error: {result.get('message')}")
                
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
