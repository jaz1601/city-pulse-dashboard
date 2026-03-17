#!/usr/bin/env python3
"""
Delete a product from MintBird
"""
import argparse
import json
import sys
from mintbird_client import MintBirdProducts


def main():
    parser = argparse.ArgumentParser(
        description='Delete a product from MintBird'
    )
    parser.add_argument(
        '--api-key',
        help='MintBird API key (or set MINTBIRD_API_KEY env var)'
    )
    parser.add_argument(
        '--product-id',
        required=True,
        type=int,
        help='Product ID to delete'
    )
    parser.add_argument(
        '--force',
        action='store_true',
        help='Skip confirmation prompt'
    )
    parser.add_argument(
        '--json-output',
        action='store_true',
        help='Output raw JSON response'
    )
    
    args = parser.parse_args()
    
    try:
        client = MintBirdProducts(api_key=args.api_key)
        
        # Get product details first for confirmation
        if not args.force:
            product = client.get_product(args.product_id)
            if not product:
                print(f"Product {args.product_id} not found.")
                sys.exit(1)
            
            print(f"\nYou are about to delete:")
            print(f"  ID: {product.get('id')}")
            print(f"  Name: {product.get('name')}")
            print(f"  Price: ${product.get('price', 0):.2f}")
            print(f"\nThis action cannot be undone!")
            
            confirm = input("\nType 'delete' to confirm: ")
            if confirm.lower() != 'delete':
                print("Deletion cancelled.")
                return
        
        print(f"\nDeleting product {args.product_id}...")
        
        result = client.delete_product(args.product_id)
        
        if args.json_output:
            print(json.dumps(result, indent=2))
        else:
            if result.get('status'):
                print(f"\n✓ Product deleted successfully!")
            else:
                print(f"\n✗ Failed to delete product")
                print(f"  Error: {result.get('message')}")
                
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
