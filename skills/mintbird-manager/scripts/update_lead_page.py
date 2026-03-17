#!/usr/bin/env python3
"""
Update an existing lead page in MintBird
"""
import argparse
import json
import sys
from mintbird_client import MintBirdLeadPages


def main():
    parser = argparse.ArgumentParser(
        description='Update an existing lead page in MintBird'
    )
    parser.add_argument(
        '--api-key',
        help='MintBird API key (or set MINTBIRD_API_KEY env var)'
    )
    parser.add_argument(
        '--page-id',
        required=True,
        type=int,
        help='Lead page ID to update'
    )
    parser.add_argument(
        '--name',
        help='New page name'
    )
    parser.add_argument(
        '--title',
        help='New page title/headline'
    )
    parser.add_argument(
        '--content',
        help='New page content (HTML allowed)'
    )
    parser.add_argument(
        '--category-id',
        type=int,
        help='New category ID'
    )
    parser.add_argument(
        '--template-id',
        type=int,
        help='New template ID'
    )
    parser.add_argument(
        '--status',
        choices=['active', 'inactive'],
        help='New status'
    )
    parser.add_argument(
        '--json-output',
        action='store_true',
        help='Output raw JSON response'
    )
    
    args = parser.parse_args()
    
    try:
        client = MintBirdLeadPages(api_key=args.api_key)
        
        # Build update data
        update_data = {}
        if args.name:
            update_data['name'] = args.name
        if args.title:
            update_data['title'] = args.title
        if args.content:
            update_data['content'] = args.content
        if args.category_id:
            update_data['category_id'] = args.category_id
        if args.template_id:
            update_data['template_id'] = args.template_id
        if args.status:
            update_data['status'] = args.status == 'active'
        
        if not update_data:
            print("Error: No fields to update. Provide at least one field.", file=sys.stderr)
            sys.exit(1)
        
        print(f"Updating lead page {args.page_id}...")
        
        result = client.update_page(args.page_id, **update_data)
        
        if args.json_output:
            print(json.dumps(result, indent=2))
        else:
            if result.get('status'):
                print(f"\n✓ Lead page updated successfully!")
                data = result.get('data', {})
                print(f"  ID: {data.get('id')}")
                print(f"  Name: {data.get('name')}")
                print(f"  Status: {'Active' if data.get('status') else 'Inactive'}")
            else:
                print(f"\n✗ Failed to update lead page")
                print(f"  Error: {result.get('message')}")
                
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
