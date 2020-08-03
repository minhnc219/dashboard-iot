import EndpointActionTypes from './endpoint.type';
import axios from 'axios';
export const createEndpoint = (createMessage) => ({
    type: EndpointActionTypes.CREATE_ENDPOINT,
    payload: createMessage
});
export const updateEndpoint = (updateMessage) => ({
    type: EndpointActionTypes.EDIT_ENDPOINT,
    payload: updateMessage
})
export const deleteEndpoint = (deleteMessage) => ({
    type: EndpointActionTypes.REMOVE_ENDPOINT,
    payload: deleteMessage
})
export const getEndpoint = (endpoint) => ({
    type: EndpointActionTypes.GET_ENDPOINT,
    payload: endpoint
})
export const listEndpoints = (endpoints) => ({
    type: EndpointActionTypes.GET_LIST_ENDPOINTS,
    payload: endpoints
});
export const fetchListEndpoints = (id, currentUser) => {
    return dispatch => {
        axios.get(`https://localhost:44321/api/Device/GetDevices/${id}`, {
            headers: {"Authorization" : `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(listEndpoints(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
}
export const fetchEndpoint = (id, currentUser) => {
    return dispatch => {
        return axios.get(`https://localhost:44321/api/Device/GetDevice/${id}`, {
            headers: {"Authorization" : `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(getEndpoint(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
}
export const fetchCreateEndpoint = (connectedDeviceId, deviceTypeId, name, description, topic, gpio, currentUser) => {
    return dispatch => {
        return axios.post("https://localhost:44321/api/Device/CreateDevice", {
            ConnectedDeviceId: connectedDeviceId,
            DeviceTypeId: deviceTypeId,
            Name: name,
            Description: description,
            topic: topic,
            gpio: gpio
        }, {headers: {"Authorization" : `Bearer ${currentUser.token}`}})
        .then((response) => {
            if(response.status === 200){
                dispatch(createEndpoint(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
}
export const fetchUpdateEndpoint = (id, connectedDeviceId, deviceTypeId, name, description, topic, gpio, currentUser) => {
    return dispatch => {
        return axios.put(`https://localhost:44321/api/Device/UpdateDevice/${id}`, {
            Id: id, 
            ConnectedDeviceId: connectedDeviceId,
            DeviceTypeId: deviceTypeId,
            Name: name,
            Description: description,
            topic: topic,
            gpio: gpio
        }, {
            headers: {"Authorization" : `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(updateEndpoint(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
}
export const fetchDeleteEndpoint = (id, currentUser) => {
    return dispatch => {
        return axios.delete(`https://localhost:44321/api/Device/DeleteDevice/${id}`, {
            headers: {"Authorization" : `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(deleteEndpoint(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
}
