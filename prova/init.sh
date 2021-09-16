#!/bin/sh
yarn
node ace migration:run
node ace serve --watch
node ace scheduler:run
