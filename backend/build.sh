#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Create necessary directories
mkdir -p logs

# Set environment variables
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

echo "✅ Backend build completed successfully!" 