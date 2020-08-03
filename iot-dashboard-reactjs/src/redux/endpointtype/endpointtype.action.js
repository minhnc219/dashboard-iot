import EndpointTypeActionTypes from './endpointtype.type';
import axios from 'axios';
export const getEndpointTypes = (widgetTypes) => ({
    type: EndpointTypeActionTypes.GET_LIST_ENDPOINT_TYPES,
    payload: widgetTypes
});
export const getEndpointType = (widgetType) => ({
    type: EndpointTypeActionTypes.GET_ENDPOINT_TYPE,
    payload: widgetType
});
export const createEndpointType = (widgetType) => ({
    type: EndpointTypeActionTypes.CREATE_ENDPOINT_TYPE,
    payload: widgetType
});
export const updateEndpointType = (updateMessage) => ({
    type: EndpointTypeActionTypes.EDIT_ENDPOINT_TYPE,
    payload: updateMessage
});
export const removeEndpointType = (removeMessage) => ({
    type: EndpointTypeActionTypes.REMOVE_ENDPOINT_TYPE,
    payload: removeMessage
});
export const fetchEndpointTypes = (currentUser) => {
    return dispatch => {
        return axios.get("https://localhost:44321/api/DeviceType/GetDeviceTypes", {
            headers: {"Authorization": `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(getEndpointTypes(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
};
export const fetchEndpointType = (id, currentUser) => {
    return dispatch => {
        return axios.get(`https://localhost:44321/api/DeviceType/GetDeviceType/${id}` , {
            headers: {"Authorization": `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(getEndpointType(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
}
export const fetchCreateEndpointType = (name, description, measurementTypes, currentUser) => {
    return dispatch => {
        return axios.post("https://localhost:44321/api/DeviceType/CreateDeviceType", {
            Name: name,
            Description: description,
            MeasurementTypes: measurementTypes
        }, {
            headers: {"Authorization": `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 201){
                dispatch(createEndpointType(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
}
export const fetchUpdateEndpointType = (id, name, description, measurementTypes, currentUser) => {
    return dispatch => {
        return axios.put(`https://localhost:44321/api/DeviceType/UpdateDeviceType/${id}`, {
            Id: id,
            Name: name,
            Description: description,
            MeasurementTypes: measurementTypes
        }, {
            headers: {"Authorization": `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(updateEndpointType(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
}
export const fetchRemoveEndpointType = (id, currentUser) => {
    return dispatch => {
        return axios.delete(`https://localhost:44321/api/DeviceType/DeleteDeviceType/${id}`, {
            headers: {"Authorization": `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(removeEndpointType(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
}