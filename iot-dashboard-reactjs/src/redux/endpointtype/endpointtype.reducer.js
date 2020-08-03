import EndpointTypeActionTypes from './endpointtype.type';
const INITIAL_STATE = {
    endpointTypes: [],
    endpointType: null,
    createMessage: '',
    updateMessage: '',
    removeMessage: ''
};
const endpointTypeReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case EndpointTypeActionTypes.GET_LIST_ENDPOINT_TYPES:
            return {
                ...state,
                endpointTypes: action.payload
            }
        case EndpointTypeActionTypes.GET_ENDPOINT_TYPE:
            return {
                ...state,
                endpointType: action.payload
            }
        case EndpointTypeActionTypes.CREATE_ENDPOINT_TYPE:
            return{
                ...state,
                createMessage: action.payload
            }
        case EndpointTypeActionTypes.EDIT_ENDPOINT_TYPE:
            return{
                ...state,
                updateMessage: action.payload
            }
        case EndpointTypeActionTypes.REMOVE_ENDPOINT_TYPE:
            return{
                ...state,
                removeMessage: action.payload
            }
        default:
            return state;
    }
}
export default endpointTypeReducer;