#!/usr/bin/env python3
"""
Create a new product in MintBird
"""
import argparse
import json
import sys
from mintbird_client import MintBirdProducts


def main():
    parser = argparse.ArgumentParser(
        description='Create a new product in MintBird'
    )
    parser.add_argument(
        '--api-key',
        help='MintBird API key (or set MINTBIRD_API_KEY env var)'
    )
    parser.add_argument(
        '--name',
        required=True,
        help='Product name'
    )
    parser.add_argument(
        '--price',
        required=True,
        type=float,
        help='Product price (e.g., 49.00)'
    )
    parser.add_argument(
        '--type',
        choices=['digital', 'physical'],
        default='digital',
        help='Product type'
    )
    parser.add_argument(
        '--description',
        default='',
        help='Product description'
    )
    parser.add_argument(
        '--category-id',
        type=int,
        help='Category ID to assign product to'
    )
    parser.add_argument(
        '--status',
        choices=['active', 'inactive'],
        default='active',
        help='Product status'
    )
    parser.add_argument(
        '--json-output',
        action='store_true',
        help='Output raw JSON response'
    )
    
    args = parser.parse_args()
    
    try:
        client = MintBirdProducts(api_key=args.api_key)
        
        print(f"Creating product: {args.name}...")
        
        result = client.create_product(
            name=args.name,
            price=args.price,
            product_type=args.type,
            description=args.description,
            category_id=args.category_id,
            status=args.status
        )
        
        if args.json_output:
            print(json.dumps(result, indent=2))
        else:
            if result.get('status'):
                data = result.get('data', {})
                print(f"\n✓ Product created successfully!")
                print(f"  ID: {data.get('id')}")
                print(f"  Name: {data.get('name')}")
                print(f"  Price: ${data.get('price', 0):.2f}")
                print(f"  Status: {data.get('status')}")
                print(f"  Type: {data.get('type')}")
            else:
                print(f"\n✗ Failed to create product")
                print(f"  Error: {result.get('message')}")
                
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
