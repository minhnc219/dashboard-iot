import DashboardActionTypes from './dashboard.type';
const INITIAL_STATE = {
    dashboards: [],
    dashboard: null,
    createMessage: '',
    updateMessage: '',
    removeMessage: '',
    listChartModels: [],
    createChartModelMessage: "",
    updateChartModelMessage: "",
    deleteChartModelMessage: "",
}
const dashboardReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case DashboardActionTypes.GET_LIST_DASHBOARDS: {
            return {
                ...state,
                dashboards: action.payload
            }
        }
        case DashboardActionTypes.GET_DASHBOARD: {
            return {
                ...state,
                dashboard: action.payload
            }
        }
        case DashboardActionTypes.CREATE_DASHBOARD: {
            return {
                ...state,
                createMessage: action.payload
            }
        }
        case DashboardActionTypes.EDIT_DASHBOARD: {
            return {
                ...state,
                updateMessage: action.payload
            }
        }
        case DashboardActionTypes.REMOVE_DASHBOARD: {
            return {
                ...state,
                removeMessage: action.payload
            }
        }
        case DashboardActionTypes.CREATE_CHART_MODEL: {
            return {
                ...state,
                createChartModelMessage: action.payload
            }
        }
        case DashboardActionTypes.UPDATE_CHART_MODEL: {
            return {
                ...state,
                updateChartModelMessage: action.payload
            }
        }
        case DashboardActionTypes.DELETE_CHART_MODEL: {
            return {
                ...state,
                deleteChartModelMessage: action.payload
            }
        }
        case DashboardActionTypes.GET_LIST_CHARTMODELS: {
            return {
                ...state,
                listChartModels: action.payload
            }
        }
        default:
            return state;
    }
}
export default dashboardReducer;