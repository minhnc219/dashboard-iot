import DeviceActionTypes from './device.type';
const INITIAL_STATE = {
    devices: [],
    device: null,
    createMessage: '',
    updateMessage: '',
    removeMessage: '',
    listDevices: []
}
const deviceReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case DeviceActionTypes.GET_LIST_DEVICES: {
            return {
                ...state,
                devices: action.payload
            }
        }
        case DeviceActionTypes.GET_DEVICE: {
            return {
                ...state,
                device: action.payload
            }
        }
        case DeviceActionTypes.CREATE_DEVICE: {
            return {
                ...state,
                createMessage: action.payload
            }
        }
        case DeviceActionTypes.EDIT_DEVICE: {
            return{
                ...state,
                updateMessage: action.payload
            }
        }
        case DeviceActionTypes.REMOVE_DEVICE: {
            return {
                ...state,
                removeMessage: action.payload
            }
        }
        case DeviceActionTypes.GET_ALL_ENDPOINTS: {
            return {
                ...state,
                listDevices: action.payload
            }
        }
        default:
            return state;
    }
}
export default deviceReducer;