#!/bin/sh
git pull

npm run build

pm2 restart 0; pm2 monit