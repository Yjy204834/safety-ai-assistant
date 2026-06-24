#!/usr/bin/env sh

set -e

npm run build:h5

cd dist/build/h5

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:您的GitHub用户名/safety-ai-assistant.git master:gh-pages

cd -