#!/bin/bash

VERSION="1.0.0"

echo "Deploying the project"
docker build -t d4ylight/route-navigation-frontend:$VERSION -t d4ylight/route-navigation-frontend:latest . --target production-stage --no-cache
