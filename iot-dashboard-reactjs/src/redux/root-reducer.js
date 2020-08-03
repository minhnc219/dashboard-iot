import {combineReducers} from 'redux';
import userReducer from './user/user.reducer';
import endpointTypeReducer from './endpointtype/endpointtype.reducer';
import deviceTypeReducer from './devicetype/devicetype.reducer';
import deviceReducer from './device/device.reducer';
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import endpointReducer from './endpoint/endpoint.reducer';
import dashboardReducer from './dashboard/dashboard.reducer';
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user']
}
const rootReducer = combineReducers({
    user: userReducer,
    endpointType: endpointTypeReducer,
    deviceType: deviceTypeReducer,
    device: deviceReducer,
    endpoint: endpointReducer,
    dashboard: dashboardReducer
});
export default persistReducer(persistConfig, rootReducer);