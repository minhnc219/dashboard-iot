import UserActionTypes from './user.type';
import axios from 'axios';
export const authLogin = (userModel) => ({
    type: UserActionTypes.AUTH_LOGIN,
    payload: userModel
});
export const userLogout = () => ({
    type: UserActionTypes.AUTH_LOGOUT
})
export const userRegisterCreator = (message) => ({
    type: UserActionTypes.AUTH_REGISTER,
    payload: message
})
export const authError = () => ({
    type: UserActionTypes.AUTH_ERROR
})
export const userRegister = (email, username, password, confirmPassword, displayName) => {
    return dispatch => {
        return axios.post("https://localhost:44321/api/User/Register", {
            Email: email,
            Username: username,
            Password: password,
            ConfirmPassword: confirmPassword,
            DisplayName: displayName
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(userRegisterCreator(response.data))
            }
            else{
                dispatch(userRegisterCreator("Register Error"))
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
}
export const userLogin = (username, password) => {
    return dispatch => {
        return axios.post("https://localhost:44321/api/User/Authenticate", {
            Username: username,
            Password: password
        })
        .then((response) => {
            if(response.status === 200){
                dispatch(authLogin(response.data))
            }
        })
        .catch(() => {
            dispatch(authError())
        })
    }
}