import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import {categoryReducer} from "./category-reducer";
import thunk from 'redux-thunk';

let reducers = combineReducers({
    category: categoryReducer,
})
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(thunk))
);

window.store = store
export default store