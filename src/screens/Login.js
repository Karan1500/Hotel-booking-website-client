import { useState,useEffect,React } from "react";
import axios from "axios"
import Loader from "../components/Loader";
import Error from "../components/Error";

function Login() {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(false)
    
    async function login() {
        const user={
            email,
            password
        }
        console.log(user)
        try {
            setLoading(true)
            const result = await axios.post("http://localhost:5000/api/users/login",user)
            setLoading(false)
            localStorage.setItem('currentUser',JSON.stringify(result))
            window.location.href='/home'   
        } catch (error) {
            console.log(error)
            setLoading(false)
            setError(true)
        }
    }

    return (
        <div>
            {loading && (<Loader />)}
            <div className='row justify-content-center mt-5'>
                <div className='col-md-5'>
                    {error && (<Error message='Invalid credentials'/>)}
                    <div className="bs">
                        <h2>Login</h2>
                        <input type='text' className='form-control' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <input type='text' className='form-control' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <button className="btn btn-primary mt-3" onClick={login} style={{backgroundColor: 'black', border: 'none'}}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;