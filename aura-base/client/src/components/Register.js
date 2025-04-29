import React, { useState}  from "react";
import supabase from "../helper/supabaseClient";
import { Link } from 'react-router-dom';
import '../styles/Auth.css';
 
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
      
        if (data && data.user) {
          const user_id = data.user.id;
      
          // Insert user into "users" table
          const { error: insertError } = await supabase
            .from("users")
            .insert([
              {
                user_id: user_id,
                name: displayName,
                group_name: [], // empty array
              },
            ]);
      
          if (insertError) {
            setMessage("Account created, but failed to add user to database.");
            console.error('Insert error:', insertError);
            return;
          }
      
          setCreated("True");
          setMessage("Account created successfully!");
          setEmail("");
          setPassword("");
          setDisplayName("");
        }
      };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">
                    <img src="/logo.png" alt="AuraBase" className="auth-logo-img" />
                </div>
                <h2 className="auth-title">Create Your AuraBase Account</h2>
                {message && (
                    <div className={`auth-message ${created ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input 
                        className="auth-input"
                        onChange={(e) => setDisplayName(e.target.value)} 
                        value={displayName} 
                        type="text" 
                        required 
                        placeholder="Display Name" 
                    />
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
                    <button className="auth-button" type="Submit">Create Account</button>
                </form>
                <div className="auth-link-container">
                    {!created ? (
                        <>
                            <span>Already have an account?</span>
                            <Link className="auth-link" to="/login">Log in</Link>
                        </>
                    ) : (
                        <>
                            <span>Account created successfully!</span>
                            <Link className="auth-link" to="/login">Log in</Link>
                        </> 
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;