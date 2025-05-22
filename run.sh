#!/bin/bash

set -xe

APP_NAME=pps NODE_ENV=dev TEST_BASE=admin npx playwright test --workers=1 --retries=0
APP_NAME=pps NODE_ENV=dev TEST_BASE=hyva npx playwright test
APP_NAME=pps NODE_ENV=dev TEST_BASE=pps npx playwright test tests/admin.spec.ts --workers=1
APP_NAME=pps NODE_ENV=dev TEST_BASE=pps npx playwright test --grep-invert tests/admin.spec.ts
