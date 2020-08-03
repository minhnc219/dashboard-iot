import DeviceTypeActionTypes from './devicetype.type';
const INITIAL_STATE = {
    deviceTypes: [],
    deviceType: null,
    createMessage: "",
    updateMessage: "",
    removeMessage: ""
};
const deviceTypeReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case DeviceTypeActionTypes.GET_LIST_DEVICE_TYPES:
            return {
                ...state,
                deviceTypes: action.payload
            }
        case DeviceTypeActionTypes.GET_DEVICE_TYPE:
            return{
                ...state,
                deviceType: action.payload
            }
        case DeviceTypeActionTypes.CREATE_DEVICE_TYPE:
            return{
                ...state,
                createMessage: action.payload
            }
        case DeviceTypeActionTypes.EDIT_DEVICE_TYPE:
            return{
                ...state,
                updateMessage: action.payload
            }
        case DeviceTypeActionTypes.REMOVE_DEVICE_TYPE:
            return{
                ...state,
                removeMessage: action.payload
            }
        default:
            return state;
    }
}
export default deviceTypeReducer;