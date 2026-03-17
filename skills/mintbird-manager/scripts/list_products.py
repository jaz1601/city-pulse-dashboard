#!/usr/bin/env python3
"""
List all products in your MintBird account
"""
import argparse
import json
import sys
from mintbird_client import MintBirdProducts


def main():
    parser = argparse.ArgumentParser(
        description='List all products in your MintBird account'
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
        client = MintBirdProducts(api_key=args.api_key)
        products = client.list_products()
        
        if not products:
            print("No products found in your account.")
            return
        
        if args.format == 'json':
            print(json.dumps(products, indent=2))
        else:
            # Table format
            print(f"\n{'ID':<8} {'Name':<40} {'Price':<10} {'Status':<10} {'Type':<10}")
            print("-" * 80)
            
            for product in products:
                pid = product.get('id', 'N/A')
                name = product.get('name', 'Unnamed')[:38]
                price = f"${product.get('price', 0):.2f}"
                status = product.get('status', 'unknown')
                ptype = product.get('type', 'unknown')
                
                print(f"{pid:<8} {name:<40} {price:<10} {status:<10} {ptype:<10}")
            
            print(f"\nTotal products: {len(products)}")
            
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
