#!/usr/bin/env python3
"""
List all lead pages in your MintBird account
"""
import argparse
import json
import sys
from mintbird_client import MintBirdLeadPages


def main():
    parser = argparse.ArgumentParser(
        description='List all lead pages in your MintBird account'
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
        client = MintBirdLeadPages(api_key=args.api_key)
        pages = client.list_pages()
        
        if not pages:
            print("No lead pages found in your account.")
            return
        
        if args.format == 'json':
            print(json.dumps(pages, indent=2))
        else:
            # Table format
            print(f"\n{'ID':<8} {'Name':<35} {'Views':<8} {'Leads':<8} {'Status':<10}")
            print("-" * 75)
            
            for page in pages:
                pid = page.get('id', 'N/A')
                name = page.get('name', 'Unnamed')[:33]
                views = page.get('views', 0)
                leads = page.get('leads', 0)
                status = 'Active' if page.get('status') else 'Inactive'
                
                print(f"{pid:<8} {name:<35} {views:<8} {leads:<8} {status:<10}")
            
            # Summary
            total_views = sum(p.get('views', 0) for p in pages)
            total_leads = sum(p.get('leads', 0) for p in pages)
            
            print(f"\nTotal pages: {len(pages)}")
            print(f"Total views: {total_views}")
            print(f"Total leads: {total_leads}")
            if total_views > 0:
                conversion = (total_leads / total_views) * 100
                print(f"Overall conversion: {conversion:.1f}%")
            
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
