import sys
from sqlmodel import Session, create_engine
from database import engine
from models.user import Company, GlobalSettings
from services.whitelabel_engine import WhiteLabelEngine
from services.cache import get_cache_key, get_cached_render, set_cached_render

def test_whitelabel():
    with Session(engine) as session:
        # Create a mock company
        company = Company(
            id="test-company",
            name="Test Solar Co",
            crm_name="TestHub",
            profile_version=1
        )
        
        # Test Engine
        engine_instance = WhiteLabelEngine(session)
        
        # 1. Test standard replacement
        content = "Welcome to {{company_name}}! Log into {{crm_name}}."
        rendered = engine_instance.render_content(content, company)
        print("Test 1 (Direct Replacement):")
        print(f"Original: {content}")
        print(f"Rendered: {rendered}")
        assert "Test Solar Co" in rendered
        assert "TestHub" in rendered

        # 2. Test Fallback Replacement
        content2 = "Contact us at {{contact_email}}"
        rendered2 = engine_instance.render_content(content2, company)
        print("\nTest 2 (Fallback Replacement):")
        print(f"Original: {content2}")
        print(f"Rendered: {rendered2}")
        assert "support@septivolt.com" in rendered2

        # 3. Test Invalid Variable
        content3 = "Check {{invalid_var}}"
        rendered3 = engine_instance.render_content(content3, company)
        print("\nTest 3 (Invalid Variable):")
        print(f"Original: {content3}")
        print(f"Rendered: {rendered3}")
        assert "{{invalid_var}}" in rendered3

        # 4. Test Caching Flow
        print("\nTest 4 (Caching Flow):")
        content_id = "module_123"
        content_version = 1
        
        cache_key_v1 = get_cache_key(company.id, content_id, content_version, company.profile_version)
        print(f"Generated Cache Key (v1): {cache_key_v1}")
        
        cached_result = get_cached_render(cache_key_v1)
        if not cached_result:
            print("Cache miss. Rendering and storing...")
            result = engine_instance.render_content(content, company)
            set_cached_render(cache_key_v1, result)
            
        assert get_cached_render(cache_key_v1) is not None
        
        # Simulate manager updating profile
        company.profile_version += 1
        company.crm_name = "NewCRM"
        
        cache_key_v2 = get_cache_key(company.id, content_id, content_version, company.profile_version)
        print(f"Generated Cache Key (v2): {cache_key_v2}")
        
        assert cache_key_v1 != cache_key_v2
        assert get_cached_render(cache_key_v2) is None
        print("Cache correctly invalidated due to profile_version increment.")
        
        print("\nAll tests passed!")

if __name__ == "__main__":
    test_whitelabel()
