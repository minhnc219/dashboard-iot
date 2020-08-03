import React from 'react';
import './devicetypepage.style.scss';
import Sidebar from '../../components/sidebar/sidebar.component';
import Avatar from '../../components/avatar/avatar.component';
import {Modal, Button} from 'react-bootstrap';
import {GrEdit} from 'react-icons/gr';
import {MdDelete} from 'react-icons/md';
import {GrFormAdd} from 'react-icons/gr';
import {withRouter} from 'react-router-dom';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {fetchDeviceTypes, fetchDeviceType, fetchCreateDeviceType, fetchUpdateDeviceType, fetchRemoveDeviceType} from '../../redux/devicetype/devicetype.action';
const data = ["Digital", "Analog"];
class DeviceTypePage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showCreate: false,
            showUpdate: false,
            showRemove: false,
            id: "",
            name: "",
            isListSelectOpen: [],
            gpios: []
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
        this.setState({name: '', gpios: []});
    }
    handleUpdateModal = () => {
        this.setState({showUpdate: !this.state.showUpdate});
    }
    handleCloseUpdateModal = () => {
        this.handleUpdateModal();
        this.setState({name: '', gpios: []});
    }
    handleDeleteModal = () => {
        this.setState({showRemove: !this.state.showRemove});
    }

    addInput = () => {
        this.setState({gpios: [...this.state.gpios, {type: "", name: ""}]});
        let newArray = this.state.isListSelectOpen;
        newArray.push(false);
        this.setState({isListSelectOpen: newArray});
    }
    updateInputInArray = (newValue, index) => {
        const {gpios} = this.state;
        let newArray = gpios;
        newArray[index].name = newValue;
        this.setState({gpios: newArray});
    }
    handleOpen = (index) => {
        let newArray = this.state.isListSelectOpen;
        newArray[index] = !newArray[index];
        this.setState({isListSelectOpen: newArray});
    }
    handleSelect = (title, index) => {
        const {gpios} = this.state;
        let newArray = gpios;
        newArray[index].type = title;
        let newArray1 = this.state.isListSelectOpen;
        newArray1[index] = !newArray1[index];
        this.setState({isListSelectOpen: newArray1, gpios: newArray})
    }
    createNewDeviceType = () => {
        this.props.fetchCreateDeviceType(this.state.name, this.state.gpios)
        .then(() => {
            this.props.fetchDeviceTypes();
        })
        this.setState({showCreate: false, name: "", gpios: []});
    }
    updateDeviceType = () => {
        this.props.fetchUpdateDeviceType(this.state.id, this.state.name, this.state.gpios)
        .then(() => {
            this.props.fetchDeviceTypes();
        });
        this.setState({showUpdate: false, id: "", name: "", gpios: []});
    }
    deleteDeviceType = () => {
        this.props.fetchRemoveDeviceType(this.state.id)
        .then(() => {
            this.props.fetchDeviceTypes();
        });
        this.setState({showRemove: false, id: ""});
    }
    componentDidMount(){
        if(this.props.isLoggedIn !== false){
            this.props.fetchDeviceTypes();
        }
        else{
            this.props.history.push("/login");
        }
        
    }
    render(){
        return(
            <div id="device-type-page">
                <div id="device-type-page-sidebar-section">
                    <Sidebar />
                </div>
                <div id="device-type-page-body-section">
                    <div className="top-navbar-section">
                        <Avatar />
                    </div>
                    <div id="device-type-page-create-section">
                        <Button onClick={this.handleCreateModal}>Tạo kiểu thiết bị</Button>
                        <Modal show={this.state.showCreate} onHide = {this.handleCloseCreateModal}
                        centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Tạo mới</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>
                                    <div className="form-group">
                                        <label className="form-input-label">Tên</label>
                                        <input className="form-input" type="text" name="name" 
                                        onChange={this.handleChange} value={this.state.name} 
                                        required placeholder="Tên" autoComplete="off"/>
                                    </div>
                                    <div className="form-gpio-container">
                                        <button className="btn-add-gpio" onClick={this.addInput}><GrFormAdd className="btn-add-gpio-icon"/>Thêm GPIO</button>
                                            {this.state.gpios.map((value, index) => (
                                                <div key={index}>
                                                    <div className="form-group">
                                                        <label className="form-input-label">Kiểu</label>
                                                        <div className="select-box-container">
                                                            <div className="select-input" onClick={() => {
                                                                this.handleOpen(index);
                                                            }}>
                                                            <span className={`${"Choose Type Gpio" && value.type === '' ? "select-title placeholder" : "select-title"}`}>
                                                                {value.type === '' ? "Choose Type Gpio" : value.type}
                                                            </span>
                                                        </div>
                                                        {this.state.isListSelectOpen[index] === true ? 
                                                            <div className="select-list">
                                                                {data.map((item, index1) => (
                                                                    <div key={index1} onClick={() => {this.handleSelect(item, index)}} className="select-item">
                                                                        <span>{item}</span>
                                                                    </div>
                                                                ))}
                                                            </div> : null}
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-input-label">Tên GPIO</label>
                                                        <input className="form-input"
                                                        value={value.name} onChange={(event) => {
                                                            this.updateInputInArray(event.target.value, index);
                                                        }}/>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleCloseCreateModal}>Đóng</Button>
                                <Button variant="dark" onClick= {this.createNewDeviceType}>Tạo</Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={this.state.showUpdate} onHide = {this.handleCloseUpdateModal} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Sửa</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>
                                    <div className="form-group">
                                        <label className="form-input-label">Tên</label>
                                        <input className="form-input" type="text" name="name" 
                                        onChange={this.handleChange} value={this.state.name} 
                                        required placeholder="Tên" autoComplete="off"/>
                                    </div>
                                    <div className="form-gpio-container">
                                        <button className="btn-add-gpio" onClick={this.addInput}><GrFormAdd className="btn-add-gpio-icon"/>Thêm GPIO</button>
                                            {this.state.gpios.map((value, index) => (
                                                <div key={index}>
                                                    <div className="form-group">
                                                        <label className="form-input-label">Kiểu</label>
                                                        <div className="select-box-container">
                                                            <div className="select-input" onClick={() => {
                                                                this.handleOpen(index);
                                                            }}>
                                                            <span className={`${"Choose Type Gpio" && value.type === '' ? "select-title placeholder" : "select-title"}`}>
                                                                {value.type === '' ? "Choose Type Gpio" : value.type}
                                                            </span>
                                                        </div>
                                                        {this.state.isListSelectOpen[index] === true ? 
                                                            <div className="select-list">
                                                                {data.map((item, index1) => (
                                                                    <div key={index1} onClick={() => {this.handleSelect(item, index)}} className="select-item">
                                                                        <span>{item}</span>
                                                                    </div>
                                                                ))}
                                                            </div> : null}
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-input-label">Tên GPIO</label>
                                                        <input className="form-input"
                                                        value={value.name} onChange={(event) => {
                                                            this.updateInputInArray(event.target.value, index);
                                                        }}/>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleCloseUpdateModal}>Đóng</Button>
                                <Button variant="dark" onClick= {this.updateDeviceType}>Sửa</Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={this.state.showRemove} onHide = {this.handleDeleteModal} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Xoá</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Bạn có muốn xoá kiểu thiết bị?</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleDeleteModal}>Đóng</Button>
                                <Button variant="danger" onClick= {this.deleteDeviceType}>Xoá</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    <div id="table-device-type">
                        <div id="header-table-device-type">Kiểu thiết bị</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Tên</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.deviceTypes.map((currentValue, index) => (
                                    <tr key={index}>
                                        <td>{currentValue.id}</td>
                                        <td>{currentValue.name}</td>
                                        <td>
                                            <button onClick={() => {
                                                this.setState({id: currentValue.id, name: currentValue.name});
                                                this.handleUpdateModal();
                                            }}><GrEdit /></button>
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
    deviceTypes: state.deviceType.deviceTypes,
    deviceType: state.deviceType.deviceType,
    createMessage: state.deviceType.createMessage,
    updateMessage: state.deviceType.updateMessage,
    removeMessage: state.deviceType.removeMessage,
    isLoggedIn: state.user.isLoggedIn
})
const mapDispatchToProps = (dispatch) => ({
    fetchDeviceTypes: () => dispatch(fetchDeviceTypes()),
    fetchDeviceType: (id) => dispatch(fetchDeviceType(id)),
    fetchCreateDeviceType: (name, gpios) => dispatch(fetchCreateDeviceType(name, gpios)),
    fetchUpdateDeviceType: (id, name, gpios) => dispatch(fetchUpdateDeviceType(id, name, gpios)),
    fetchRemoveDeviceType: (id) => dispatch(fetchRemoveDeviceType(id))
})
export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(DeviceTypePage);