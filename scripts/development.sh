#!/bin/bash

set -e

connect() {
  docker exec -it redis redis-cli
}

down() {
  docker compose down
}

restart() {
  docker compose restart $@
}

up() {
  docker compose up -d
}

COMMAND=${1}
shift

case "$COMMAND" in
connect) connect $@ ;;
down) down $@ ;;
restart) restart $@ ;;
up) up $@ ;;
esac
