import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

const initialState = {};

const middleware = [thunk];

var store;
if (process.env.NODE_ENV === 'production') {
	store = createStore(reducers, initialState, compose(applyMiddleware(...middleware)));
} else {
	store = createStore(
		reducers,
		initialState,
		compose(
			applyMiddleware(...middleware),
			window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
		)
	);
}
export default store;
