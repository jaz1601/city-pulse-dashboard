#!/usr/bin/env python3
"""
Configure a sales funnel in MintBird
Connect lead pages, products, and upsells
"""
import argparse
import json
import sys
from mintbird_client import MintBirdLeadPages, MintBirdProducts


def main():
    parser = argparse.ArgumentParser(
        description='Configure a sales funnel in MintBird'
    )
    parser.add_argument(
        '--api-key',
        help='MintBird API key (or set MINTBIRD_API_KEY env var)'
    )
    parser.add_argument(
        '--funnel-name',
        required=True,
        help='Funnel name'
    )
    parser.add_argument(
        '--optin-page-id',
        type=int,
        required=True,
        help='Lead page ID for opt-in'
    )
    parser.add_argument(
        '--product-id',
        type=int,
        required=True,
        help='Main product ID'
    )
    parser.add_argument(
        '--upsell-page-id',
        type=int,
        help='Upsell page ID (optional)'
    )
    parser.add_argument(
        '--upsell-product-id',
        type=int,
        help='Upsell product ID (optional)'
    )
    parser.add_argument(
        '--downsell-page-id',
        type=int,
        help='Downsell page ID (optional)'
    )
    parser.add_argument(
        '--thank-you-page-id',
        type=int,
        help='Thank you page ID (optional)'
    )
    parser.add_argument(
        '--email-service',
        choices=['mailchimp', 'convertkit', 'activecampaign', 'aweber'],
        help='Email service integration'
    )
    parser.add_argument(
        '--list-id',
        help='Email list ID for subscribers'
    )
    parser.add_argument(
        '--tag',
        action='append',
        help='Tags to apply (can use multiple)'
    )
    parser.add_argument(
        '--json-output',
        action='store_true',
        help='Output raw JSON'
    )
    
    args = parser.parse_args()
    
    try:
        # Verify all components exist
        print(f"Verifying funnel components...")
        
        pages = MintBirdLeadPages(api_key=args.api_key)
        products = MintBirdProducts(api_key=args.api_key)
        
        # Check optin page
        optin = pages.get_page(args.optin_page_id)
        if not optin:
            print(f"✗ Opt-in page {args.optin_page_id} not found")
            sys.exit(1)
        print(f"✓ Opt-in page: {optin.get('name')}")
        
        # Check product
        product = products.get_product(args.product_id)
        if not product:
            print(f"✗ Product {args.product_id} not found")
            sys.exit(1)
        print(f"✓ Main product: {product.get('name')} (${product.get('price')})")
        
        # Check upsell if provided
        if args.upsell_page_id:
            upsell = pages.get_page(args.upsell_page_id)
            if upsell:
                print(f"✓ Upsell page: {upsell.get('name')}")
            else:
                print(f"⚠ Upsell page {args.upsell_page_id} not found")
        
        if args.upsell_product_id:
            upsell_prod = products.get_product(args.upsell_product_id)
            if upsell_prod:
                print(f"✓ Upsell product: {upsell_prod.get('name')} (${upsell_prod.get('price')})")
            else:
                print(f"⚠ Upsell product {args.upsell_product_id} not found")
        
        # Build funnel configuration
        funnel_config = {
            'name': args.funnel_name,
            'optin_page_id': args.optin_page_id,
            'product_id': args.product_id,
            'steps': [
                {'type': 'optin', 'page_id': args.optin_page_id},
                {'type': 'sales', 'product_id': args.product_id}
            ]
        }
        
        if args.upsell_page_id and args.upsell_product_id:
            funnel_config['steps'].append({
                'type': 'upsell',
                'page_id': args.upsell_page_id,
                'product_id': args.upsell_product_id
            })
        
        if args.downsell_page_id:
            funnel_config['steps'].append({
                'type': 'downsell',
                'page_id': args.downsell_page_id
            })
        
        if args.thank_you_page_id:
            funnel_config['steps'].append({
                'type': 'thank_you',
                'page_id': args.thank_you_page_id
            })
        
        if args.email_service:
            funnel_config['email_integration'] = {
                'service': args.email_service,
                'list_id': args.list_id,
                'tags': args.tag or []
            }
        
        # Note: Actual funnel creation endpoint may vary
        # This creates the configuration structure
        
        print(f"\n{'='*60}")
        print(f"FUNNEL CONFIGURATION: {args.funnel_name}")
        print(f"{'='*60}")
        
        print(f"\nFunnel Steps:")
        for i, step in enumerate(funnel_config['steps'], 1):
            print(f"  {i}. {step['type'].upper()}")
            if 'page_id' in step:
                print(f"     Page ID: {step['page_id']}")
            if 'product_id' in step:
                print(f"     Product ID: {step['product_id']}")
        
        if args.email_service:
            print(f"\nEmail Integration:")
            print(f"  Service: {args.email_service}")
            print(f"  List ID: {args.list_id or 'Not specified'}")
            print(f"  Tags: {', '.join(args.tag) if args.tag else 'None'}")
        
        print(f"\n{'='*60}")
        print(f"\n✓ Funnel configuration ready!")
        print(f"\nNext steps:")
        print(f"  1. Configure in MintBird dashboard")
        print(f"  2. Connect payment processor")
        print(f"  3. Set up email automation")
        print(f"  4. Test complete flow")
        print(f"  5. Launch funnel")
        
        if args.json_output:
            print(f"\nConfiguration JSON:")
            print(json.dumps(funnel_config, indent=2))
        
        # Save configuration to file
        filename = f"funnel_{args.funnel_name.lower().replace(' ', '_')}.json"
        with open(filename, 'w') as f:
            json.dump(funnel_config, f, indent=2)
        print(f"\nConfiguration saved to: {filename}")
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
