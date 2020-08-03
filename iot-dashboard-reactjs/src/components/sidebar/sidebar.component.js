import React from 'react';
import './sidebar.style.scss';
import Logo from '../../assets/logo.png';
import {NavLink} from 'react-router-dom';
import {AiFillCaretDown} from 'react-icons/ai';
import {withRouter} from 'react-router-dom';
import {compose} from 'redux';
import {connect} from 'react-redux';
class SideBar extends React.Component{
    constructor(props){
        super(props);
        this.dropdown = React.createRef();
    }
    handleDropdown = () => {
        if(this.dropdown.current.style.display === "none"){
            this.dropdown.current.style.display = "block";
        }
        else{
            this.dropdown.current.style.display = "none";
        }
    }
    render(){
        return(
            <div id="sidebar-container">
                <div id="flex-container-logo-sidebar">
                    <div id="flex-item-logo-sidebar">
                        <img src={Logo} alt="Logo"/>
                    </div>
                </div>
                <div id="flex-container-sidebar">
                    <ul>
                        <li>
                            <button onClick={this.handleDropdown}><p>Quản lý</p><AiFillCaretDown/></button>
                            <ul ref={this.dropdown}>
                                <NavLink to="/devicetype" activeClassName="active">Kiểu thiết bị</NavLink>
                                <NavLink to="/endpointtype" activeClassName="active">Kiểu thiết bị cảm biến</NavLink>
                                <NavLink to="/device" activeClassName="active">Thiết bị</NavLink>
                            </ul>
                        </li>
                        <li><button onClick={() => {
                            this.props.history.push("/dashboard");
                            window.location.reload();
                    }} activeClassName="active">Bảng điều khiển</button></li>
                    </ul>
                </div>
            </div>
        )
    }
    
}
export default compose(withRouter, connect())(SideBar);