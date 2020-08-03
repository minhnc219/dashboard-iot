import React from 'react';
import './signin.style.scss';
import Logo from '../../assets/logo.png';
import {FaUser, FaLock} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {userLogin} from '../../redux/user/user.action';
import {withRouter} from 'react-router-dom';
import {compose} from 'redux';
import { store } from 'react-notifications-component';
class SignIn extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            Username: '',
            Password: ''
        };
    }
    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({[name]: value});
    }
    handleSubmit = async (event) => {
        const {Username, Password} = this.state;
        event.preventDefault();
        this.props.userLogin(Username, Password).then(() => {
            if(this.props.isLoggedIn === true){
                this.props.history.push("/dashboard");
                store.addNotification({
                    title: "Đăng nhập",
                    message: "Đăng nhập thành công",
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
                    title: "Đăng nhập",
                    message: "Đăng nhập thất bại",
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
        this.setState({Username: '', Password: ''});
    }
    render(){
        return(
            <div id="signin-container">
                <div id="flex-container-logo-signin">
                    <div id="flex-item-logo-signin">
                        <img src={Logo} alt="logo"/>
                    </div>
                    <p>ĐĂNG NHẬP</p>
                </div>
                <div id="flex-container-signin">
                    <form>
                        <div className="form-group">
                            <label className="form-input-label"><FaUser /></label>
                            <input className="form-input" type="text" name="Username" onChange={this.handleChange} value={this.state.Username} required placeholder="Tên tài khoản" autoComplete="off"/>
                        </div>
                        <div className="form-group">
                            <label className="form-input-label"><FaLock /></label>
                            <input className="form-input" type="password" name="Password" onChange={this.handleChange} value={this.state.Password} required placeholder="Mật khẩu" autoComplete="off"/>
                        </div>
                        <div className="form-group-checkbox">
                            <input type="checkbox" id="ckb" />
                            <label htmlFor="ckb">Nhớ</label>
                        </div>
                        <div className="container-button-submit">
                            <button type="submit" id="btn-submit" onClick={this.handleSubmit}>Đăng nhập</button>
                        </div>
                        <div className="container-create-link">
                            <label id="register-user-label">Không có tài khoản!</label>
                            <Link id="register-user-link" to="/register">Bấm vào đây</Link>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    isLoggedIn: state.user.isLoggedIn,
})
const mapDispatchToProps = (dispatch) => ({
    userLogin: (username, password) => dispatch(userLogin(username, password)),
})
export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(SignIn);