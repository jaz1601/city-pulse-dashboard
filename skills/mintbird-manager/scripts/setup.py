#!/usr/bin/env python3
"""
Setup script for MintBird Manager Skill
Installs dependencies and verifies API connectivity
"""
import os
import sys
import subprocess


def check_python_version():
    """Check Python version"""
    if sys.version_info < (3, 7):
        print("Error: Python 3.7+ required")
        sys.exit(1)
    print(f"✓ Python {sys.version_info.major}.{sys.version_info.minor} detected")


def install_dependencies():
    """Install required packages"""
    print("\nInstalling dependencies...")
    
    packages = ['requests']
    
    for package in packages:
        try:
            subprocess.check_call(
                [sys.executable, '-m', 'pip', 'install', '-q', package]
            )
            print(f"✓ {package} installed")
        except subprocess.CalledProcessError:
            print(f"✗ Failed to install {package}")
            return False
    
    return True


def verify_api_key():
    """Check if API key is configured"""
    api_key = os.getenv('MINTBIRD_API_KEY')
    
    if api_key:
        print("\n✓ MINTBIRD_API_KEY environment variable found")
        return True
    else:
        print("\n⚠ MINTBIRD_API_KEY environment variable not set")
        print("\nTo set your API key:")
        print("  export MINTBIRD_API_KEY='your_api_key_here'")
        print("\nOr pass --api-key to individual scripts")
        return False


def test_connection():
    """Test API connectivity"""
    try:
        from mintbird_client import MintBirdAPI
        
        api_key = os.getenv('MINTBIRD_API_KEY')
        if not api_key:
            print("\n⚠ Skipping connection test (no API key)")
            return
        
        print("\nTesting API connection...")
        client = MintBirdAPI(api_key=api_key)
        
        # Try to list categories (lightweight operation)
        response = client.get('/categories')
        
        if response.get('status'):
            print("✓ API connection successful!")
            categories = response.get('data', {}).get('categories', [])
            print(f"  Found {len(categories)} categories")
        else:
            print(f"✗ API error: {response.get('message')}")
            
    except Exception as e:
        print(f"✗ Connection failed: {e}")


def print_usage():
    """Print usage examples"""
    print("\n" + "="*60)
    print("MINTBIRD MANAGER SKILL - SETUP COMPLETE")
    print("="*60)
    
    print("\nQuick Start:")
    print("  1. Set your API key:")
    print("     export MINTBIRD_API_KEY='your_key_here'")
    
    print("\n  2. List your products:")
    print("     python scripts/list_products.py")
    
    print("\n  3. List lead pages:")
    print("     python scripts/list_lead_pages.py")
    
    print("\n  4. Create a product:")
    print("     python scripts/create_product.py \\")
    print("       --name 'My Product' --price 49.00")
    
    print("\n  5. Create a lead page:")
    print("     python scripts/create_lead_page.py \\")
    print("       --name 'Opt-in Page' --category-id 1919")
    
    print("\nAvailable Scripts:")
    scripts = [
        "list_products.py",
        "create_product.py",
        "update_product.py",
        "delete_product.py",
        "list_lead_pages.py",
        "get_lead_page.py",
        "create_lead_page.py",
        "update_lead_page.py",
        "delete_lead_page.py",
        "list_categories.py",
        "create_category.py",
        "list_templates.py"
    ]
    
    for script in scripts:
        print(f"  - {script}")
    
    print("\nDocumentation:")
    print("  - SKILL.md: Full skill documentation")
    print("  - references/endpoints.md: API endpoint reference")
    print("  - references/schemas.md: Data structure schemas")
    
    print("\n" + "="*60)


def main():
    print("MintBird Manager Skill - Setup")
    print("="*60)
    
    check_python_version()
    
    if not install_dependencies():
        print("\n✗ Setup failed - dependency installation error")
        sys.exit(1)
    
    verify_api_key()
    test_connection()
    print_usage()


if __name__ == '__main__':
    main()
