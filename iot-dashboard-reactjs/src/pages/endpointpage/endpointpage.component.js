import React from 'react';
import './endpointpage.style.scss';
import {withRouter} from 'react-router-dom';
import {compose} from 'redux';
import {connect} from 'react-redux';
import Sidebar from '../../components/sidebar/sidebar.component';
import {Button, Modal} from 'react-bootstrap';
import {fetchCreateEndpoint, fetchListEndpoints, fetchEndpoint, fetchUpdateEndpoint, fetchDeleteEndpoint} from '../../redux/endpoint/endpoint.action';
import {fetchDevice} from '../../redux/device/device.action';
import {fetchDeviceType} from '../../redux/devicetype/devicetype.action';
import {fetchEndpointTypes} from '../../redux/endpointtype/endpointtype.action';
import Avatar from '../../components/avatar/avatar.component';
import {FcViewDetails} from 'react-icons/fc';
import {GrEdit} from 'react-icons/gr';
import {MdDelete} from 'react-icons/md';
class EndpointPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showCreate: false,
            showUpdate: false,
            showDelete: false,
            isOpenDeviceType: false,
            isOpenGpio: false,
            id: "",
            name: "",
            description: "",
            connectedDeviceId: "",
            deviceTypeId: "",
            deviceTypeName: "",
            gpio: "",
            topic: "",
            connection: null,
            deviceNameDisplay: ""
        }
    }
    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({[name]: value});
    }
    handleCreateModal = () => {
        this.setState({showCreate: !this.state.showCreate});
    }
    handleCloseCreateModal = () => {
        this.handleCreateModal();
        this.setState({name: '', description: '', deviceTypeName: '', deviceTypeId: '', topic: '', gpio: ''});
    }
    handleUpdateModal = () => {
        this.setState({showUpdate: !this.state.showUpdate});
    }
    handleCloseUpdateModal = () => {
        this.handleUpdateModal();
        this.setState({name: '', description: '', deviceTypeName: '', deviceTypeId: '', topic: '', gpio: ''});
    }
    handleDeleteModal = () => {
        this.setState({showDelete: !this.state.showDelete});
    }
    createNewEndpoint = () => {
        this.props.fetchCreateEndpoint(this.state.connectedDeviceId, this.state.deviceTypeId, this.state.name, this.state.description, 
            this.state.topic, this.state.gpio, this.props.currentUser)
        .then(() => {
            this.props.fetchListEndpoints(this.props.match.params.deviceId, this.props.currentUser);
        });
        this.setState({showCreate: !this.state.showCreate, name: "", deviceTypeId: "",
        deviceTypeName: "", gpio: "", topic: "", description: ""});
    }
    updateEndpoint = () => {
        this.props.fetchUpdateEndpoint(this.state.id, this.state.connectedDeviceId, this.state.deviceTypeId, this.state.name, this.state.description, this.state.topic, this.state.gpio, this.props.currentUser)
        .then(() => {
            this.props.fetchListEndpoints(this.props.match.params.deviceId, this.props.currentUser);
        });
        this.handleCloseUpdateModal();
    }
    deleteEndpoint = () => {
        this.props.fetchDeleteEndpoint(this.state.id, this.props.currentUser)
        .then(() => {
            this.props.fetchListEndpoints(this.props.match.params.deviceId, this.props.currentUser);
            this.handleDeleteModal();
        });
    }
    componentDidMount(){
        if(this.props.isLoggedIn !== false){
            const {match} = this.props;
            this.setState({connectedDeviceId: match.params.deviceId});
            this.props.fetchDevice(match.params.deviceId, this.props.currentUser)
            .then(() => {
                this.props.fetchDeviceType(this.props.device.connectedDeviceTypeId)
                this.setState({deviceNameDisplay: this.props.device.name});
            })
            this.props.fetchEndpointTypes(this.props.currentUser);
            this.props.fetchListEndpoints(match.params.deviceId, this.props.currentUser);
        }
        else{
            this.props.history.push("/login");
        }
    }
    handleOpenDeviceType = () => {
        this.setState({isOpenDeviceType: !this.state.isOpenDeviceType})
    }
    handleSelectWidgetType = (item) => {
        this.setState({isOpenDeviceType: !this.state.isOpenDeviceType, deviceTypeId: item.id, deviceTypeName: item.name});
    }
    handleOpenGpio = () => {
        this.setState({isOpenGpio: !this.state.isOpenGpio});
    }
    handleSelectGpio = (item) => {
        this.setState({isOpenGpio: !this.state.isOpenGpio, gpio: item});
    }

    render(){
        return(
            <div id="endpoint-page">
                <div id="endpoint-page-sidebar-section">
                    <Sidebar />
                </div>
                <div id="endpoint-page-body-section">
                    <div className="top-navbar-section">
                        <Avatar />
                    </div>
                    <div id="endpoint-page-create-section">
                        <div id="endpoint-page-introduction-section">
                            <div id="introduction-flex-container">
                                <div id="introduction-flex-item">
                                    <h2>Thiết bị cảm biến</h2>
                                    <p>Quản lý thiết bị cảm biến trong {this.state.deviceNameDisplay}</p>
                                </div>
                            </div>
                            <div id="create-flex-container">
                                <Button onClick={this.handleCreateModal}>Thêm thiết bị cảm biến</Button>
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
                                    <label className="form-input-label">Topic</label>    
                                    <input className="form-input" type="text" name="topic" 
                                    onChange={this.handleChange} value={this.state.topic} 
                                    required placeholder="Topic" autoComplete="off"/>
                                </div>
                                <div className="form-group">
                                    <label className="form-input-label">Kiểu thiết bị cảm biến</label>
                                    <div className="select-box-container">
                                        <div className="select-input" onClick={this.handleOpenDeviceType}>
                                            <span className={`${"Choose Device Type" && this.state.deviceTypeName  === '' ? "select-title placeholder" : "select-title"}`}>
                                                {this.state.deviceTypeName === '' ? "Chọn kiểu thiết bị cảm biến" : this.state.deviceTypeName}
                                            </span>
                                        </div>
                                    {this.state.isOpenDeviceType === true ? 
                                        <div className="select-list">
                                        {this.props.endpointTypes.map((item, index) => (
                                            <div key={index} onClick={() => {this.handleSelectWidgetType(item)}} className="select-item">
                                                <span>{item.name}</span>
                                            </div>
                                        ))}
                                        </div> : null}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-input-label">GPIO</label>
                                    <div className="select-box-container">
                                        <div className="select-input" onClick={this.handleOpenGpio}>
                                            <span className={`${"Choose Gpio" && this.state.gpio  === '' ? "select-title placeholder" : "select-title"}`}>
                                                {this.state.gpio === '' ? "Chọn Gpio" : this.state.gpio}
                                            </span>
                                        </div>
                                    {this.state.isOpenGpio === true ? 
                                        <div className="select-list">
                                        {this.props.deviceType.gpiOs.map((item, index) => (
                                            <div key={index} onClick={() => {this.handleSelectGpio(item.name)}} className="select-item">
                                                <span>{item.name}</span>
                                            </div>
                                        ))}
                                        </div> : null}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-input-label">Mô tả</label>
                                    <textarea className="form-textarea" name="description"
                                    onChange={this.handleChange} value={this.state.description} 
                                    required placeholder="Mô tả" autoComplete="off" rows="5"
                                    ></textarea>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleCloseCreateModal}>Đóng</Button>
                                <Button variant="dark" onClick= {this.createNewEndpoint}>Tạo</Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={this.state.showUpdate} onHide = {this.handleCloseUpdateModal} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Cập nhật</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="form-group">
                                    <label className="form-input-label">Tên</label>
                                    <input className="form-input" type="text" name="name" 
                                    onChange={this.handleChange} value={this.state.name} 
                                    required placeholder="Tên" autoComplete="off"/>
                                </div>
                                <div className="form-group">
                                    <label className="form-input-label">Topic</label>    
                                    <input className="form-input" type="text" name="topic" 
                                    onChange={this.handleChange} value={this.state.topic} 
                                    required placeholder="Topic" autoComplete="off"/>
                                </div>
                                <div className="form-group">
                                    <label className="form-input-label">Kiểu thiết bị</label>
                                    <div className="select-box-container">
                                        <div className="select-input" onClick={this.handleOpenDeviceType}>
                                            <span className={`${"Choose Device Type" && this.state.deviceTypeName  === '' ? "select-title placeholder" : "select-title"}`}>
                                                {this.state.deviceTypeName === '' ? "Chọn kiểu thiết bị" : this.state.deviceTypeName}
                                            </span>
                                        </div>
                                    {this.state.isOpenDeviceType === true ? 
                                        <div className="select-list">
                                        {this.props.endpointTypes.map((item, index) => (
                                            <div key={index} onClick={() => {this.handleSelectWidgetType(item)}} className="select-item">
                                                <span>{item.name}</span>
                                            </div>
                                        ))}
                                        </div> : null}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-input-label">GPIO</label>
                                    <div className="select-box-container">
                                        <div className="select-input" onClick={this.handleOpenGpio}>
                                            <span className={`${"Choose Gpio" && this.state.gpio  === '' ? "select-title placeholder" : "select-title"}`}>
                                                {this.state.gpio === '' ? "Chọn Gpio" : this.state.gpio}
                                            </span>
                                        </div>
                                    {this.state.isOpenGpio === true ? 
                                        <div className="select-list">
                                        {this.props.deviceType.gpiOs.map((item, index) => (
                                            <div key={index} onClick={() => {this.handleSelectGpio(item.name)}} className="select-item">
                                                <span>{item.name}</span>
                                            </div>
                                        ))}
                                        </div> : null}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-input-label">Mô tả</label>
                                    <textarea className="form-textarea" name="description"
                                    onChange={this.handleChange} value={this.state.description} 
                                    required placeholder="Mô tả" autoComplete="off" rows="5"
                                    ></textarea>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleCloseUpdateModal}>Đóng</Button>
                                <Button variant="dark" onClick= {this.updateEndpoint}>Cập nhật</Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={this.state.showDelete} onHide = {this.handleDeleteModal} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Xoá</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Bạn có muốn xoá thiết bị?</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleDeleteModal}>Đóng</Button>
                                <Button variant="danger" onClick= {this.deleteEndpoint}>Xoá</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    <div id="table-endpoint">
                        <div id="header-table-endpoint">Thiết bị cảm biến</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Tên</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.endpoints.map((currentValue, index) => (
                                    <tr key={index}>
                                        <td>{currentValue.id}</td>
                                        <td>{currentValue.name}</td>
                                        <td>
                                            <button onClick={() => {
                                                this.setState({id: currentValue.id});
                                                this.handleUpdateModal();
                                            }}><GrEdit /></button>
                                            <button onClick={() => {
                                                this.props.history.push(`${this.props.match.url}/${currentValue.id}`);
                                            }}><FcViewDetails /></button>
                                            <button onClick={() => {
                                                this.setState({id: currentValue.id});
                                                this.handleDeleteModal();
                                            }}><MdDelete /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    device: state.device.device,
    currentUser: state.user.currentUser,
    deviceType: state.deviceType.deviceType,
    endpointTypes: state.endpointType.endpointTypes,
    endpoints: state.endpoint.endpoints,
    endpoint: state.endpoint.endpoint,
    isLoggedIn: state.user.isLoggedIn
})
const mapDispatchToProps = (dispatch) => ({
    fetchDevice: (id, currentUser) => dispatch(fetchDevice(id, currentUser)),
    fetchEndpoint: (id) => dispatch(fetchEndpoint(id)),
    fetchListEndpoints: (id, currentUser) => dispatch(fetchListEndpoints(id, currentUser)),
    fetchDeviceType: (id) => dispatch(fetchDeviceType(id)),
    fetchEndpointTypes: (currentUser) => dispatch(fetchEndpointTypes(currentUser)),
    fetchCreateEndpoint: (connectedDeviceId, deviceTypeId, name, description, topic, gpio, currentUser) => dispatch(fetchCreateEndpoint(connectedDeviceId, deviceTypeId, name, description, topic, gpio, currentUser)),
    fetchUpdateEndpoint: (id, connectedDeviceId, deviceTypeId, name, description, topic, gpio, currentUser) => dispatch(fetchUpdateEndpoint(id, connectedDeviceId, deviceTypeId, name, description, topic, gpio, currentUser)),
    fetchDeleteEndpoint: (id, currentUser) => dispatch(fetchDeleteEndpoint(id, currentUser))
})
export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(EndpointPage);