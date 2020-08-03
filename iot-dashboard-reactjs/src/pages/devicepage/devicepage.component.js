import React from 'react';
import './devicepage.style.scss';
import {withRouter} from 'react-router-dom';
import {compose} from 'redux';
import {connect} from 'react-redux';
import Sidebar from '../../components/sidebar/sidebar.component';
import Avatar from '../../components/avatar/avatar.component';
import {Button, Modal} from 'react-bootstrap';
import {fetchCreateDevice, fetchDevices} from '../../redux/device/device.action';
import {fetchDeviceTypes} from '../../redux/devicetype/devicetype.action';
import {MdDeviceHub} from 'react-icons/md';
class DevicePage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isOpen: false,
            showCreate: false,
            deviceTypeId: "",
            deviceTypeName: "",
            name: "",
            location: "",
        }
    }
    handleCreateModal = () => {
        this.setState({showCreate: !this.state.showCreate});
    }
    handleCloseCreateModal = () => {
        this.handleCreateModal();
        this.setState({deviceTypeId: "", location: "", name: ""});
    }
    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({[name]: value});
    }
    handleSelect = (item) => {
        this.setState({isOpen: !this.state.isOpen, deviceTypeId: item.id, deviceTypeName: item.name})
    }
    handleOpen = () => {
        this.setState({isOpen: !this.state.isOpen});
    }
    componentDidMount(){
        if(this.props.isLoggedIn !== false){
            this.props.fetchDeviceTypes();
            this.props.fetchDevices(this.props.currentUser);
        }
        else{
            this.props.history.push("/login");
        }
        
    }
    createNewDevice = () => {
        this.props.fetchCreateDevice(this.state.deviceTypeId, this.state.name, this.state.location, this.props.currentUser)
        .then(() => {
            this.props.fetchDevices(this.props.currentUser);
        });
        this.setState({showCreate: !this.state.showCreate, deviceTypeId: "", deviceTypeName: "", name: ""});
    }
    render(){
        const {deviceTypeName} = this.state;

        return( 
            <div id="device-page">
                <div id="device-page-sidebar-section">
                    <Sidebar />
                </div>
                <div id="device-page-body-section">
                    <div className="top-navbar-section">
                        <Avatar />
                    </div>
                    <div id="device-page-create-section">
                        <div id="device-page-introduction-section">
                            <div id="introduction-flex-container">
                                <div id="introduction-flex-item">
                                    <h2>Thiết bị</h2>
                                    <p>Quản lý thiết bị</p>
                                </div>
                            </div>
                            <div id="create-flex-container">
                                <Button onClick={this.handleCreateModal}>Thêm thiết bị</Button>
                            </div>
                        </div>
                        <Modal show={this.state.showCreate} onHide = {this.handleCloseCreateModal} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Tạo mới</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="form-group">
                                    <label className="form-input-label">Tên</label>
                                    <input className="form-input" type="text" name="name" 
                                    onChange={this.handleChange} value={this.state.name} 
                                    required placeholder="Tên" autoComplete="off"/>
                                </div>
                                <div className="form-group">
                                    <label className="form-input-label">Kiểu</label>
                                    <div className="select-box-container">
                                        <div className="select-input" onClick={this.handleOpen}>
                                            <span className={`${"Choose Device Type" && deviceTypeName  === '' ? "select-title placeholder" : "select-title"}`}>
                                                {deviceTypeName === '' ? "Choose Device Type" : deviceTypeName}
                                            </span>
                                        </div>
                                    {this.state.isOpen === true ? 
                                        <div className="select-list">
                                        {this.props.deviceTypes.map((item, index) => (
                                            <div key={index} onClick={() => {this.handleSelect(item)}} className="select-item">
                                                <span>{item.name}</span>
                                            </div>
                                        ))}
                                        </div> : null}
                                    </div>
                                </div>
                                
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleCloseCreateModal}>Đóng</Button>
                                <Button variant="dark" onClick= {this.createNewDevice}>Tạo</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    <div id="device-page-list-device-section">
                        {this.props.devices.map((item, index) => (
                            <div className="device" key={index} onClick={() => {this.props.history.push(`${this.props.match.url}/${item.id}`)}}>
                                <div className="device-content">
                                    <div className="device-icon">
                                        <MdDeviceHub fontSize={30}/>
                                    </div>
                                    <p>{item.name}</p>
                                </div>
                                
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    deviceTypes: state.deviceType.deviceTypes,
    currentUser: state.user.currentUser,
    devices: state.device.devices,
    isLoggedIn: state.user.isLoggedIn
})
const mapDispatchToProps = (dispatch) => ({
    fetchCreateDevice: (id, name, location, currentUser) => dispatch(fetchCreateDevice(id, name, location, currentUser)),
    fetchDeviceTypes: () => dispatch(fetchDeviceTypes()),
    fetchDevices: (currentUser) => dispatch(fetchDevices(currentUser))
})
export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(DevicePage);