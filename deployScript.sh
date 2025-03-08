#!/bin/bash

echo "Deploying the project"
docker build -t d4ylight/route-navigation-frontend . --target production-stage --no-cache
