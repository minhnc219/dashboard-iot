import React from 'react';
import './avatar.style.scss';
import ImgAvatar from '../../assets/img_avatar.png';
import {withRouter} from 'react-router-dom';
import {compose} from 'redux';
import {connect} from 'react-redux';
class Avatar extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        };
    }
    render(){
        return(
            <div id="avatar-container">
                <div id="flex-item-avatar">
                <img src={ImgAvatar} alt="Avatar"/>
            </div>
            <div id="flex-item-dropdown">
                <button onClick={() => {
                    localStorage.clear();
                    this.props.history.push("/login");
                }}>Đăng xuất</button>
            </div>
        </div>
        )
    }
}
const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})
export default compose(withRouter, connect(mapStateToProps))(Avatar);