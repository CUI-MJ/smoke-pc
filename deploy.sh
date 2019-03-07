#!/bin/sh
npm run build &
wait
./scripts/deploy_to_server.sh