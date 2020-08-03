import DeviceTypeActionTypes from './devicetype.type';
import axios from 'axios';
export const getDeviceTypes = (widgetTypes) => ({
    type: DeviceTypeActionTypes.GET_LIST_DEVICE_TYPES,
    payload: widgetTypes
});
export const getDeviceType = (widgetType) => ({
    type: DeviceTypeActionTypes.GET_DEVICE_TYPE,
    payload: widgetType
});
export const createDeviceType = (createMessage) => ({
    type: DeviceTypeActionTypes.CREATE_DEVICE_TYPE,
    payload: createMessage
});
export const updateDeviceType = (updateMessage) => ({
    type: DeviceTypeActionTypes.EDIT_DEVICE_TYPE,
    payload: updateMessage
});
export const removeDeviceType = (removeMessage) => ({
    type: DeviceTypeActionTypes.REMOVE_DEVICE_TYPE,
    payload: removeMessage
});

export const fetchDeviceTypes = () => {
    return dispatch => {
        axios.get("https://localhost:44321/api/ConnectDeviceType/GetConnectedDeviceTypes")
        .then((response) => {
            if(response.status === 200){
                dispatch(getDeviceTypes(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
};
export const fetchDeviceType = (id) => {
    return dispatch => {
        axios.get(`https://localhost:44321/api/ConnectDeviceType/GetConnectedDeviceType/${id}`)
        .then((response) => {
            if(response.status === 200){
                dispatch(getDeviceType(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
}
export const fetchCreateDeviceType = (name, gpios) => {
    return dispatch => {
        return axios.post("https://localhost:44321/api/ConnectDeviceType/CreateConnectedDeviceType", {
            Name: name,
            Gpios: gpios
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(createDeviceType(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
}
export const fetchUpdateDeviceType = (id, name, gpios) => {
    return dispatch => {
        return axios.put(`https://localhost:44321/api/ConnectDeviceType/UpdateConnectedDeviceType/${id}`, {
            Id: id,
            Name: name,
            Gpios: gpios
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(updateDeviceType(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
}
export const fetchRemoveDeviceType = (id) => {
    return dispatch => {
        return axios.delete(`https://localhost:44321/api/ConnectDeviceType/RemoveConnectedDeviceType/${id}`)
        .then((response) => {
            if(response.status === 200){
                dispatch(removeDeviceType(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
}

