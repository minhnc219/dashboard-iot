import React from  'react';
import './dashboarddetailpage.style.scss';
import {Button, Modal} from 'react-bootstrap';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {Line,  Bar} from 'react-chartjs-2';
import Sidebar from '../../components/sidebar/sidebar.component';
import Avatar from '../../components/avatar/avatar.component';
import LineImg from '../../assets/line.png';
import BarImg from '../../assets/bar.png';
import {GrEdit} from 'react-icons/gr';
import {MdDelete} from 'react-icons/md';
import {fetchListChartModels, fetchCreateChartModel, fetchUpdateChartModel, fetchDeleteChartModel} from '../../redux/dashboard/dashboard.action';
import {fetchEndpointTypes, fetchEndpointType} from '../../redux/endpointtype/endpointtype.action';
import {fetchListEndpoints} from '../../redux/device/device.action';
import {TiDelete} from 'react-icons/ti';
import {HubConnectionBuilder} from '@microsoft/signalr';
class DashBoardDetailPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            typeCharts: ["Line", "Bar"],
            typeChartSelect: "",
            showCreate: false,
            showUpdate: false,
            showDelete: false,
            isOpenDataType: false,
            isOpenDeviceType: false,
            isOpenParameter: false,
            isOpenDevices: false,
            chartModelId: "",
            typeChart: "",
            typeData: "",
            deviceType: "",
            deviceTypeName: "",
            parameter: "",
            devices: [],
            listDatatype: ["Real Time", "1 Hour"],
            listDeviceTypeDisplay: [],
            listParameter: [],
            title: "",
            connection: null,
            data: [],
            chartRef: [],
        };
        this.data = [];
        this.chartRef = [];
        this.minMaxValues = [];
        this.color = ["red", "blue", "green", "yellow", "Cerulean", "Chartreuse green"];
    }
    handleCreateDataChartModel = () => {
        const {listChartModels} = this.props;
        console.log(listChartModels);
        this.chartRef = [];
        this.data = [];
        for(let i = 0; i < listChartModels.length; i++){
            this.data.push({
                labels: [],
                datasets: []
            });
            this.chartRef.push(React.createRef());
            if(listChartModels[i].deviceType !== null){
                if(listChartModels[i].parameter !== "" && listChartModels[i].parameter !== null){
                    for(let j = 0; j < listChartModels[i].devices.length; j++){
                        this.data[i].datasets.push({
                            label: listChartModels[i].devices[j],
                            fill: false,
                            borderColor: this.color[j],
                            data: []
                        })
                    }
                }
                else{
                    var color = 0;
                    for(let k = 0; k < listChartModels[i].devices.length; k++){
                        for(let l = 0; l < listChartModels[i].deviceTypeParameters.length; l++){
                            color += 1;
                            this.data[i].datasets.push({
                                label: listChartModels[i].devices[k] + "/" + listChartModels[i].deviceTypeParameters[l],
                                fill: false,
                                borderColor: this.color[color],
                                data: [],
                                backgroundColor	: this.color[color]
                            });
                        }
                    }
                }
            }
        }
        console.log(this.chartRef);
        console.log(this.data);
        console.log(this.minMaxValues);
        this.setState({chartRef: this.chartRef, data: this.data});
    }
    handleCreateSignalr = () => {
        if(this.state.connection !== null){
            this.state.connection.stop();
            this.setState({connection: null});
        }
        const connection = new HubConnectionBuilder().withUrl("https://localhost:44321/sensorhub").build();
        this.setState({connection: connection}, () => {
            this.state.connection.start()
            .then(() => {
                console.log("connection started");
                this.state.connection.invoke("JoinGroup", this.props.match.params.dashboardId);
            })
            .catch((err) => {
                console.log("Error while establish connection");
            })
            const {listChartModels} = this.props;
            this.state.connection.on("SendMessage", data => {
                for(let i = 0; listChartModels.length; i++){
                    if(listChartModels[i].typeData === "Real Time"){
                        if(listChartModels[i].parameter !== "" && listChartModels[i] !== null){
                            let datetime = new Date(data.createdDate);
                            let datetimedisplay = datetime.getHours() + ":" + datetime.getMinutes() + ":" + datetime.getSeconds();
                            let json = data.measurementEndpoints;
                            if(this.data[i].labels.length < 15){
                                this.data[i].labels.push(datetimedisplay);
                            }
                            else{
                                this.data[i].labels.push(datetimedisplay);
                                this.data[i].labels.shift();
                            }
                            for(let j = 0; j < this.data[i].datasets.length; j++){
                                let item = json.find(currentValue => currentValue.id === this.data[i].datasets[j].label);
                                let jsonData = JSON.parse(item.value);
                                for(let key in jsonData){
                                    if(jsonData[key].Name === listChartModels[i].parameter){
                                        if(this.data[i].datasets[j].data.length < 15){
                                            this.data[i].datasets[j].data.push(jsonData[key].Value);
                                        }
                                        else {
                                            this.data[i].datasets[j].data.push(jsonData[key].Value);
                                            this.data[i].datasets[j].data.shift();
                                        }
                                    }
                                }
                            }
                        }
                        else{
                            let datetime = new Date(data.createdDate);
                            let datetimedisplay = datetime.getHours() + ":" + datetime.getMinutes() + ":" + datetime.getSeconds();
                            let json = data.measurementEndpoints;
                            if(this.data[i].labels.length < 15){
                                this.data[i].labels.push(datetimedisplay);
                            }
                            else{
                                this.data[i].labels.push(datetimedisplay);
                                this.data[i].labels.shift();
                            }
                            for(let x = 0; x < this.data[i].datasets.length; x++){
                                let id = this.data[i].datasets[x].label.substring(0, this.data[i].datasets[x].label.indexOf("/"));
                                let item = json.find(currentValue => currentValue.id === id);
                                let jsonData = JSON.parse(item.value);
                                for(let key1 in jsonData){
                                    if(id + "/" + jsonData[key1].Name === this.data[i].datasets[x].label){
                                        if(this.data[i].datasets[x].data.length < 15){
                                            this.data[i].datasets[x].data.push(jsonData[key1].Value);
                                        }
                                        else {
                                            this.data[i].datasets[x].data.push(jsonData[key1].Value);
                                            this.data[i].datasets[x].data.shift();
                                        }
                                    }
                                }
                            }
                            
                        }
                    }
                    this.state.chartRef[i].current.chartInstance.update();
                }
            })
        })
    }
    handleCreateModal = () => {
        this.setState({showCreate: !this.state.showCreate});
    }
    handleCreateChartModel = (typeChart) => {
        this.props.fetchCreateChartModel(this.props.match.params.dashboardId, typeChart, this.props.currentUser)
        .then(() => {
            this.props.fetchListChartModels(this.props.match.params.dashboardId, this.props.currentUser);
            this.handleCreateModal();
            this.setState({typeChart: ""});
        })
    }
    handleUpdateChartModel = () => {
        this.setState({showUpdate: !this.state.showUpdate});
    }
    updateChartModel = () => {
        this.props.fetchUpdateChartModel(this.props.match.params.dashboardId,
            this.state.chartModelId, 
            this.state.typeChart, 
            this.state.typeData,
            this.state.title, 
            this.state.deviceType, 
            this.state.parameter, 
            this.state.devices,
            this.state.listParameter,
            this.props.currentUser)
            .then(() => {
                this.props.fetchListChartModels(this.props.match.params.dashboardId, this.props.currentUser)
                .then(() => {
                    window.location.reload();
                });
                this.handleUpdateChartModel();
            })
    }
    handleDeleteChartModel = () => {
        this.setState({showDelete: !this.state.showDelete});
    }
    deleteChartModel = () => {
        this.props.fetchDeleteChartModel(this.props.match.params.dashboardId, this.state.chartModelId, this.props.currentUser)
        .then(() => {
            this.props.fetchListChartModels(this.props.match.params.dashboardId, this.props.currentUser)
            .then(() => {
                window.location.reload();
            })
            this.handleDeleteChartModel();
        })
    }
    componentDidMount(){
        if(this.props.isLoggedIn !== false){
        const {listDeviceTypeDisplay} = this.state;
        this.props.fetchListEndpoints(this.props.currentUser);
        this.props.fetchEndpointTypes(this.props.currentUser)
        .then(() => {
            for(let i in this.props.endpointTypes){
                listDeviceTypeDisplay.push(this.props.endpointTypes[i]);
            }
            this.setState({listDeviceTypeDisplay: listDeviceTypeDisplay});
        });
        this.props.fetchListChartModels(this.props.match.params.dashboardId, this.props.currentUser)
        .then(() => {
            this.handleCreateDataChartModel();
            this.handleCreateSignalr();
            const {listChartModels} = this.props;
            axios.get(`https://localhost:44321/api/Measurement/GetMeasurementDashboard/${this.props.match.params.dashboardId}`);
            for(let i = 0; i < listChartModels.length; i++){
                if(listChartModels[i].typeData === "1 Hour"){
                    for(let j = 0; j < listChartModels[i].devices.length; j++){
                        axios.get(`https://localhost:44321/api/Measurement/GetMeasurementDeviceOneHour/${listChartModels[i].devices[j]}`, {
                            headers: {"Authorization": `Bearer ${this.props.currentUser.token}`}
                        })
                        .then((response) => {
                        if(response.status === 200){
                            if(listChartModels[i].parameter !== "" && listChartModels[i] !== null){
                                for(let k = response.data.length - 1; k >= 0; k--){
                                    if(this.data[i].labels.length < response.data.length){
                                        let datetime = new Date(response.data[k].createdDate);
                                        let datetimedisplay = datetime.getHours() + ":" + datetime.getMinutes() + ":" + datetime.getSeconds();
                                        this.data[i].labels.push(datetimedisplay);
                                    }
                                    let json = JSON.parse(response.data[k].value);
                                    for(let key2 in json){
                                        if(key2 === listChartModels[i].parameter){
                                            this.data[i].datasets[j].data.push(json[key2]);
                                            
                                        }
                                    }
                                    
                                }
                            }
                            else{
                                for(let k = response.data.length - 1; k >= 0; k--){
                                    if(this.data[i].labels.length < response.data.length){
                                        let datetime = new Date(response.data[k].createdDate);
                                        let datetimedisplay = datetime.getHours() + ":" + datetime.getMinutes() + ":" + datetime.getSeconds();
                                        this.data[i].labels.push(datetimedisplay);
                                    }
                                    let json = JSON.parse(response.data[k].value);
                                    let id = this.data[i].datasets[j].label.substring(0, this.data[i].datasets[j].label.indexOf("/"));
                                    for(let key2 in json){
                                        for(let m = 0; m < this.data[i].datasets.length; m++){
                                            if(id + "/" + key2 === this.data[i].datasets[m].label){
                                                this.data[i].datasets[m].data.push(json[key2]);
                                                
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })
                    }
                }

            }
        })
        }
        else{
            this.props.history.push("/login");
        }
    }
    componentWillUnmount(){
        if(this.props.isLoggedIn !== false){
            this.setState({data: null, connection: null})
        }
    }
    handleOpenDataType = () => {
        this.setState({isOpenDataType: !this.state.isOpenDataType});
    }
    handleOpenDeviceType = () => {
        this.setState({isOpenDeviceType: !this.state.isOpenDeviceType});
    }
    handleOpenParameter = () => {
        this.setState({isOpenParameter: !this.state.isOpenParameter});
    }
    handleOpenDevices = () => {
        this.setState({isOpenDevices: !this.state.isOpenDevices});
    }
    handleSelectDataType = (item) => {
        this.setState({isOpenDataType: !this.state.isOpenDataType, typeData: item});
    }
    handleSelectDeviceType = (item) => {
        this.setState({isOpenDeviceType: !this.state.isOpenDeviceType, deviceType: item.id, deviceTypeName: item.name}, () => {
            let listParameter  = [];
            for(let i in item.measurementTypes){
                listParameter.push(item.measurementTypes[i].measurementTypeName);
            }
            this.setState({listParameter: listParameter});
            this.filterData();
        });
    }
    handleSelectParameter = (item) => {
        this.setState({isOpenParameter: !this.state.isOpenParameter, parameter: item});
    }
    handleSelectDevices = (item) => {
        const {devices} = this.state;
        this.setState({isOpenDevices: !this.state.isOpenDevices, devices: devices.concat(item)});
    }
    handleRemoveItem = (index) => {
        const {devices} = this.state;
        devices.splice(index, 1);
        this.setState({devices: devices});
    }
    filterData = () => {
        const {endpoints} = this.props;
        const {devices} = this.state;
        const {deviceType} = this.state;
        if(this.state.deviceType === "" || this.state.deviceType === "none"){
            return endpoints.filter(currentValue => !devices.find(title => currentValue.id === title))
        }
        else{
            return endpoints.filter(currentValue => currentValue.deviceTypeId === deviceType && !devices.find(item => currentValue.id === item));
        }
    }
    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({[name]: value});
    }
    render(){
        const filterData = this.filterData();
        return(
            <div id="dashboard-detail-page">
                <div id="dashboard-detail-page-sidebar-section">
                    <Sidebar />
                </div>
                <div id="dashboard-detail-page-body-section">
                    <div className="top-navbar-section">
                        <Avatar />
                    </div>
                    <div id="dashboard-detail-page-create-section">
                        <div id="dashboard-detail-page-introduction-section">
                            <div id="introduction-flex-container">
                                <div id="introduction-flex-item">
                                    <h2>Bảng điều khiển</h2>
                                    <p>{this.props.match.params.dashboardId}</p>
                                </div>
                            </div>
                            <div id="create-flex-container">
                                <Button onClick={this.handleCreateModal}>Thêm đồ thị</Button>
                            </div>
                        </div>
                        <Modal show={this.state.showCreate} onHide = {this.handleCreateModal} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Tạo mới</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>
                                    {this.state.typeCharts.map((currentValue, index) => {
                                        switch(currentValue){
                                            case "Line":
                                                return(
                                                <div className="type-chart-container" key={index} onClick={() => {
                                                    this.handleCreateChartModel(currentValue);
                                                }}>
                                                    <div>
                                                        <img src={LineImg} alt="null"/>
                                                    </div>
                                                    <div>
                                                        <span>{currentValue}</span>
                                                    </div>
                                                </div>)
                                            case "Bar":
                                                return (
                                                <div className="type-chart-container" key={index} onClick={() => {
                                                    this.handleCreateChartModel(currentValue);
                                                }}>
                                                    <div>
                                                        <img src={BarImg} alt="null"/>
                                                    </div>
                                                    <div>
                                                        <span>{currentValue}</span>
                                                    </div>
                                                </div>)
                                            default:
                                                return(null)
                                        }
                                    })}
                                </div>
                            </Modal.Body>
                        </Modal>
                        <Modal show={this.state.showUpdate} onHide = {this.handleUpdateChartModel} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Sửa</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="form-group">
                                    <label className="form-input-label">Tiêu đề</label>
                                    <input className="form-input" type="text" name="title" 
                                    onChange={this.handleChange} value={this.state.title} 
                                    required placeholder="Tên" autoComplete="off"/>
                                </div>
                                <div className="form-group">
                                    <label className="form-input-label">Kiểu dữ liệu</label>
                                    <div className="select-box-container">
                                        <div className="select-input" onClick={this.handleOpenDataType}>
                                            <span className={`${"Choose Device Type" && this.state.typeData  === '' ? "select-title placeholder" : "select-title"}`}>
                                                {this.state.typeData === '' ? "Chọn kiểu dữ liệu" : this.state.typeData}
                                            </span>
                                        </div>
                                    {this.state.isOpenDataType === true ? 
                                        <div className="select-list">
                                        {this.state.listDatatype.map((item, index) => (
                                            <div key={index} onClick={() => {this.handleSelectDataType(item)}} className="select-item">
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                        </div> : null}
                                    </div>
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
                                        {this.state.listDeviceTypeDisplay.map((item, index) => (
                                            <div key={index} onClick={() => {this.handleSelectDeviceType(item)}} className="select-item">
                                                <span>{item.name}</span>
                                            </div>
                                        ))}
                                        </div> : null}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-input-label">Tham số</label>
                                    <div className="select-box-container">
                                        <div className="select-input" onClick={this.handleOpenParameter}>
                                            <span className={`${"Choose Device Type" && this.state.parameter  === '' ? "select-title placeholder" : "select-title"}`}>
                                                {this.state.parameter === '' ? "Chọn tham số" : this.state.parameter}
                                            </span>
                                        </div>
                                        {this.state.isOpenParameter === true ? 
                                        <div className="select-list">
                                        {this.state.listParameter.map((item, index) => (
                                            <div key={index} onClick={() => {this.handleSelectParameter(item)}} className="select-item">
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                        </div> : null}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-input-label">Thiết bị</label>
                                    <div className="multiple-select-box-container">
                                        <div className="multiple-select-box">
                                            <div className="selected-list">
                                                {this.state.devices.map((currentValue, index) => (
                                                    <div className="selected-item" key={index}>
                                                        <span key={index}>
                                                            {currentValue === null ? "Choose Device" : currentValue}
                                                        </span>
                                                        <span onClick = {() => this.handleRemoveItem(index)}>
                                                            <TiDelete />
                                                        </span>
                                                    </div>
                                                ))}
                                                <div className="select-click" onClick={this.handleOpenDevices}></div>
                                            </div>
                                            {this.state.isOpenDevices ? <div className="select-list">
                                                {filterData.map((currentValue, index) => (
                                                    <div key={index} className="select-item" onClick={() => {
                                                        this.handleSelectDevices(currentValue.id);
                                                    }}>
                                                        <span className="select-title">{currentValue.id}</span>
                                                    </div>
                                                ))}
                                            </div> : null}
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleUpdateChartModel}>Đóng</Button>
                                <Button variant="dark" onClick= {this.updateChartModel}>Cập nhật</Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={this.state.showDelete} onHide = {this.handleDeleteChartModel} centered>
                            <Modal.Header>
                                <Modal.Title>Xoá</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Bạn có muốn xoá đồ thị?</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleDeleteChartModel}>Đóng</Button>
                                <Button variant="danger" onClick= {this.deleteChartModel}>Xoá</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                <div id="dashboard-detail-page-dashboard-section">
                    {this.props.listChartModels.map((currentValue, index) => {
                        switch(currentValue.typeChart){
                            case "Line":
                                return(
                                    <div key={index} className="container-chart-section">
                                        <div className="container-chart">
                                            <Line ref={this.state.chartRef[index]} data={this.state.data[index]}
                                            options={{
                                                title: {
                                                    display: true,
                                                    text: currentValue.title,
                                                    fontSize: 20,
                                                    fontColor: 'black'
                                                },
                                                legend: {
                                                    display: true,
                                                    position: "bottom"
                                                },
                                                scales: {
                                                    yAxes: [{
                                                        ticks: {
                                                        },
                                                        scaleLabel: {
                                                            display: true,
                                                            labelString: currentValue.parameter,
                                                            fontSize: 16
                                                        }
                                                    }],
                                                    xAxes: [{
                                                        scaleLabel: {
                                                            display: true,
                                                            labelString: currentValue.typeData,
                                                            fontSize: 16
                                                        }
                                                    }]
                                                }
                                            }}/>
                                        </div>
                                        <div className="btn-edit-delete">
                                            <button onClick={() => {
                                                this.setState({typeChart: currentValue.typeChart, chartModelId: currentValue.id});
                                                this.handleUpdateChartModel();
                                            }}><GrEdit /></button>
                                            <button onClick={() => {
                                                this.setState({chartModelId: currentValue.id});
                                                this.handleDeleteChartModel();
                                            }}><MdDelete /></button>
                                        </div>
                                    </div>)
                            case "Bar": 
                                return(
                                    <div key={index} className="container-chart-section">
                                        <div className="container-chart">
                                            <Bar ref = {this.state.chartRef[index]} data={this.state.data[index]}
                                            options={{
                                                title: {
                                                    display: true,
                                                    text: currentValue.title,
                                                    fontSize: 20,
                                                    fontColor: 'black'
                                                },
                                                legend: {
                                                    display: true,
                                                    position: "bottom"
                                                },
                                                scales: {
                                                    yAxes: [{
                                                        ticks: {
                                                        },
                                                        scaleLabel: {
                                                            display: true,
                                                            labelString: currentValue.parameter,
                                                            fontSize: 16
                                                        }
                                                    }],
                                                    xAxes: [{
                                                        scaleLabel: {
                                                            display: true,
                                                            labelString: currentValue.typeData,
                                                            fontSize: 16
                                                        }
                                                    }]
                                                }
                                            }}/>
                                        </div>
                                        <div className="btn-edit-delete">
                                            <button onClick={() => {
                                                this.setState({typeChart: currentValue.typeChart, chartModelId: currentValue.id});
                                                this.handleUpdateChartModel();
                                            }}><GrEdit /></button>
                                            <button onClick={() => {
                                                this.setState({chartModelId: currentValue.id})
                                                this.handleDeleteChartModel();
                                            }}><MdDelete /></button>
                                        </div>
                                    </div>)
                                default: 
                                    return null
                        }
                    })}
                </div>
                </div>
            </div>
        )
        
    }
}
const mapStateToProps = (state) => ({
    listChartModels: state.dashboard.listChartModels,
    currentUser: state.user.currentUser,
    endpointTypes: state.endpointType.endpointTypes,
    endpoints: state.device.listDevices,
    endpointType: state.endpointType.endpointType,
    isLoggedIn: state.user.isLoggedIn
})
const mapDispatchToProps = (dispatch) => ({
    fetchEndpointTypes: (currentUser) => dispatch(fetchEndpointTypes(currentUser)),
    fetchListChartModels: (id, currentUser) => dispatch(fetchListChartModels(id, currentUser)),
    fetchCreateChartModel: (id, typeChart, currentUser) => dispatch(fetchCreateChartModel(id, typeChart, currentUser)),
    fetchUpdateChartModel: (dashboardId, chartModelId, typeChart, typeData, title, deviceType, parameter, devices, listParameter,currentUser) => dispatch(fetchUpdateChartModel(dashboardId, chartModelId, typeChart, typeData, title, deviceType, parameter, devices, listParameter, currentUser)),
    fetchDeleteChartModel: (dashboardId, chartModelId, currentUser) => dispatch(fetchDeleteChartModel(dashboardId, chartModelId, currentUser)),
    fetchListEndpoints: (currentUser) => dispatch(fetchListEndpoints(currentUser)),
    fetchEndpointType: (id, currentUser) => dispatch(fetchEndpointType(id, currentUser))
})
export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(DashBoardDetailPage);