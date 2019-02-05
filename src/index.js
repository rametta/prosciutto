// dispatcher :: Dispatch -> Action|Action[] -> IO
const dispatcher = dispatch => actions => {
  if (!actions) {
    return
  }

  // An array of actions was returned
  if (actions.constructor === Array) {
    actions.map(dispatch)
    return
  }

  // Just one action was returned
  if (actions.type !== undefined) {
    dispatch(actions)
  }
}

// filterEpic :: Action -> Epic[]|Epic -> Boolean
const filterEpic = action => epic => epic.type.constructor === Array 
  ? epic.type.indexOf(action.type) > -1
  : epic.type === action.type

// prosciutto :: Epic[] -> Store -> Next -> Action -> IO
const prosciutto = epics => {
  if (!epics || epics.constructor !== Array) {
    throw new Error('PROSCIUTTO EPICS MUST BE AN ARRAY')
  }

  return store => next => action => {

    const result = next(action)
    const postActionState = store.getState()
    const actioner = dispatcher(store.dispatch)

    epics
      .filter(filterEpic(action))
      .forEach(epic => epic.do(result, postActionState).then(actioner).catch(actioner))
  }
}

export default prosciutto