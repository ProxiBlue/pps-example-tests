#!/bin/bash

set -xe

NODE_TLS_REJECT_UNAUTHORIZED=0 APP_NAME=pps  TEST_BASE=admin npx playwright test
NODE_TLS_REJECT_UNAUTHORIZED=0 APP_NAME=pps  TEST_BASE=hyva npx playwright test
NODE_TLS_REJECT_UNAUTHORIZED=0 APP_NAME=pps  TEST_BASE=pps npx playwright test --grep-invert
