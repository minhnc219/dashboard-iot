import UserActionTypes from './user.type';
const INITIAL_STATE = {
    currentUser: null,
    isLoggedIn: false,
    errorMessage: '',
    registerMessage: ''
}
const useReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case UserActionTypes.AUTH_LOGIN:
            return {
                ...state,
                isLoggedIn: true,
                currentUser: action.payload,
                errorMessage: ''
            };
        case UserActionTypes.AUTH_ERROR:
            return {
                ...state,
                isLoggedIn: false,
                currentUser: null,
                errorMessage: "Username or password is incorrect"
            }
        case UserActionTypes.AUTH_LOGOUT:
            return INITIAL_STATE;
        case UserActionTypes.AUTH_REGISTER:
            return {
                ...state,
                registerMessage: action.payload
            }
        default:
            return state;
    }
}
export default useReducer;