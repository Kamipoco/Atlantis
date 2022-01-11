#!/bin/bash

cd /app/node_modules/edge-js
dotnet restore
dotnet build

cd /app
yarn start