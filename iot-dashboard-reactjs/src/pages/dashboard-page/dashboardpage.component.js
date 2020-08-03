import React from 'react';
import './dashboardpage.style.scss';
import {MdDashboard} from 'react-icons/md';
import {withRouter} from 'react-router-dom';
import {compose} from 'redux';
import {connect} from 'react-redux';
import Sidebar from '../../components/sidebar/sidebar.component';
import Avatar from '../../components/avatar/avatar.component';
import {Button, Modal} from 'react-bootstrap';
import {GrEdit} from 'react-icons/gr';
import {MdDelete} from 'react-icons/md';
import {fetchCreateDashboard, fetchUpdateDashboard, fetchRemoveDashboard, fetchListDashboards} from '../../redux/dashboard/dashboard.action';
class DashboardPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: "",
            name: "",
            showCreate: false,
            showUpdate: false,
            showDelete: false
        };
    }
    handleCreateModal = () => {
        this.setState({showCreate: !this.state.showCreate});
    }
    handleCloseCreateModal = () => {
        this.setState({showCreate: !this.state.showCreate, name: ""});
    }
    handleUpdateModal = () => {
        this.setState({showUpdate: !this.state.showUpdate});
    }
    handleCloseUpdateModal = () => {
        this.setState({showUpdate: !this.state.showUpdate, name: "", id: ""});
    }
    handleDeleteModal = () => {
        this.setState({showDelete: !this.state.showDelete});
    }
    componentDidMount(){
        if(this.props.isLoggedIn !== false){
            this.props.fetchListDashboards(this.props.currentUser);
        }
        else{
            this.props.history.push("/login");
        }
    }
    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({[name]: value});
    }
    createNewDashboard = () => {
        this.props.fetchCreateDashboard(this.state.name, this.props.currentUser)
        .then(() => {
            this.props.fetchListDashboards(this.props.currentUser);
        });
        this.handleCloseCreateModal();
    }
    updateDashboard = () => {
        this.props.fetchUpdateDashboard(this.state.id, this.state.name, this.props.currentUser)
        .then(() => {
            this.props.fetchListDashboards(this.props.currentUser);
        })
        this.handleCloseUpdateModal();
    }
    deleteDashboard = () => {
        this.props.fetchRemoveDashboard(this.state.id, this.props.currentUser)
        .then(() => {
            this.props.fetchListDashboards(this.props.currentUser)
        });
        this.handleDeleteModal();
    }
    render(){
        return(
            <div id="dashboard-page">
                <div id="dashboard-page-sidebar-section">
                    <Sidebar />
                </div>
                <div id="dashboard-page-body-section">
                    <div className="top-navbar-section">
                        <Avatar />
                    </div>
                    <div id="dashboard-page-introduction-section">
                        <div id="introduction-flex-container">
                            <div id="introduction-flex-item">
                                <h2>Bảng điều khiển</h2>
                                <p>Tất cả bảng điều khiển</p>
                            </div>
                            <div id="create-flex-container">
                                <Button onClick={this.handleCreateModal}>Tạo bảng điều khiển</Button>
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
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleCloseCreateModal}>Đóng</Button>
                                <Button variant="dark" onClick= {this.createNewDashboard}>Tạo</Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={this.state.showUpdate} onHide = {this.handleCloseUpdateModal} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Sửa</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="form-group">
                                    <label className="form-input-label">Tên</label>
                                    <input className="form-input" type="text" name="name" 
                                    onChange={this.handleChange} value={this.state.name} 
                                    required placeholder="Name" autoComplete="off"/>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleCloseUpdateModal}>Đóng</Button>
                                <Button variant="dark" onClick= {this.updateDashboard}>Sửa</Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={this.state.showDelete} onHide = {this.handleDeleteModal} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Xoá</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Bạn có muốn xoá bảng điều khiển?</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleDeleteModal}>Đóng</Button>
                                <Button variant="danger" onClick= {this.deleteDashboard}>Xoá</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    <div id="dashboard-page-list-dashboard">
                        {this.props.dashboards.map((currentValue, index) => (
                            <div className="dashboard-item" key={index}>
                                <div className="dashboard-item-content" onClick={() => {
                                this.props.history.push(`${this.props.match.url}/${currentValue.id}`);
                            }}>
                                    <div className="dashboard-item-icon">
                                        <MdDashboard fontSize={40}/>
                                    </div>
                                    <p>{currentValue.name}</p>
                                </div>
                                <div className="button-container-edit-delete">
                                    <button onClick={() => {
                                        this.setState({name: currentValue.name, id: currentValue.id});
                                        this.handleUpdateModal();
                                    }}><GrEdit /></button>
                                    <button onClick={() => {
                                        this.setState({id: currentValue.id});
                                        this.handleDeleteModal();
                                    }}><MdDelete /></button>
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
    dashboards: state.dashboard.dashboards,
    currentUser: state.user.currentUser,
    isLoggedIn: state.user.isLoggedIn
})
const mapDispatchToProps = (dispatch) => ({
    fetchListDashboards: (currentUser) => dispatch(fetchListDashboards(currentUser)),
    fetchCreateDashboard: (name, currentUser) => dispatch(fetchCreateDashboard(name, currentUser)),
    fetchUpdateDashboard: (id, name, currentUser) => dispatch(fetchUpdateDashboard(id, name, currentUser)),
    fetchRemoveDashboard: (id, currentUser) => dispatch(fetchRemoveDashboard(id, currentUser))
})
export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(DashboardPage);