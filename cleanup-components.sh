#!/bin/bash
# Script to remove unwanted components from GradientAble project

echo "Removing Analytics Dashboard component..."
rm -rf src/app/demo/dashboard

echo "Removing ApexCharts component..."
rm -rf src/app/demo/chart-maps

echo "Removing Forms component..."
rm -rf src/app/demo/forms

echo "Removing Tables component..."
rm -rf src/app/demo/tables

echo "Removing UI Element components (Manual level)..."
rm -rf src/app/demo/ui-element

echo "Removing chart-related fake database files..."
rm -f src/app/fack-db/chartData.ts
rm -f src/app/fack-db/series-data.ts

echo "Component cleanup complete!"
echo "Next steps:"
echo "1. Run: npm install (to update dependencies)"
echo "2. Run: npm start (to start the application)"
