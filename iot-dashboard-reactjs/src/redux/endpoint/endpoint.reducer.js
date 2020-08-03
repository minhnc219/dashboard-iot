import EndpointActionTypes from './endpoint.type';
const INITIAL_STATE = {
    endpoints: [],
    endpoint: null,
    createMessage: "",
    updateMessage: "",
    removeMessage: ""

}
const endpointReducer = (state=INITIAL_STATE, action) => {
    switch(action.type){
        case EndpointActionTypes.GET_LIST_ENDPOINTS:
            return {
                ...state,
                endpoints: action.payload
            }
        case EndpointActionTypes.GET_ENDPOINT:
            return {
                ...state,
                endpoint: action.payload
            }
        case EndpointActionTypes.CREATE_ENDPOINT:
            return {
                ...state,
                createMessage: action.payload
            }
        case EndpointActionTypes.EDIT_ENDPOINT:
            return {
                ...state,
                updateMessage: action.payload
            }
        case EndpointActionTypes.REMOVE_ENDPOINT:
            return {
                ...state,
                removeMessage: action.payload
            }
        default:
            return state
    }
}
export default endpointReducer;