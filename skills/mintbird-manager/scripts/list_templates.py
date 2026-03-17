#!/usr/bin/env python3
"""
List available templates in MintBird
"""
import argparse
import json
import sys
from mintbird_client import MintBirdTemplates


def main():
    parser = argparse.ArgumentParser(
        description='List available templates in MintBird'
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
        client = MintBirdTemplates(api_key=args.api_key)
        templates = client.list_templates()
        
        if not templates:
            print("No templates found.")
            return
        
        if args.format == 'json':
            print(json.dumps(templates, indent=2))
        else:
            print(f"\n{'ID':<8} {'Name':<35} {'Category':<15}")
            print("-" * 60)
            
            for template in templates:
                tid = template.get('id', 'N/A')
                name = template.get('name', 'Unnamed')[:33]
                category = template.get('category', 'N/A')[:13]
                
                print(f"{tid:<8} {name:<35} {category:<15}")
            
            print(f"\nTotal templates: {len(templates)}")
            
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
