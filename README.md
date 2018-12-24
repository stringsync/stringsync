# StringSync [![Build Status](https://travis-ci.com/jaredjj3/string-sync.svg?branch=master)](https://travis-ci.com/jaredjj3/string-sync)

[🦑 stringsync.com](https://stringsync.com)

StringSync is a web application that simplifies learning how to play guitar. It accomplishes this goal by providing a user interface that abstracts the inherent complexities in reading guitar tablature.

## Philosophy

>if it sounds good, then it is good

Providing plain tablature is the philosophical equivalent of giving a man a fish to eat for a day. On the other hand, StringSync is teaching that man how to fish. By synchronizing tablature with audio and video, students will naturally rely on their instincts:

>the simpler, the better

Communicating music is inherently complex. StringSync employs minimalistic but intuitive designs, which prevents complexity overhead from the user's POV.

The implementation throughout the codebase also adheres to the philosophy, where readability and maintainability is preferred over correctness or performance.

## Features

### Notation Show Page

<img width="1674" alt="screen shot 2018-12-24 at 12 58 18 pm" src="https://user-images.githubusercontent.com/19232300/50404926-9c875f00-077b-11e9-8443-583ea8dc8075.png">

## Technologies

### Backend
StringSync's backend is written in Ruby and uses Postgres for the database engine.

Some of the Ruby libraries used are:

- `rails` web framework
- `devise_token_auth` and `omniauth` authentication and session management

The entire list of Ruby technologies used is in the `Gemfile` of the root of the project.

### Frontend
StringSync's frontend is written in TypeScript, a statically typed superset of JavaScript.

Some of the JavaScript libraries used are:

- `react` library used to make interfaces
- `create-react-app` zero configuration tool used to create React projects
- `antd` library of React components to build rich user interfaces
- `j-toker` the client side counterpart of `devise-token-auth`
- `vextab` tablature encoding engine

### Platforms
StringSync uses `heroku` to host the application. It also uses `travis-ci` to automatically run backend and frontend tests whenever a commit is pushed to `master`. If the tests pass, `travis-ci` will run a hook that deploys the application to `heroku`. Otherwise, `travis-ci` will send an email notifying that tests are failing on `master`.
