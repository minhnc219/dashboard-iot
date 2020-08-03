import React from 'react';
import './slide.style.scss';
const Slide = ({image, slideIndex, index}) => (
    <div className = "slide">
        <img className={`${slideIndex === index ? "active" : ""} image`} src={image.src} alt={image.caption}/>
    </div>
)
export default Slide;