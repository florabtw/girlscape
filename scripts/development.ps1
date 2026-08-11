param(
    [Parameter(Position = 0)]
    [string]$Command,
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Args
)
$ErrorActionPreference = 'Stop'
switch ($Command.ToLower()) {
    'connect' {
        docker exec -it redis redis-cli
    }
    'down' {
        docker compose down
    }
    'restart' {
        docker compose restart @Args
    }
    'up' {
        docker compose up -d
    }
    default {
        Write-Error "'$Command' is not a valid command. Valid options: connect, down, restart, up"
        exit 1
    }
}