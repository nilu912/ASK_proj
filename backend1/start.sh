#!/bin/bash

# Colors for terminal output
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${YELLOW}ASK Foundation Backend Starter${NC}"
echo -e "${YELLOW}=============================${NC}"

# Check if MongoDB is running
echo -e "${GREEN}Checking MongoDB connection...${NC}"
if ! nc -z localhost 27017 &>/dev/null; then
  echo -e "${RED}MongoDB is not running on localhost:27017${NC}"
  echo -e "${YELLOW}Please start MongoDB before running this script${NC}"
  exit 1
fi
echo -e "${GREEN}MongoDB is running!${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
  echo -e "${YELLOW}No .env file found. Creating from .env.example...${NC}"
  if [ -f .env.example ]; then
    cp .env.example .env
    echo -e "${GREEN}.env file created. Please update it with your configuration.${NC}"
  else
    echo -e "${RED}No .env.example file found. Please create a .env file manually.${NC}"
    exit 1
  fi
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
  echo -e "${YELLOW}Installing dependencies...${NC}"
  npm install
fi

# Check if uploads directory exists
if [ ! -d uploads ]; then
  echo -e "${YELLOW}Creating uploads directory...${NC}"
  mkdir -p uploads/images
  mkdir -p uploads/videos
  mkdir -p uploads/documents
  mkdir -p uploads/misc
  echo -e "${GREEN}Uploads directory created!${NC}"
fi

# Start the server
echo -e "${GREEN}Starting the server...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
npm run dev