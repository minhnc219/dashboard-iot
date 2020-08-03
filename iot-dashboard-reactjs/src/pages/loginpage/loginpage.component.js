import React from 'react';
import './loginpage.style.scss';
import SlideShow from '../../components/slideshow/slideshow.component';
import SignIn from '../../components/signin/signin.component';
import slide1 from '../../assets/slideshow1.jpg';
import slide2 from '../../assets/slideshow2.jpg';
import slide3 from '../../assets/slideshow3.jpg';
import slide4 from '../../assets/slideshow4.jpg';
import slide5 from '../../assets/slideshow5.jpg';
const images = [
    {src: slide1, caption: "slide 1"},
    {src: slide2, caption: "slide 2"},
    {src: slide3, caption: "slide 3"},
    {src: slide4, caption: "slide 4"},
    {src: slide5, caption: "slide 5"},
  ];
const LoginPage = () => (
    <div className="login-page">
        <div className="introduction-section">
            <SlideShow images={images}/>
        </div>
        <div className="form-section">
            <div className="form-container">
                <SignIn />
            </div>
        </div>
    </div>
)
export default LoginPage;
