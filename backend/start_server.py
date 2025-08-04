#!/usr/bin/env python3

import sys
import os
sys.path.append('/app')

try:
    from app.main import app
    import uvicorn
    
    print("Starting FastAPI server...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
    
except Exception as e:
    print(f"Error starting server: {e}")
    import traceback
    traceback.print_exc()
