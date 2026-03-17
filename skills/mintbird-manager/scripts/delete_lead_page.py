#!/usr/bin/env python3
"""
Delete a lead page from MintBird
"""
import argparse
import json
import sys
from mintbird_client import MintBirdLeadPages


def main():
    parser = argparse.ArgumentParser(
        description='Delete a lead page from MintBird'
    )
    parser.add_argument(
        '--api-key',
        help='MintBird API key (or set MINTBIRD_API_KEY env var)'
    )
    parser.add_argument(
        '--page-id',
        required=True,
        type=int,
        help='Lead page ID to delete'
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
        client = MintBirdLeadPages(api_key=args.api_key)
        
        # Get page details first for confirmation
        if not args.force:
            page = client.get_page(args.page_id)
            if not page:
                print(f"Lead page {args.page_id} not found.")
                sys.exit(1)
            
            views = page.get('views', 0)
            leads = page.get('leads', 0)
            
            print(f"\nYou are about to delete:")
            print(f"  ID: {page.get('id')}")
            print(f"  Name: {page.get('name')}")
            print(f"  Views: {views}")
            print(f"  Leads: {leads}")
            print(f"\n⚠️  This action cannot be undone!")
            
            if views > 0 or leads > 0:
                print(f"\n⚠️  WARNING: This page has traffic and lead data!")
            
            confirm = input("\nType 'delete' to confirm: ")
            if confirm.lower() != 'delete':
                print("Deletion cancelled.")
                return
        
        print(f"\nDeleting lead page {args.page_id}...")
        
        result = client.delete_page(args.page_id)
        
        if args.json_output:
            print(json.dumps(result, indent=2))
        else:
            if result.get('status'):
                print(f"\n✓ Lead page deleted successfully!")
            else:
                print(f"\n✗ Failed to delete lead page")
                print(f"  Error: {result.get('message')}")
                
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
