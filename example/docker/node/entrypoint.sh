#!/bin/sh

# run npm install

if [ ! -d "node_modules" ]; then
  npm install
fi

exec "$@"
