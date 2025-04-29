import React, { useState}  from "react";
import supabase from "../helper/supabaseClient";
import { Link } from 'react-router-dom';
 
function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [created, setCreated] = useState("");
    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setCreated("");

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                  displayName: displayName,
                },
              },
        });

        if (error) {
            setMessage(error.message);
            return;
        }

        if (data) {
            setCreated("True");
            setMessage("Account created successfully!");
        }
        setEmail("");
        setPassword("");
        setDisplayName("");
    }

    return <div>
        <h2>Register</h2>
        <br></br>
        {message && <span>{message}</span>}
        <form onSubmit={handleSubmit}>
            <input onChange={(e) => setDisplayName(e.target.value)} value={displayName} type="displayName" required placeholder="Name" />
            <br></br>
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" required placeholder="Email" />
            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" required placeholder="Password" />
            <button type="Submit">Create Account</button>
        </form>
        <br></br>
        {!created && <span>Already have an account?</span>}
        {created && <span>Thanks for registering!</span>}
        <br></br>
        <Link to="/login">Log in.</Link>
    </div>;
}

export default Register;