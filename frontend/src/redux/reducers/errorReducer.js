import { GET_ERRORS, CLEAR_ERRORS } from '../types';

function initialState() {
	return {
		message: null,
		status: null,
		id: null,
	};
}

const errorReducer = function (state = initialState(), action) {
	const { type, payload } = action
	switch (type) {
		case GET_ERRORS:
			return {
				message: payload.message,
				status: payload.status,
				id: payload.id,
			};
		case CLEAR_ERRORS:
			return {
				message: null,
				status: null,
				id: null,
			};
		default:
			return state;
	}
};

export default errorReducer;
