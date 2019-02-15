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

const isListening = (currentActionType, epicActionType) => epicActionType.constructor === Array 
  ? epicActionType.indexOf(currentActionType) > -1
  : epicActionType === currentActionType

const None = ({
  map: () => None,
  inspect: () => `None`
})

const Some = x => ({
  map: cb => Some(cb(x)),
  inspect: () => `Some(${x})`
})

const is = params => currentActionType => epicActionType => isListening(currentActionType, epicActionType)
  ? Some(params)
  : None

// prosciutto :: Epic[] -> Store -> Next -> Action -> IO
const prosciutto = epics => {
  if (!epics || epics.constructor !== Array) {
    throw new Error('PROSCIUTTO EPICS MUST BE AN ARRAY')
  }

  return store => next => action => {
    const result = next(action)
    const postActionState = store.getState()
    const actioner = dispatcher(store.dispatch)
    const epicker = is({ payload: result, store: postActionState, dispatch: actioner })(action.type)
    epics.forEach(epicker)
  }
}

export default prosciutto