# Executables (local)
DOCKER_COMP = docker compose

# Docker containers
PHP_CONT 	= $(DOCKER_COMP) exec php

# Executables PHP
PHP      	= $(PHP_CONT) php
COMPOSER 	= $(PHP_CONT) composer
SYMFONY  	= $(PHP) bin/console

# Executables JS
YARN     	= $(PHP_CONT) yarn
NPX		 	= $(PHP_CONT) npx

# Executables Code-Quality
PHPSTAN  	= $(PHP_CONT) vendor/bin/phpstan
ESLINT   	= $(YARN) lint

# Misc
.DEFAULT_GOAL = help
.PHONY        : help build up start down logs sh composer vendor sf cc test permissions \
				composer-install composer-update composer-require composer-require-dev composer-remove \
				symfony yarn yarn-install yarn-add yarn-add-dev yarn-remove yarn-dev yarn-build \
				npx code-quality phpstan eslint

## —— 🎵 🐳 The Symfony Docker Makefile 🐳 🎵 ——————————————————————————————————
help: ## Outputs this help screen
	@grep -E '(^[a-zA-Z0-9\./_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

## —— Docker 🐳 ————————————————————————————————————————————————————————————————
build: ## Builds the Docker images
	@$(DOCKER_COMP) build --pull --no-cache

up: ## Start the docker hub
	@$(DOCKER_COMP) --env-file .env.dev up --detach

start: build up ## Build and start the containers

down: ## Stop the docker hub
	@$(DOCKER_COMP) down --remove-orphans

restart: down up ## Restart the docker hub

logs: ## Show live logs
	@$(DOCKER_COMP) logs --tail=0 --follow

sh: ## Connect to the FrankenPHP container
	@$(PHP_CONT) sh

bash: ## Connect to the FrankenPHP container via bash so up and down arrows go to previous commands
	@$(PHP_CONT) bash

prune-project: ## Remove all stopped containers, dangling images and unused networks
	@$(DOCKER_COMP) down --volumes --remove-orphans --rmi local

test: ## Start tests with phpunit, pass the parameter "c=" to add options to phpunit, example: make test c="--group e2e --stop-on-failure"
	@$(eval c ?=)
	@$(DOCKER_COMP) exec -e APP_ENV=test php bin/phpunit $(c)

## —— Project 🏗️ ———————————————————————————————————————————————————————————————
permissions: ## Fix permissions
	sudo chmod -R 777 ./

## —— Composer 🧙 ——————————————————————————————————————————————————————————————
composer: ## Run composer, pass the parameter "c=" to run a given command, example: make composer c='req symfony/orm-pack'
	@$(eval c ?=)
	@$(COMPOSER) $(c)

composer-install: ## Install composer dependencies
	@$(eval c ?=)
	@$(COMPOSER) install --prefer-dist --no-progress --no-scripts --no-interaction

composer-update: ## Update composer dependencies
	@$(eval c ?=)
	@$(COMPOSER) update --prefer-dist --no-progress --no-scripts --no-interaction

composer-require: ## Require a composer dependency, pass the parameter "c=" to add a given dependency
	@$(eval c ?=)
	@$(COMPOSER) require $(c)

composer-require-dev: ## Require a composer dependency in dev mode, pass the parameter "c=" to add a given
	@$(eval c ?=)
	@$(COMPOSER) require $(c) --dev

composer-remove: ## Remove a composer dependency, pass the parameter "c=" to remove a given dependency
	@$(eval c ?=)
	@$(COMPOSER) remove $(c)

vendor: ## Install vendors according to the current composer.lock file
vendor: c=install --prefer-dist --no-dev --no-progress --no-scripts --no-interaction
vendor: composer

## —— Symfony 🎵 ———————————————————————————————————————————————————————————————
symfony: ## List all Symfony commands or pass the parameter "c=" to run a given command, example: make sf c=about
	@$(eval c ?=)
	@$(SYMFONY) $(c)

cc: c=c:c ## Clear the cache
cc: symfony

## —— Yarn 🧶 ————————————————
yarn: ## Run yarn
	@$(eval c ?=)
	@$(YARN) $(c)

yarn-install: ## Install yarn dependencies
	@$(YARN) install

yarn-add: ## Add a yarn dependency, pass the parameter "c=" to add a given dependency
	@$(eval c ?=)
	@$(YARN) add $(c)

yarn-add-dev: ## Add a yarn dependency in dev mode, pass the parameter "c=" to add a given
	@$(eval c ?=)
	@$(YARN) add $(c) --dev

yarn-remove: ## Remove a yarn dependency, pass the parameter "c=" to remove a given dependency
	@$(eval c ?=)
	@$(YARN) remove $(c)

yarn-dev: ## Install yarn dependencies in dev mode
	@$(YARN) dev

yarn-build: ## Build the assets
	@$(YARN) build

# NPX 🧶 ———————————————————————————————————————————————
npx: ## Run npx
	@$(eval c ?=)
	@$(NPX) $(c)

# Code-Quality 🧪 —————————————————————————————————————————
code-quality: phpstan eslint

phpstan: ## Run phpstan
	@$(eval c ?=)
	@$(PHPSTAN) analyse $(c)

eslint: ## Run eslint
	@$(eval c ?=)
	@$(ESLINT) $(c)
