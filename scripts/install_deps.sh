#!/bin/bash
cd /var/www/nodeapp
pm2 start index.js --name nodeapp || pm2 restart nodeapp
 