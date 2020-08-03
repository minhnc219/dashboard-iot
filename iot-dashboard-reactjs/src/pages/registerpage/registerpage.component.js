import React from 'react';
import './registerpage.style.scss';
import SignUp from '../../components/signup/signup.component';
const RegisterPage = () => (
    <div className="register-page">
        <div className="form-section">
            <SignUp />
        </div>
    </div>
)
export default RegisterPage;