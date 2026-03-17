#!/usr/bin/env python3
"""
Update an existing product in MintBird
"""
import argparse
import json
import sys
from mintbird_client import MintBirdProducts


def main():
    parser = argparse.ArgumentParser(
        description='Update an existing product in MintBird'
    )
    parser.add_argument(
        '--api-key',
        help='MintBird API key (or set MINTBIRD_API_KEY env var)'
    )
    parser.add_argument(
        '--product-id',
        required=True,
        type=int,
        help='Product ID to update'
    )
    parser.add_argument(
        '--name',
        help='New product name'
    )
    parser.add_argument(
        '--price',
        type=float,
        help='New product price'
    )
    parser.add_argument(
        '--description',
        help='New product description'
    )
    parser.add_argument(
        '--status',
        choices=['active', 'inactive'],
        help='New product status'
    )
    parser.add_argument(
        '--category-id',
        type=int,
        help='New category ID'
    )
    parser.add_argument(
        '--json-output',
        action='store_true',
        help='Output raw JSON response'
    )
    
    args = parser.parse_args()
    
    try:
        client = MintBirdProducts(api_key=args.api_key)
        
        # Build update data from provided arguments
        update_data = {}
        if args.name:
            update_data['name'] = args.name
        if args.price is not None:
            update_data['price'] = args.price
        if args.description:
            update_data['description'] = args.description
        if args.status:
            update_data['status'] = args.status
        if args.category_id:
            update_data['category_id'] = args.category_id
        
        if not update_data:
            print("Error: No fields to update. Provide at least one field.", file=sys.stderr)
            sys.exit(1)
        
        print(f"Updating product {args.product_id}...")
        
        result = client.update_product(args.product_id, **update_data)
        
        if args.json_output:
            print(json.dumps(result, indent=2))
        else:
            if result.get('status'):
                print(f"\n✓ Product updated successfully!")
                data = result.get('data', {})
                print(f"  ID: {data.get('id')}")
                print(f"  Name: {data.get('name')}")
                print(f"  Price: ${data.get('price', 0):.2f}")
                print(f"  Status: {data.get('status')}")
            else:
                print(f"\n✗ Failed to update product")
                print(f"  Error: {result.get('message')}")
                
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
