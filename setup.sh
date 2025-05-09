#!/bin/bash

echo "Installing dependencies..."
npm install

echo "Copying environment variables..."
cp .env.local.exemple .env.local

echo "Running setup..."
npm run setup

echo "Starting development server..."
npm run dev

