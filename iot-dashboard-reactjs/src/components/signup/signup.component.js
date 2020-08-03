import React from 'react';
import './signup.style.scss';
import {FaUser, FaLock} from 'react-icons/fa';
import {MdMail} from 'react-icons/md';
import {GoPerson} from 'react-icons/go';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {withRouter} from 'react-router-dom';
import {userRegister} from '../../redux/user/user.action';
import { store } from 'react-notifications-component';
class SignUp extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            Username: '',
            Password: '',
            Email: '',
            ConfirmPassword: '',
            DisplayName: ''
        };
    }
    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({[name]: value});
    }
    handleSubmit = (event) => {
        const {Username, Password, Email, ConfirmPassword, DisplayName} = this.state;
        event.preventDefault();
        this.props.userRegister(Email, Username, Password, ConfirmPassword, DisplayName)
        .then(() => {
            if(this.props.registerMessage === "Register Success"){
                this.props.history.push("/login");
                store.addNotification({
                    title: "Đăng ký",
                    message: "Đăng ký thành công",
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                      duration: 2000,
                      onScreen: true
                    }
                  });
            }
            else{
                store.addNotification({
                    title: "Đăng ký",
                    message: "Đăng ký thất bại",
                    type: "danger",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                      duration: 2000,
                      onScreen: true
                    }
                  });
            }
        });
    }
    render(){
        return(
            <div id="signup-container">
                <h1>TẠO TÀI KHOẢN MỚI</h1>
                <form>
                    <div className="form-group">
                        <label className="form-input-label"><MdMail /></label>
                        <input className="form-input" type="email" name="Email"
                        onChange={this.handleChange} value={this.state.email} required 
                        placeholder="Email" autoComplete="off"/>
                    </div>
                    <div className = "form-group">
                        <label className="form-input-label"><FaUser /></label>
                        <input className="form-input" type="text" name="Username" 
                        onChange={this.handleChange} value={this.state.username} required 
                        placeholder="Username" autoComplete="off"/>
                    </div>
                    <div className = "form-group">
                        <label className="form-input-label"><FaLock /></label>
                        <input className="form-input" type="password" name="Password" 
                        onChange={this.handleChange} value={this.state.password} required 
                        placeholder="Password" autoComplete="off"/>
                    </div>
                    <div className = "form-group">
                        <label className="form-input-label"><FaLock /></label>
                        <input className="form-input" type="password" name="ConfirmPassword" 
                        onChange={this.handleChange} value={this.state.confirmpassword} required 
                        placeholder="Confirm Password" autoComplete="off"/>
                    </div>
                    <div className = "form-group">
                        <label className="form-input-label"><GoPerson /></label>
                        <input className="form-input" type="text" name="DisplayName" 
                        onChange={this.handleChange} value={this.state.displayname} required 
                        placeholder="Name" autoComplete="off"/>
                    </div>
                    <div className="button-submit-container">
                        <button type="submit" id="btn-submit" onClick={this.handleSubmit}>Register</button>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    registerMessage: state.user.registerMessage
});
const mapDispatchToProps = (dispatch) => ({
    userRegister: (email, username, password, confirmPassword, displayName) => dispatch(userRegister(email, username, password, confirmPassword, displayName))
})
export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(SignUp);