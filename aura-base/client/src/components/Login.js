import React, { useState}  from "react";
import supabase from "../helper/supabaseClient";
import { Link, useNavigate } from 'react-router-dom';

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

    return <div>
        <h2>Log In</h2>
        <br></br>
        {message && <span>{message}</span>}
        <form onSubmit={handleSubmit}>
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" required placeholder="Email" />
            <br></br>
            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" required placeholder="Password" />
            <button type="Submit">Log In</button>
        </form>
        <br></br>
        <span>Don't have an account?</span>
        <br></br>
        <Link to="/register">Register here.</Link>
    </div>;
}

export default Login;