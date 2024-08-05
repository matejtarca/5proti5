## Overview

This is a clone of a popular gameshow in Slovakia called 5 proti 5 (Family Feud style game). It provides an option to define multiple rounds with answers.

## Starting the application

Make sure you have Node.js installed (at least version 18.7 but preferably the newest one) and pnpm package manager.

1. Fill out the `.env` file with `DATABASE_URL` variable pointing to a file that will be used for the sqlite3 database (it doesn't have to exist). E.g.:
```
DATABASE_URL="file:./dev.db"
```
2. Install all dependcies by running
```
pnpm install
```
3. Run database migrations:
```
pnpm prisma migrate dev
```
4. Start the dev server (will be started on `localhost:3000`)
```
pnpm dev
```

## Using the application

- First fill out the rounds with answers in the database. Currently only options to do this is by manually editing the local database.
- Navigate to `localhost:3000` and click on start game
- The game is controlled by keyboard as follows:
  - `1-9` reveals the corresponding answer
  - `x` marks wrong answer (if in initial state the X will be displayed globally, otherwise it will be assigned to current team).
  - `left right arrow keys` chooses which team is playing the question (has to be pressed after second answer is shown, but can be pressed earlier)
  - `n` goes to the next round.
- The game is trying to follow the rules of "5 proti 5" as closely as possible and won't allow you to do unexpected things.
