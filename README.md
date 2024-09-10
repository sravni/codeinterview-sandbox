# Codeinterview-service &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](blob/main/LICENSE.md) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](how-to-contribute.html#your-first-pull-request)

## What is Codeinterview?

Codeinterview is a project for conducting interviews for a developer position.

Out of the box:

- Codeinterview allows you to create, edit, delete an interview
- Codeinterview allows you to create a websocket room for livecoding
- Codeinterview allows you to evaluate the interview based on many parameters
- Codeinterview allows you to save your tasks for interviews. At the time of the interview, you can conveniently find the desired task and quickly use its interview

## Available Languages for livecoding

- JavaScript
- Typescript
- Go
- C#

## Getting Started

To start using codeinterview you need to launch 3 services.
This service is responsible for execute user code.

1. Install dependencies
   `yarn`
2. Copy `./.env.example` to `./.env`
3. Start application
   `yarn start`

## Docker

1. Make Docker image by `./Dockerfile`
   `docker build -t codeinterview-sandbox .`
2. Run docker image with enviroment variables from `.env`
   `docker run --env-file ./.env codeinterview-sandbox`

## Community

- Contributing to Codeinterview - Start here if you want to contribute
