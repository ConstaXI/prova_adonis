#!/bin/sh
node ace migration:run
node -r @adonisjs/assembler/build/register japaFile.ts
