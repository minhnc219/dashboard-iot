import React from 'react';
import './endpointtypepage.style.scss';
import Sidebar from '../../components/sidebar/sidebar.component';
import Avatar from '../../components/avatar/avatar.component';
import {Button, Modal} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {fetchEndpointTypes, fetchEndpointType, fetchCreateEndpointType, fetchUpdateEndpointType, fetchRemoveEndpointType } from '../../redux/endpointtype/endpointtype.action';
import {GrEdit} from 'react-icons/gr';
import {MdDelete} from 'react-icons/md';
import {GrFormAdd} from 'react-icons/gr';
class EndpointTypePage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            showCreate: false,
            showUpdate: false,
            showRemove: false,
            id: "",
            name: "",
            description: "",
            measurementTypes: [],
            isListSelectOpen: [],
            dataTypes: ["int", "double", "string"]
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
        this.setState({name: '', description: '', measurementTypes: []});
    }
    addInput = () => {
        this.setState({measurementTypes: [...this.state.measurementTypes, {measurementTypeName: "", type: ""}]});
        let newArray = this.state.isListSelectOpen;
        newArray.push(false);
        this.setState({isListSelectOpen: newArray});
    }
    updateInputInArray = (newValue, index) => {
        const {measurementTypes} = this.state;
        let newArray = measurementTypes;
        newArray[index].measurementTypeName = newValue;
        this.setState({measurementTypes: newArray});
    }
    handleOpen = (index) => {
        let newArray = this.state.isListSelectOpen;
        newArray[index] = !newArray[index];
        this.setState({isListSelectOpen: newArray});
    }
    handleSelect = (title, index) => {
        const {measurementTypes} = this.state;
        let newArray = measurementTypes;
        newArray[index].type = title;
        let newArray1 = this.state.isListSelectOpen;
        newArray1[index] = !newArray1[index];
        this.setState({isListSelectOpen: newArray1, measurementTypes: newArray})
    }
    handleUpdateModal = () => {
        this.setState({showUpdate: !this.state.showUpdate});
    }
    handleCloseUpdateModal = () => {
        this.handleUpdateModal();
        this.setState({name: '', description: '', measurementTypes: []});
    }
    handleRemoveModal = () => {
        this.setState({showRemove: !this.state.showRemove});
    }
    handleCloseRemoveModal = () => {
        this.handleRemoveModal();
        this.setState({id: ''});
    }
    createNewDeviceType = () => {
        this.props.fetchCreateEndpointType(this.state.name, this.state.description, this.state.measurementTypes, this.props.currentUser)
        .then(() => {
            this.props.fetchEndpointTypes(this.props.currentUser);
        });

        this.setState({showCreate: false, id: '', name: '', description: '', measurementTypes: []});
    }
    updateDeviceType = () => {
        this.props.fetchUpdateEndpointType(this.state.id, this.state.name, this.state.description, this.state.measurementTypes, this.props.currentUser)
        .then(() => {
            this.props.fetchEndpointTypes(this.props.currentUser);
        });
        this.setState({showUpdate: false, id: '', name: '', description: '', measurementTypes: []});
    }
    removeDeviceType = () => {
        this.props.fetchRemoveEndpointType(this.state.id, this.props.currentUser)
        .then(() => {
            this.props.fetchEndpointTypes(this.props.currentUser);
        })
        this.setState({showRemove: false, id: ''});
        
    }

    componentDidMount(){
        if(this.props.isLoggedIn !== false){
            this.props.fetchEndpointTypes(this.props.currentUser);
        }
        else{
            this.props.history.push("/login");
        }
        
    }
    render(){
        const {endpointTypes} = this.props;
        return(
            <div id="widget-type-page">
                <div id="widget-type-page-sidebar-section">
                    <Sidebar />
                </div>
                <div id="widget-type-page-body-section">
                    <div className="top-navbar-section">
                        <Avatar />
                    </div>
                    <div className="widget-type-page-create-section">
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
                                    <div className="form-group">
                                        <label className="form-input-label">Mô tả</label>
                                        <textarea className="form-textarea" name="description"
                                        onChange={this.handleChange} value={this.state.description} 
                                        required placeholder="Mô tả" autoComplete="off" rows="5"
                                        ></textarea>
                                    </div>
                                    <div className="form-measurement-type-container">
                                        <button className="btn-add-measurement-type" onClick={this.addInput}><GrFormAdd className="btn-add-measurement-type-icon"/>Thêm thông số đo</button>
                                            {this.state.measurementTypes.map((currentValue, index) => (
                                                <div key={index}>
                                                    <div className="form-group">
                                                        <label className="form-input-label">Tên thông số</label>
                                                        <input className="form-input"
                                                        value={currentValue.measurementTypeName} onChange={(event) => {
                                                            this.updateInputInArray(event.target.value, index);
                                                        }}/>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-input-label">Kiểu dữ liệu</label>
                                                        <div className="select-box-container">
                                                            <div className="select-input" onClick={() => {
                                                                this.handleOpen(index);
                                                            }}>
                                                            <span className={`${"Choose Data Type" && currentValue.type === '' ? "select-title placeholder" : "select-title"}`}>
                                                                {currentValue.type === '' ? "Chọn kiểu dữ liệu" : currentValue.type}
                                                            </span>
                                                        </div>
                                                        {this.state.isListSelectOpen[index] === true ? 
                                                            <div className="select-list">
                                                                {this.state.dataTypes.map((item, index1) => (
                                                                    <div key={index1} onClick={() => {this.handleSelect(item, index)}} className="select-item">
                                                                        <span>{item}</span>
                                                                    </div>
                                                                ))}
                                                            </div> : null}
                                                        </div>
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
                    </div>
                    <div id="widget-type-page-container-table">
                        <div id="header-table-device-type">Kiểu thiết bị</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Tên</th>
                                    <th>Mô tả</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {endpointTypes.map((currentValue,index) => (
                                    <tr key={index}>
                                        <td>{currentValue.id}</td>
                                        <td>{currentValue.name}</td>
                                        <td>{currentValue.description}</td>
                                        <td>
                                            <button onClick={() => {
                                                this.setState({id: currentValue.id, name: currentValue.name,
                                                description: currentValue.description, measurementTypes: currentValue.measurementTypes});
                                                this.handleUpdateModal();
                                            }}><GrEdit /></button>
                                            <button onClick={() => {
                                                this.setState({id: currentValue.id});
                                                this.handleRemoveModal();
                                            }}><MdDelete /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                
                            </tfoot>
                        </table>
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
                                    <div className="form-group">
                                        <label className="form-input-label">Mô tả</label>
                                        <textarea className="form-textarea" name="description"
                                        onChange={this.handleChange} value={this.state.description} 
                                        required placeholder="Mô tả" autoComplete="off" rows="5"
                                        ></textarea>
                                    </div>
                                    <div className="form-measurement-type-container">
                                        <button className="btn-add-measurement-type" onClick={this.addInput}><GrFormAdd className="btn-add-measurement-type-icon"/>Thêm thông số đo</button>
                                            {this.state.measurementTypes.map((currentValue, index) => (
                                                <div key={index}>
                                                    <div className="form-group">
                                                        <label className="form-input-label">Tên thông số</label>
                                                        <input className="form-input"
                                                        value={currentValue.measurementTypeName} onChange={(event) => {
                                                            this.updateInputInArray(event.target.value, index);
                                                        }}/>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-input-label">Kiểu dữ liệu</label>
                                                        <div className="select-box-container">
                                                            <div className="select-input" onClick={() => {
                                                                this.handleOpen(index);
                                                            }}>
                                                            <span className={`${"Choose Data Type" && currentValue.type === '' ? "select-title placeholder" : "select-title"}`}>
                                                                {currentValue.type === '' ? "Choose Data Type" : currentValue.type}
                                                            </span>
                                                        </div>
                                                        {this.state.isListSelectOpen[index] === true ? 
                                                            <div className="select-list">
                                                                {this.state.dataTypes.map((item, index1) => (
                                                                    <div key={index1} onClick={() => {this.handleSelect(item, index)}} className="select-item">
                                                                        <span>{item}</span>
                                                                    </div>
                                                                ))}
                                                            </div> : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleCloseUpdateModal}>Đóng</Button>
                                <Button variant="dark" onClick= {this.updateDeviceType}>Cập nhật</Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={this.state.showRemove} onHide = {this.handleCloseRemoveModal} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Xoá</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Bạn có muốn xoá</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleCloseRemoveModal}>Đóng</Button>
                                <Button variant="dark" onClick= {this.removeDeviceType}>Xoá</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
        )
}}
const mapStateToProps = (state) => ({
    endpointTypes: state.endpointType.endpointTypes,
    endpointType: state.endpointType.endpointType,
    createMessage: state.endpointType.createMessage,
    updateMessage: state.endpointType.updateMessage,
    removeMessage: state.endpointType.removeMessage,
    currentUser: state.user.currentUser,
    isLoggedIn: state.user.isLoggedIn

})
const mapDispatchToProps = (dispatch) => ({
    fetchEndpointTypes: (currentUser) => dispatch(fetchEndpointTypes(currentUser)),
    fetchCreateEndpointType: (name, description, measurementTypes, currentUser) => dispatch(fetchCreateEndpointType(name, description, measurementTypes, currentUser)),
    fetchUpdateEndpointType: (id, name, description, measurementTypes, currentUser) => dispatch(fetchUpdateEndpointType(id, name, description, measurementTypes, currentUser)),
    fetchEndpointType: (id, currentUser) => dispatch(fetchEndpointType(id, currentUser)),
    fetchRemoveEndpointType: (id, currentUser) => dispatch(fetchRemoveEndpointType(id, currentUser))
})
export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(EndpointTypePage);