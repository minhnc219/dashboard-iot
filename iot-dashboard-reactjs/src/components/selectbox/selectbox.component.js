import React from 'react';
import './selectbox.style.scss';
class SelectBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isOpen: false,
            selected: ""
        }
    }
    handleOpen = () => {
        this.setState({isOpen: !this.state.isOpen})
    }
    handleSelect = (title) => {
        this.setState({isOpen: !this.state.isOpen, selected: title})
    }
    render(){
        const {data, placeholder} = this.props;
        const {selected} = this.state;
        return(
            <div className="select-box-container">
                <div className="select-input" onClick={this.handleOpen}>
                    <span className={`${placeholder && selected === '' ? "select-title placeholder" : "select-title"}`}>
                        {selected === '' ? placeholder : selected}
                    </span>
                </div>
                {this.state.isOpen ? 
                    <div className="select-list">
                        {data.map((item, index) => (
                            <div key={index} onClick={() => {this.handleSelect(item)}} className="select-item">
                                <span>{item}</span>
                            </div>
                        ))}
                    </div> : null}
            </div>
        )
    }
}
export default SelectBox;