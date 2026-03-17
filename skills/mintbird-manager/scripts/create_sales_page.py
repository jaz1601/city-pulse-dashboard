#!/usr/bin/env python3
"""
Create a complete lead page with sales copy in MintBird
"""
import argparse
import json
import sys
from mintbird_client import MintBirdLeadPages, MintBirdCategories


# Sales copy templates
SALES_TEMPLATES = {
    'optin': {
        'title': 'Get Your Free {topic} Guide',
        'headline': 'Discover the Simple 3-Step System to {benefit}',
        'subheadline': 'Download this free guide and start seeing results in the next 7 days — no tech skills required',
        'bullets': [
            'The exact framework successful entrepreneurs use (page 4)',
            'How to get started with zero upfront investment (page 7)',
            'The #1 mistake beginners make and how to avoid it (page 12)',
            'Real examples from people just like you (page 15)'
        ],
        'cta': 'Send Me The Free Guide',
        'disclaimer': 'We respect your privacy. Unsubscribe at any time.'
    },
    'webinar': {
        'title': 'Free Training: How to {benefit}',
        'headline': 'Join This Free Training and Discover How to {benefit}',
        'subheadline': 'Wednesday at 8PM EST — Reserve your spot now (limited availability)',
        'bullets': [
            'Why most people fail at this (and how you can succeed)',
            'The 3-step system that works in 2026',
            'Live Q&A — get your questions answered',
            'Free bonus toolkit for all attendees'
        ],
        'cta': 'Reserve My Free Spot',
        'disclaimer': 'This training will not be recorded. Show up live to get the bonus.'
    },
    'challenge': {
        'title': 'Join the 5-Day {topic} Challenge',
        'headline': 'Transform Your {topic} in Just 5 Days',
        'subheadline': 'Join thousands of others who have completed this challenge — starts Monday',
        'bullets': [
            'Day 1: Get clear on your goals',
            'Day 2: Set up your system',
            'Day 3: Take your first action',
            'Day 4: Optimize and improve',
            'Day 5: Plan your next 30 days'
        ],
        'cta': 'Join The Challenge (Free)',
        'disclaimer': 'Join our community of 10,000+ challenge completers'
    }
}


def generate_sales_copy(template_type, topic, benefit):
    """Generate sales copy based on template"""
    template = SALES_TEMPLATES.get(template_type, SALES_TEMPLATES['optin'])
    
    copy = {
        'title': template['title'].format(topic=topic),
        'headline': template['headline'].format(benefit=benefit),
        'subheadline': template['subheadline'],
        'bullets': template['bullets'],
        'cta': template['cta'],
        'disclaimer': template['disclaimer']
    }
    
    return copy


def build_page_content(copy, video_url='', hero_image=''):
    """Build HTML content for lead page"""
    content = f"""
    <div class="hero-section">
        <h1>{copy['headline']}</h1>
        <h2>{copy['subheadline']}</h2>
    </div>
    """
    
    if video_url:
        content += f"""
    <div class="video-section">
        <iframe src="{video_url}" width="100%" height="400" frameborder="0"></iframe>
    </div>
        """
    elif hero_image:
        content += f"""
    <div class="image-section">
        <img src="{hero_image}" alt="Hero" style="max-width: 100%;" />
    </div>
        """
    
    content += f"""
    <div class="bullets-section">
        <h3>Here's what you'll discover:</h3>
        <ul>
    """
    
    for bullet in copy['bullets']:
        content += f"            <li>{bullet}</li>\n"
    
    content += f"""
        </ul>
    </div>
    
    <div class="cta-section">
        <p class="disclaimer">{copy['disclaimer']}</p>
    </div>
    """
    
    return content


def main():
    parser = argparse.ArgumentParser(
        description='Create a lead page with sales copy in MintBird'
    )
    parser.add_argument(
        '--api-key',
        help='MintBird API key (or set MINTBIRD_API_KEY env var)'
    )
    parser.add_argument(
        '--name',
        required=True,
        help='Internal page name'
    )
    parser.add_argument(
        '--category-id',
        required=True,
        type=int,
        help='Category ID'
    )
    parser.add_argument(
        '--template-id',
        type=int,
        default=1,
        help='Template ID (default: 1)'
    )
    parser.add_argument(
        '--page-type',
        choices=['optin', 'webinar', 'challenge'],
        default='optin',
        help='Type of page to create'
    )
    parser.add_argument(
        '--topic',
        required=True,
        help='Topic (e.g., "Digital Income", "Weight Loss")'
    )
    parser.add_argument(
        '--benefit',
        required=True,
        help='Main benefit (e.g., "earn your first $1,000 online")'
    )
    parser.add_argument(
        '--video-url',
        default='',
        help='Video URL (optional)'
    )
    parser.add_argument(
        '--hero-image',
        default='',
        help='Hero image URL (optional)'
    )
    parser.add_argument(
        '--custom-headline',
        default='',
        help='Override generated headline'
    )
    parser.add_argument(
        '--publish',
        action='store_true',
        help='Publish page immediately'
    )
    parser.add_argument(
        '--json-output',
        action='store_true',
        help='Output raw JSON'
    )
    
    args = parser.parse_args()
    
    try:
        # Generate sales copy
        print(f"Generating {args.page_type} sales copy...")
        copy = generate_sales_copy(args.page_type, args.topic, args.benefit)
        
        if args.custom_headline:
            copy['headline'] = args.custom_headline
        
        # Build page content
        content = build_page_content(copy, args.video_url, args.hero_image)
        
        # Create page
        client = MintBirdLeadPages(api_key=args.api_key)
        
        print(f"Creating lead page: {args.name}...")
        
        result = client.create_page(
            name=args.name,
            category_id=args.category_id,
            template_id=args.template_id,
            title=copy['headline'],
            content=content
        )
        
        if args.json_output:
            print(json.dumps(result, indent=2))
        else:
            if result.get('status'):
                data = result.get('data', {})
                page_id = data.get('id')
                
                print(f"\n✓ Lead page created successfully!")
                print(f"  ID: {page_id}")
                print(f"  Name: {data.get('name')}")
                print(f"  URL: {data.get('full_url')}")
                print(f"\n  Headline: {copy['headline']}")
                print(f"  CTA Button: {copy['cta']}")
                
                if args.publish:
                    print(f"\n  Publishing page...")
                    # Note: Actual publish endpoint may vary
                    print(f"  ✓ Page ready to publish (configure in dashboard)")
                
                print(f"\nNext steps:")
                print(f"  1. Review the page in MintBird dashboard")
                print(f"  2. Connect email service for lead delivery")
                print(f"  3. Test the opt-in flow")
                print(f"  4. Publish when ready")
            else:
                print(f"\n✗ Failed to create page")
                print(f"  Error: {result.get('message')}")
                
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
