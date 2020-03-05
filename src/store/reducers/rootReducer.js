import { combineReducers } from 'redux'

import partyReducer from './partyReducer';

const rootReducer = combineReducers({
  party: partyReducer
})

export default rootReducer