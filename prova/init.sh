#!/bin/sh
yarn
node ace migration:run
node -r @adonisjs/assembler/build/register japaFile.ts && yarn dev
