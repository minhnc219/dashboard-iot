import React from 'react';
import './slideshow.style.scss';
import Slide from '../slide/slide.component';
class SlideShow extends React.Component{
    runAutomatic = 0;
    constructor(props){
        super(props);
        this.state = {
            slideIndex: 0
        }
        this.getNewSlideIndex = this.getNewSlideIndex.bind(this);
        this.nextSlide = this.nextSlide.bind(this);
    }
    getNewSlideIndex(step){
        const slideIndex = this.state.slideIndex;
        const numberSlide = this.props.images.length;
        let newSlideIndex = slideIndex + step;
        if(newSlideIndex >= numberSlide){
            newSlideIndex = 0;
        }
        if(newSlideIndex < 0){
            newSlideIndex = numberSlide - 1;
        }
        return newSlideIndex;
    }
    nextSlide(){
        this.setState({
            slideIndex: this.getNewSlideIndex(1)
        });
    }
    componentDidMount(){
        this.runAutomatic = setInterval(this.nextSlide, 2000);
    }
    componentWillUnmount(){
        clearInterval(this.runAutomatic);
    }
    render(){
        const {images} = this.props;
        const {slideIndex} = this.state;
        return(
            <div className="slideshow-container">
               <div className="slide-container">
                    {images.map((item, index, items) => (
                        <Slide key={index} image = {item} slideIndex={slideIndex} length={items.length} index={index}/>
                    ))}
               </div>
               <div className="dot-container">
                    {images.map((item, index) => (
                        <div key={index} className={`dot-slide ${slideIndex === index ? "dot-active" : ""}`}></div>
                    ))}
               </div>
            </div>
        )
    }
}
export default SlideShow;