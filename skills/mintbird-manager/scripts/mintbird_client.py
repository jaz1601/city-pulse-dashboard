"""
MintBird API Client - Base class for all API operations
"""
import os
import requests
import json
from typing import Dict, List, Optional, Any
from urllib.parse import urljoin

class MintBirdAPI:
    """Base client for MintBird (PopLinks) API operations"""
    
    BASE_URL = "https://api.poplinks.io/api/ai"
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize MintBird API client
        
        Args:
            api_key: MintBird API key. If not provided, reads from MINTBIRD_API_KEY env var
        """
        self.api_key = api_key or os.getenv('MINTBIRD_API_KEY')
        if not self.api_key:
            raise ValueError(
                "API key required. Set MINTBIRD_API_KEY environment variable "
                "or pass api_key parameter"
            )
        
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        
        self.session = requests.Session()
        self.session.headers.update(self.headers)
    
    def _make_request(
        self, 
        method: str, 
        endpoint: str, 
        data: Optional[Dict] = None,
        params: Optional[Dict] = None,
        retries: int = 3
    ) -> Dict[str, Any]:
        """
        Make HTTP request to MintBird API
        
        Args:
            method: HTTP method (GET, POST, PUT, DELETE)
            endpoint: API endpoint path
            data: Request body data
            params: Query parameters
            retries: Number of retry attempts
            
        Returns:
            JSON response as dictionary
            
        Raises:
            requests.exceptions.RequestException: On API errors
        """
        url = urljoin(self.BASE_URL, endpoint)
        
        for attempt in range(retries):
            try:
                response = self.session.request(
                    method=method,
                    url=url,
                    json=data,
                    params=params,
                    timeout=30
                )
                
                # Handle rate limiting
                if response.status_code == 429:
                    import time
                    time.sleep(2 ** attempt)  # Exponential backoff
                    continue
                
                response.raise_for_status()
                
                # Return JSON if present, otherwise return status
                try:
                    return response.json()
                except json.JSONDecodeError:
                    return {"status": True, "message": "Success", "data": None}
                    
            except requests.exceptions.HTTPError as e:
                error_msg = f"HTTP Error {response.status_code}: {response.text}"
                if response.status_code == 401:
                    error_msg = "Authentication failed. Check your API key."
                elif response.status_code == 404:
                    error_msg = f"Resource not found: {endpoint}"
                elif response.status_code == 422:
                    error_msg = f"Validation error: {response.text}"
                
                if attempt == retries - 1:
                    raise requests.exceptions.HTTPError(error_msg)
                    
            except requests.exceptions.RequestException as e:
                if attempt == retries - 1:
                    raise
                import time
                time.sleep(2 ** attempt)
        
        return {"status": False, "message": "Max retries exceeded"}
    
    def get(self, endpoint: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        """Make GET request"""
        return self._make_request('GET', endpoint, params=params)
    
    def post(self, endpoint: str, data: Dict) -> Dict[str, Any]:
        """Make POST request"""
        return self._make_request('POST', endpoint, data=data)
    
    def put(self, endpoint: str, data: Dict) -> Dict[str, Any]:
        """Make PUT request"""
        return self._make_request('PUT', endpoint, data=data)
    
    def delete(self, endpoint: str) -> Dict[str, Any]:
        """Make DELETE request"""
        return self._make_request('DELETE', endpoint)


class MintBirdProducts(MintBirdAPI):
    """Product management operations"""
    
    def list_products(self) -> List[Dict]:
        """List all products"""
        response = self.get('/products')
        return response.get('data', {}).get('products', [])
    
    def get_product(self, product_id: int) -> Dict:
        """Get single product details"""
        response = self.get(f'/products/{product_id}')
        return response.get('data', {})
    
    def create_product(
        self,
        name: str,
        price: float,
        product_type: str = 'digital',
        description: str = '',
        category_id: Optional[int] = None,
        status: str = 'active'
    ) -> Dict:
        """
        Create a new product
        
        Args:
            name: Product name
            price: Product price
            product_type: 'digital' or 'physical'
            description: Product description
            category_id: Category to assign product to
            status: 'active' or 'inactive'
        """
        data = {
            'name': name,
            'price': price,
            'type': product_type,
            'description': description,
            'status': status
        }
        
        if category_id:
            data['category_id'] = category_id
            
        response = self.post('/products', data)
        return response
    
    def update_product(self, product_id: int, **kwargs) -> Dict:
        """Update product fields"""
        response = self.put(f'/products/{product_id}', kwargs)
        return response
    
    def delete_product(self, product_id: int) -> Dict:
        """Delete a product"""
        response = self.delete(f'/products/{product_id}')
        return response


class MintBirdLeadPages(MintBirdAPI):
    """Lead page management operations"""
    
    def list_pages(self) -> List[Dict]:
        """List all lead pages"""
        response = self.get('/lead-pages')
        return response.get('data', {}).get('leadPages', [])
    
    def get_page(self, page_id: int) -> Dict:
        """Get single lead page details"""
        response = self.get(f'/lead-pages/{page_id}')
        return response.get('data', {})
    
    def create_page(
        self,
        name: str,
        category_id: int,
        template_id: int = 1,
        title: str = '',
        content: str = ''
    ) -> Dict:
        """
        Create a new lead page
        
        Args:
            name: Page name
            category_id: Category to assign page to
            template_id: Template style ID
            title: Page headline
            content: Page body content
        """
        data = {
            'name': name,
            'category_id': category_id,
            'template_id': template_id,
            'title': title,
            'content': content
        }
        
        response = self.post('/lead-pages', data)
        return response
    
    def update_page(self, page_id: int, **kwargs) -> Dict:
        """Update lead page"""
        response = self.put(f'/lead-pages/{page_id}', kwargs)
        return response
    
    def delete_page(self, page_id: int) -> Dict:
        """Delete lead page"""
        response = self.delete(f'/lead-pages/{page_id}')
        return response


class MintBirdCategories(MintBirdAPI):
    """Category management operations"""
    
    def list_categories(self) -> List[Dict]:
        """List all categories"""
        response = self.get('/categories')
        return response.get('data', {}).get('categories', [])
    
    def create_category(self, name: str, category_type: str = 'NICHE') -> Dict:
        """
        Create a new category
        
        Args:
            name: Category name
            category_type: 'NICHE' or 'LOCAL'
        """
        data = {
            'name': name,
            'type': category_type
        }
        
        response = self.post('/categories', data)
        return response


class MintBirdTemplates(MintBirdAPI):
    """Template management operations"""
    
    def list_templates(self) -> List[Dict]:
        """List available templates"""
        response = self.get('/templates')
        return response.get('data', {}).get('templates', [])


# Convenience function for quick API access
def get_client(api_key: Optional[str] = None) -> MintBirdAPI:
    """Get configured MintBird API client"""
    return MintBirdAPI(api_key)
