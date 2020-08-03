import DeviceActionTypes from './device.type';
import axios from 'axios';
export const createDevice = (createMessage) => ({
    type: DeviceActionTypes.CREATE_DEVICE,
    payload: createMessage
});
export const updateDevice = (updateMessage) => ({
    type: DeviceActionTypes.EDIT_DEVICE,
    payload: updateMessage
});
export const deleteDevice = (deleteMessage) => ({
    type: DeviceActionTypes.REMOVE_DEVICE,
    payload: deleteMessage
})
export const listDevices = (devices) => ({
    type: DeviceActionTypes.GET_LIST_DEVICES,
    payload: devices
});
export const getDevice = (device) => ({
    type: DeviceActionTypes.GET_DEVICE,
    payload: device
});
export const getListEndpoints = (devices) => ({
    type: DeviceActionTypes.GET_ALL_ENDPOINTS,
    payload: devices
})
export const fetchDevices = (currentUser) => {
    return dispatch => {
        axios.get("https://localhost:44321/api/ConnectDevice/GetConnectedDevices", {
            headers: {"Authorization" : `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(listDevices(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
}
export const fetchCreateDevice = (id, name, location, currentUser) => {
    return dispatch => {
        return axios.post("https://localhost:44321/api/ConnectDevice/CreateConnectedDevice", {
            ConnectedDeviceTypeId: id,
            Name: name,
            Location: location
        },
        {headers: {"Authorization" : `Bearer ${currentUser.token}`}})
        .then((response) => {
            if(response.status === 200){
                dispatch(createDevice(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
}
export const fetchDevice = (id, currentUser) => {
    return dispatch => {
        return axios.get(`https://localhost:44321/api/ConnectDevice/GetConnectedDevice/${id}`, {
            headers: {"Authorization" : `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(getDevice(response.data))
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }
}
export const fetchListEndpoints = (currentUser) => {
    return dispatch => {
        return axios.get(`https://localhost:44321/api/ConnectDevice/GetAllDevices`, {
            headers: {"Authorization" : `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(getListEndpoints(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
}
