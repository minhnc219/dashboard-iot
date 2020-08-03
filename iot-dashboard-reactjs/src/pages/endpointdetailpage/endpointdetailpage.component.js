import React from 'react';
import './endpointdetailpage.style.scss';
import Avatar from '../../components/avatar/avatar.component';
import Sidebar from '../../components/sidebar/sidebar.component';
import {withRouter} from 'react-router-dom';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {fetchDevice} from '../../redux/device/device.action';
import {fetchEndpoint} from '../../redux/endpoint/endpoint.action';
import {fetchEndpointType} from '../../redux/endpointtype/endpointtype.action';
import {Line} from 'react-chartjs-2';
import {HubConnectionBuilder} from '@microsoft/signalr';
import axios from 'axios';
class EndpointDetailPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            deviceNameDisplay: "",
            endpointId: "",
            deviceId: "",
            topic: "",
            name: "",
            gpio: "",
            endpointTypeName: "",
            deviceStatus: null,
            connection: null,
            data: {},
            minMaxValues: []

        }
        this.color = ["red", "blue", "green", "yellow"];
        this.data = {
            labels: [],
            datasets: []
        }
        this.minMaxValues = [];
        this.chartref = React.createRef();
    }
    componentDidMount(){
        if(this.props.isLoggedIn !== false){
        this.props.fetchDevice(this.props.match.params.deviceId, this.props.currentUser)
        .then(() => {
            this.setState({deviceNameDisplay: this.props.device.name});
        });
        this.props.fetchEndpoint(this.props.match.params.endpointId, this.props.currentUser)
        .then(() => {
            this.setState({endpointId: this.props.endpoint.id, deviceId: this.props.endpoint.connectedDeviceId,
            gpio: this.props.endpoint.gpio, name: this.props.endpoint.name, deviceStatus: this.props.endpoint.deviceStatus,
            topic: this.props.endpoint.topic + "/" + this.props.endpoint.id});
            this.props.fetchEndpointType(this.props.endpoint.deviceTypeId, this.props.currentUser).then(() => {
                this.setState({endpointTypeName: this.props.endpointType.name});
                for(let i = 0; i < this.props.endpointType.measurementTypes.length; i++){
                    this.data.datasets.push({
                        label: this.props.endpointType.measurementTypes[i].measurementTypeName,
                        fill: false,
                        borderColor: this.color[i],
                        data: [],
                        hoverBackgroundColor: '#75D9FD',
                        hoverBorderColor: '#75D9FD',
                    });
                    this.minMaxValues.push({
                        minValue: 0,
                        maxValue: 0
                    })
                }
                console.log(this.data);
                console.log(this.minMaxValues);
                this.setState({data: this.data});
            })
        });
        const connection = new HubConnectionBuilder().withUrl("https://localhost:44321/sensorhub").build();
        this.setState({connection: connection}, () => {
            this.state.connection.start()
            .then(() => {
                console.log("connection started");
                console.log(this.props.match.params.endpointId);
                this.state.connection.invoke("JoinGroup", this.props.match.params.endpointId);
            })
            .catch((err) => {
                console.log("Error while establish connection");
            })
            this.state.connection.on("SendMessage", data => {
                let datetime = new Date(data.createdDate);
                let datetimedisplay = datetime.getHours() + ":" + datetime.getMinutes() + ":" + datetime.getSeconds();
                let json = JSON.parse(data.value);
                if(this.data.labels.length < 15){
                    this.data.labels.push(datetimedisplay);
                }
                else{
                    this.data.labels.push(datetimedisplay);
                    this.data.labels.shift();
                }
                for(var key in json){
                    for(let i = 0; i < this.data.datasets.length; i++){
                        if(this.data.datasets[i].label === json[key].Name){
                            if(this.data.datasets[i].data.length < 15){
                                this.data.datasets[i].data.push(json[key].Value);
                                if(json[key].Value > this.minMaxValues[i].maxValue){
                                    this.minMaxValues[i].maxValue = json[key].Value
                                }
                                if(this.minMaxValues[i].minValue === 0){
                                    this.minMaxValues[i].minValue = json[key].Value
                                }
                                if(json[key].Value < this.minMaxValues[i].minValue && this.minMaxValues[i].minValue !== 0){
                                    this.minMaxValues[i].minValue = json[key].Value;
                                }
                            }
                            else{
                                this.data.datasets[i].data.push(json[key].Value);
                                this.data.datasets[i].data.shift();
                                if(json[key].Value > this.minMaxValues[i].maxValue){
                                    this.minMaxValues[i].maxValue = json[key].Value
                                }
                                if(this.minMaxValues[i].minValue === 0){
                                    this.minMaxValues[i].minValue = json[key].Value
                                }
                                if(json[key].Value < this.minMaxValues[i].minValue && this.minMaxValues[i].minValue !== 0){
                                    this.minMaxValues[i].minValue = json[key].Value;
                                }
                            }
                            this.setState({minMaxValues: this.minMaxValues})
                        }

                    }
                }

                this.chartref.current.chartInstance.update();
            })
        });
        axios.get(`https://localhost:44321/api/Measurement/GetRealtimeMeasurementDevice/${this.props.match.params.endpointId}`);
        }
        else{
            this.props.history.push("/login");
        }
    }
    componentWillUnmount(){
        if(this.props.isLoggedIn !== false){
            this.state.connection.stop();
            this.setState({connection: null});
        }
        
    }
    render(){
        return(
            <div id="endpoint-detail-page">
                <div id="endpoint-detail-page-sidebar-section">
                    <Sidebar />
                </div>
                <div id="endpoint-detail-page-body-section">
                    <div className="top-navbar-section">
                        <Avatar />
                    </div>
                    <div id="endpoint-introduction">
                        <h2>{this.state.deviceNameDisplay}</h2>
                        <p>Id: {this.props.match.params.endpointId}</p>
                    </div>
                    <div id="endpoint-information-container">
                        <div id="endpoint-information">
                            <p id="header-endpoint-information">Chi tiết thiết bị</p>
                            <div id= "endpoint-content-information">
                                <div id="endpoint-information-key">
                                    <p>Id:</p>
                                    <p>Name:</p>
                                    <p>Device Id:</p>
                                    <p>Endpoint Type:</p>
                                    <p>Topic:</p>
                                    <p>GPIO:</p>
                                </div>
                                <div id="endpoint-information-value">
                                    <p>{this.state.endpointId}</p>
                                    <p>{this.state.name}</p>
                                    <p>{this.state.deviceId}</p>
                                    <p>{this.state.endpointTypeName}</p>
                                    <p>{this.state.topic}</p>
                                    <p>{this.state.gpio}</p>
                                </div>
                            </div>
                            
                        </div>
                        <div id="endpoint-status">
                        </div>
                    </div>
                    <div id="endpoint-data">
                        <p id="header-endpoint-data">Dữ liệu</p>
                        <div id="container-chart-section">
                            <div id="container-chart">
                                <Line ref={this.chartref} data={this.state.data}
                                options={{
                                    title: {
                                        display: true,
                                        text: this.state.name,
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
                                                beginAtZero: true,
                                            }
                                        }],
                                        xAxes: [{
                                            scaleLabel: {
                                                display: true,
                                                labelString: "Real time",
                                                fontSize: 16
                                            }
                                        }]
                                    }
                                }}/>
                            </div>
                            <div id="table-min-max-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>min</th>
                                            <th>max</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.data.datasets.map((currentValue, index) => (
                                            <tr key={index}>
                                                <td>{this.data.datasets[index].label}</td>
                                                <td>{this.minMaxValues[index].minValue}</td>
                                                <td>{this.minMaxValues[index].maxValue}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    device: state.device.device,
    endpoint: state.endpoint.endpoint,
    currentUser: state.user.currentUser,
    endpointType: state.endpointType.endpointType,
    isLoggedIn: state.user.isLoggedIn
})
const mapDispatchToProps = (dispatch) => ({
    fetchDevice: (id, currentUser) => dispatch(fetchDevice(id, currentUser)),
    fetchEndpoint: (id, currentUser) => dispatch(fetchEndpoint(id, currentUser)),
    fetchEndpointType: (id, currentUser) => dispatch(fetchEndpointType(id, currentUser))
})
export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(EndpointDetailPage);