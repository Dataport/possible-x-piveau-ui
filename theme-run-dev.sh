#!/bin/ash
#
cd /App
vars=$(env | grep VUE_ | sed -e 's/^/$/' )
echo "Found the following environment variables: "
echo $vars
envsubst "$vars" < config/runtime-config.tmp > config/runtime-config.js
cat config/runtime-config.js
echo "Installing node packages please be patient"
npm --silent ci
echo "Running development server"
npm run serve
