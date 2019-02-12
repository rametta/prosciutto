[![npm](https://img.shields.io/npm/v/prosciutto.svg)](http://npm.im/prosciutto)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/rametta/prosciutto/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# 🥓 Prosciutto

> [Functor](https://en.wikipedia.org/wiki/Functor) based redux side effects

*Alternative to rxjs and redux-observable, or [meaball](https://www.npmjs.com/package/meatball)*

## Install
```sh
yarn add prosciutto
```

## Usage examples
Listen to any redux action, perform side effect, dispatch new redux actions
```js
// epics.js
import { searchResponse, seachError, clearSidebar } from './reducer'

// Simple example
const simpleEpic = is => is('SUBMIT_SEARCH')
  .map(({payload, store, dispatch}) => fetch(payload)
    .then(res => res.json())
    .then(json => dispatch(searchResponse(json)))
    .catch(e => dispatch(seachError(e))))

// Dispatch multiple actions with an array
const multipleEpic = is => is('SUBMIT_SEARCH')
  .map(({payload, store, dispatch}) => fetch(payload)
    .then(res => res.json())
    .then(json => dispatch([searchResponse(json), clearSidebar()]))
    .catch(e => dispatch(seachError(e)))
  )

export default [simpleEpic, multipleEpic]

// index.js
import prosciutto from 'prosciutto'
import epics from './epics'

const store = createStore(
  reducers,
  applyMiddleware(prosciutto(epics))
)
```