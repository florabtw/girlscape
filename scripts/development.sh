#!/bin/bash

set -e

connect() {
  docker exec -it redis redis-cli
}

down() {
  docker compose down
}

up() {
  docker compose up -d
}

COMMAND=${1}
shift

case "$COMMAND" in
connect) connect $@ ;;
down) down $@ ;;
up) up $@ ;;
esac
