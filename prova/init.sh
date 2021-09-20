#!/bin/sh
yarn
node ace migration:run
yarn dev
