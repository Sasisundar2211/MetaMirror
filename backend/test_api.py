import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def test_root():
    print("   Testing root endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        if response.status_code == 200:
            print(f"   [OK] Root endpoint working")
            return True
        else:
            print(f"   [FAIL] Status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"   [ERROR] Server not running at {BASE_URL}")
        print(f"   [INFO] Start server with: start_server.bat")
        return False
    except Exception as e:
        print(f"   [ERROR] {e}")
        return False

def test_api_root():
    print("   Testing API root endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"   [OK] API endpoint working")
            print(f"   [INFO] OpenAI: {data.get('providers', {}).get('openai', False)}")
            print(f"   [INFO] Gemini: {data.get('providers', {}).get('gemini', False)}")
            return True
        else:
            print(f"   [FAIL] Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"   [ERROR] {e}")
        return False

def test_create_user():
    print("   Testing user creation...")
    try:
        payload = {
            "name": "Test User",
            "email": f"test{int(requests.get(BASE_URL).elapsed.total_seconds()*1000)}@example.com",
            "avatar_style": "default",
            "preferred_provider": "gemini"
        }
        response = requests.post(f"{BASE_URL}/api/users", json=payload, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print(f"   [OK] User created successfully")
            print(f"   [INFO] User ID: {data.get('id', 'N/A')}")
            print(f"   [INFO] Name: {data.get('name', 'N/A')}")
            return True
        elif response.status_code == 400:
            print(f"   [WARN] {response.json().get('detail', 'Unknown error')}")
            return False
        else:
            print(f"   [FAIL] Status: {response.status_code}")
            print(f"   [INFO] Response: {response.text}")
            return False
    except Exception as e:
        print(f"   [ERROR] {e}")
        return False

def test_mongodb_connection():
    print("   Testing MongoDB connection...")
    try:
        from pymongo import MongoClient
        client = MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=5000)
        # Force connection
        client.admin.command('ping')
        print("   [OK] MongoDB is accessible")
        
        # Get version
        version_info = client.server_info()
        print(f"   [INFO] MongoDB version: {version_info.get('version', 'unknown')}")
        return True
    except Exception as e:
        print(f"   [ERROR] MongoDB connection failed")
        print(f"   [INFO] {str(e)}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print(" MetaMirror API Test Suite")
    print("=" * 60)
    
    # Test MongoDB first
    print("\n[1/4] MongoDB Connection Test")
    mongo_ok = test_mongodb_connection()
    
    if not mongo_ok:
        print("\n   ⚠️  WARNING: MongoDB is not running!")
        print("   ⚠️  Run as Admin: net start MongoDB")
        print("   ⚠️  Or run: check_mongodb.bat\n")
    
    # Test server connectivity
    print("\n[2/4] Server Connectivity Test")
    server_ok = test_root()
    
    if not server_ok:
        print("\n   Server is not running. Tests cannot continue.")
        print("   Start the server first with: start_server.bat\n")
        print("=" * 60)
        sys.exit(1)
    
    # Test API endpoints
    print("\n[3/4] API Endpoint Test")
    api_ok = test_api_root()
    
    print("\n[4/4] User Creation Test")
    user_ok = test_create_user()
    
    # Summary
    print("\n" + "=" * 60)
    print(" Test Summary")
    print("=" * 60)
    print(f"   MongoDB:      {'✓ PASS' if mongo_ok else '✗ FAIL'}")
    print(f"   Server:       {'✓ PASS' if server_ok else '✗ FAIL'}")
    print(f"   API Root:     {'✓ PASS' if api_ok else '✗ FAIL'}")
    print(f"   User Create:  {'✓ PASS' if user_ok else '✗ FAIL'}")
    print("=" * 60)
    
    if all([mongo_ok, server_ok, api_ok, user_ok]):
        print("\n   🎉 All tests passed! Backend is working correctly.\n")
        sys.exit(0)
    else:
        print("\n   ⚠️  Some tests failed. Check TROUBLESHOOTING.md\n")
        sys.exit(1)
