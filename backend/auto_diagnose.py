import subprocess
import sys
import os
import time

def run_command(cmd, shell=True, timeout=30):
    """Run a command and return success status and output"""
    try:
        result = subprocess.run(
            cmd,
            shell=shell,
            capture_output=True,
            text=True,
            timeout=timeout
        )
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return False, "", "Command timed out"
    except Exception as e:
        return False, "", str(e)

def check_mongodb_service():
    """Check if MongoDB service exists and is running"""
    print("\n[STEP 1/5] Checking MongoDB Service...")
    print("-" * 60)
    
    # Check if service exists
    success, stdout, stderr = run_command("sc query MongoDB", timeout=10)
    
    if not success:
        print("   ❌ MongoDB service not found")
        print("   ℹ️  Install MongoDB from: https://www.mongodb.com/try/download/community")
        return False
    
    # Check if running
    if "RUNNING" in stdout:
        print("   ✅ MongoDB service is RUNNING")
        return True
    else:
        print("   ⚠️  MongoDB service exists but is NOT running")
        print("   ℹ️  Attempting to start MongoDB...")
        
        # Try to start it
        success, stdout, stderr = run_command("net start MongoDB", timeout=15)
        
        if success or "already been started" in stderr:
            print("   ✅ MongoDB started successfully")
            time.sleep(2)  # Wait for MongoDB to initialize
            return True
        else:
            print("   ❌ Failed to start MongoDB")
            print("   ℹ️  Try running as Administrator: net start MongoDB")
            return False

def check_mongodb_connectivity():
    """Check if MongoDB is accessible"""
    print("\n[STEP 2/5] Testing MongoDB Connectivity...")
    print("-" * 60)
    
    try:
        from pymongo import MongoClient
        client = MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        version_info = client.server_info()
        print(f"   ✅ MongoDB is accessible")
        print(f"   ℹ️  Version: {version_info.get('version', 'unknown')}")
        client.close()
        return True
    except Exception as e:
        print(f"   ❌ Cannot connect to MongoDB")
        print(f"   ℹ️  Error: {str(e)}")
        return False

def check_virtual_environment():
    """Check if virtual environment exists"""
    print("\n[STEP 3/5] Checking Virtual Environment...")
    print("-" * 60)
    
    venv_path = os.path.join(os.getcwd(), "venv", "Scripts", "activate.bat")
    
    if os.path.exists(venv_path):
        print("   ✅ Virtual environment found")
        return True
    else:
        print("   ⚠️  Virtual environment not found")
        print("   ℹ️  Creating virtual environment...")
        
        success, stdout, stderr = run_command("python -m venv venv", timeout=60)
        
        if success:
            print("   ✅ Virtual environment created")
            return True
        else:
            print("   ❌ Failed to create virtual environment")
            print(f"   ℹ️  Error: {stderr}")
            return False

def check_dependencies():
    """Check if required packages are installed"""
    print("\n[STEP 4/5] Checking Python Dependencies...")
    print("-" * 60)
    
    required_packages = ["fastapi", "motor", "pymongo", "pydantic", "uvicorn"]
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"   ✅ {package}")
        except ImportError:
            print(f"   ❌ {package} - MISSING")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n   ⚠️  Missing packages: {', '.join(missing_packages)}")
        print("   ℹ️  These should be installed in your venv")
        print("   ℹ️  Run: venv\\Scripts\\activate && pip install -r requirements.txt")
        return False
    else:
        print("\n   ✅ All required packages are installed")
        return True

def check_env_file():
    """Check if .env file exists"""
    print("\n[STEP 5/5] Checking Environment Configuration...")
    print("-" * 60)
    
    env_path = os.path.join(os.getcwd(), ".env")
    
    if os.path.exists(env_path):
        print("   ✅ .env file exists")
        
        # Read and check key variables
        with open(env_path, 'r') as f:
            env_content = f.read()
            
        if "MONGO_URL" in env_content:
            print("   ✅ MONGO_URL configured")
        else:
            print("   ⚠️  MONGO_URL not found in .env")
            
        if "DB_NAME" in env_content:
            print("   ✅ DB_NAME configured")
        else:
            print("   ⚠️  DB_NAME not found in .env")
            
        return True
    else:
        print("   ❌ .env file not found")
        print("   ℹ️  Creating .env file with default values...")
        
        default_env = """MONGO_URL=mongodb://localhost:27017
DB_NAME=metamirror
OPENAI_API_KEY=
GEMINI_API_KEY=
CORS_ORIGINS=*
"""
        try:
            with open(env_path, 'w') as f:
                f.write(default_env)
            print("   ✅ .env file created")
            return True
        except Exception as e:
            print(f"   ❌ Failed to create .env file: {e}")
            return False

def print_summary(results):
    """Print summary of all checks"""
    print("\n" + "=" * 60)
    print(" DIAGNOSTIC SUMMARY")
    print("=" * 60)
    
    all_passed = all(results.values())
    
    for check, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"   {check:<30} {status}")
    
    print("=" * 60)
    
    if all_passed:
        print("\n   🎉 All checks passed! System is ready.")
        print("\n   Next steps:")
        print("   1. Run: quick_start.bat")
        print("   2. Or manually run: uvicorn server:app --reload")
        print("   3. Visit: http://127.0.0.1:8000/docs")
    else:
        print("\n   ⚠️  Some checks failed. Review the output above.")
        print("\n   Common fixes:")
        print("   • MongoDB not running: Run as Admin → net start MongoDB")
        print("   • Missing packages: venv\\Scripts\\activate && pip install -r requirements.txt")
        print("   • Check TROUBLESHOOTING.md for more help")
    
    print()

def main():
    print("=" * 60)
    print(" MetaMirror Backend - Automated Diagnostics")
    print("=" * 60)
    print(f" Working Directory: {os.getcwd()}")
    print(f" Python Version: {sys.version.split()[0]}")
    print("=" * 60)
    
    results = {}
    
    # Run all checks
    results["MongoDB Service"] = check_mongodb_service()
    results["MongoDB Connectivity"] = check_mongodb_connectivity()
    results["Virtual Environment"] = check_virtual_environment()
    results["Python Dependencies"] = check_dependencies()
    results["Environment Config"] = check_env_file()
    
    # Print summary
    print_summary(results)
    
    # Return exit code
    return 0 if all(results.values()) else 1

if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n\n   ⚠️  Interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n   ❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
