import React, { useState}  from "react";
import supabase from "../helper/supabaseClient";
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

function Login() {
    const navigate =  useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setMessage(error.message);
            setEmail("");
            setPassword("");
            return;
        }

        if (data) {
            const userId = data.user.id; 
            navigate(`/dashboard/${userId}`);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">
                    <img src="/logo.png" alt="AuraBase" className="auth-logo-img" />
                </div>
                <h2 className="auth-title">Log In to AuraBase</h2>
                {message && <div className="auth-message error">{message}</div>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input 
                        className="auth-input"
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                        type="email" 
                        required 
                        placeholder="Email" 
                    />
                    <input 
                        className="auth-input"
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        type="password" 
                        required 
                        placeholder="Password" 
                    />
                    <button className="auth-button" type="Submit">Log In</button>
                </form>
                <div className="auth-link-container">
                    <span>Don't have an account?</span>
                    <Link className="auth-link" to="/register">Register here</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;