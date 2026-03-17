#!/usr/bin/env python3
"""
Publish a MintBird lead page live
"""
import argparse
import json
import sys
from mintbird_client import MintBirdLeadPages


def main():
    parser = argparse.ArgumentParser(
        description='Publish a MintBird lead page live'
    )
    parser.add_argument(
        '--api-key',
        help='MintBird API key (or set MINTBIRD_API_KEY env var)'
    )
    parser.add_argument(
        '--page-id',
        required=True,
        type=int,
        help='Lead page ID to publish'
    )
    parser.add_argument(
        '--custom-domain',
        help='Custom domain to use (optional)'
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
        '--force',
        action='store_true',
        help='Skip confirmation'
    )
    parser.add_argument(
        '--json-output',
        action='store_true',
        help='Output raw JSON'
    )
    
    args = parser.parse_args()
    
    try:
        client = MintBirdLeadPages(api_key=args.api_key)
        
        # Get page details
        page = client.get_page(args.page_id)
        
        if not page:
            print(f"Page {args.page_id} not found.")
            sys.exit(1)
        
        # Check if already active
        if page.get('status') and not args.force:
            print(f"\n⚠️  Page '{page.get('name')}' is already active!")
            print(f"   URL: {page.get('full_url')}")
            
            confirm = input("\nRepublish anyway? (yes/no): ")
            if confirm.lower() != 'yes':
                print("Cancelled.")
                return
        
        print(f"\nPublishing page: {page.get('name')}")
        print(f"Current status: {'Active' if page.get('status') else 'Draft'}")
        
        # Build update data
        update_data = {
            'status': True,  # Activate page
            'published': True
        }
        
        if args.custom_domain:
            update_data['domain'] = args.custom_domain
            print(f"Custom domain: {args.custom_domain}")
        
        if args.seo_title:
            update_data['seo_title'] = args.seo_title
            print(f"SEO title: {args.seo_title}")
        
        if args.seo_description:
            update_data['seo_description'] = args.seo_description
            print(f"SEO description set")
        
        print(f"\nPublishing...")
        
        result = client.update_page(args.page_id, **update_data)
        
        if args.json_output:
            print(json.dumps(result, indent=2))
        else:
            if result.get('status'):
                data = result.get('data', {})
                print(f"\n✅ PAGE PUBLISHED SUCCESSFULLY!")
                print(f"\n{'='*60}")
                print(f"  Page Name: {data.get('name')}")
                print(f"  Page ID: {data.get('id')}")
                print(f"  Status: {'🟢 LIVE' if data.get('status') else '🔴 Draft'}")
                print(f"\n  🌐 LIVE URL:")
                print(f"  {data.get('full_url')}")
                print(f"{'='*60}")
                
                print(f"\nNext steps:")
                print(f"  1. Test the live page")
                print(f"  2. Submit test lead")
                print(f"  3. Check email delivery")
                print(f"  4. Start driving traffic!")
                
                print(f"\nTraffic Sources:")
                print(f"  - Social media posts")
                print(f"  - Email broadcasts")
                print(f"  - Paid ads")
                print(f"  - Partner promotions")
            else:
                print(f"\n❌ Failed to publish page")
                print(f"   Error: {result.get('message')}")
                
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
