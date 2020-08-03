import DashboardActionTypes from './dashboard.type';
import axios from 'axios';
export const getListDashboards = (listDashboards) => ({
    type: DashboardActionTypes.GET_LIST_DASHBOARDS,
    payload: listDashboards
});
export const getDashboard = (dashboard) => ({
    type: DashboardActionTypes.GET_DASHBOARD,
    payload: dashboard
});
export const createDashboard = (createMessage) => ({
    type: DashboardActionTypes.CREATE_DASHBOARD,
    payload: createMessage
});
export const updateDashboard = (updateMessage) => ({
    type: DashboardActionTypes.EDIT_DASHBOARD,
    payload: updateMessage
});
export const deleteDashboard = (deleteMessage) => ({
    type: DashboardActionTypes.REMOVE_DASHBOARD,
    payload: deleteMessage
})
export const createChartModel = (createMessage) => ({
    type: DashboardActionTypes.CREATE_CHART_MODEL,
    payload: createMessage
});
export const updateChartModel = (updateMessage) => ({
    type: DashboardActionTypes.UPDATE_CHART_MODEL,
    payload: updateMessage
});
export const deleteChartModel = (deleteMessage) => ({
    type: DashboardActionTypes.DELETE_CHART_MODEL,
    payload: deleteMessage
});
export const getListChartModels = (chartModels) => ({
    type: DashboardActionTypes.GET_LIST_CHARTMODELS,
    payload: chartModels
});
export const fetchListDashboards = (currentUser) => {
    return dispatch => {
        return axios.get(`https://localhost:44321/api/Dashboard/GetDashboards`, {
            headers: {"Authorization": `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(getListDashboards(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
}
export const fetchDashboard = (id, currentUser) => {
    return dispatch => {
        return axios.get(`ttps://localhost:44321/api/Dashboard/GetDashboard/${id}`, {
            headers: {"Authorization": `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(getDashboard(response.data))
            }
        })
    }
}
export const fetchCreateDashboard = (name, currentUser) => {
    return dispatch => {
        return axios.post(`https://localhost:44321/api/Dashboard/CreateDashboard/`, {
            Name: name
        }, {
            headers: {"Authorization": `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(createDashboard(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
}
export const fetchUpdateDashboard = (id, name, currentUser) => {
    return dispatch => {
        return axios.post(`https://localhost:44321/api/Dashboard/UpdateDashboard/${id}`, {
            Name: name
        }, {
            headers: {"Authorization": `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(updateDashboard(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
}
export const fetchRemoveDashboard = (id, currentUser) => {
    return dispatch => {
        return axios.delete(`https://localhost:44321/api/Dashboard/DeleteDashboard/${id}`, {
            headers: {"Authorization": `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(deleteDashboard(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
}
export const fetchListChartModels = (id, currentUser) => {
    return dispatch => {
        return axios.get(`https://localhost:44321/api/Dashboard/GetChartModels/${id}`, {
            headers: {"Authorization": `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(getListChartModels(response.data))
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }
}
export const fetchCreateChartModel = (id, typeChart, currentUser) => {
    return dispatch => {
        return axios.post(`https://localhost:44321/api/Dashboard/CreateChartModel/${id}`, {
            TypeChart: typeChart
        },{
            headers: {"Authorization": `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(createChartModel(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
}
export const fetchUpdateChartModel = (dashboardId, chartModelId, typeChart, typeData, title, deviceType, parameter, devices, listParameter, currentUser) => {
    return dispatch => {
        return axios.post(`https://localhost:44321/api/Dashboard/UpdateChartModel/${dashboardId}/${chartModelId}`, {
            TypeChart: typeChart,
            TypeData: typeData,
            Title: title,
            DeviceType: deviceType,
            Parameter: parameter,
            Devices: devices,
            DeviceTypeParameters: listParameter
        }, {
            headers: {"Authorization": `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(updateChartModel(response.data))
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
}
export const fetchDeleteChartModel = (dashboardId, chartModelId, currentUser) => {
    return dispatch => {
        return axios.delete(`https://localhost:44321/api/Dashboard/DeleteChartModel/${dashboardId}/${chartModelId}`, {
            headers: {"Authorization": `Bearer ${currentUser.token}`}
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(deleteChartModel(response.data))
            }
        })
    }
}
