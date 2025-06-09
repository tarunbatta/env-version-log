#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the package.json path
const packageJsonPath = path.resolve(process.cwd(), 'package.json');

// Read the current package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Generate build number based on timestamp
const now = new Date();
const buildNumber = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

// Update package.json with the new build number
packageJson.buildNumber = buildNumber;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

// Output the build number for use in environment variables
console.log(buildNumber); 