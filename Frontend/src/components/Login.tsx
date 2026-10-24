import { useState } from "react"

interface LoginProp{
    email:string,
    password:string,
}

function Login(){
    const[isLoggedIn,setIsLoggedIn] = useState(false);
    const[showLogin,setShowLogin] = useState(false);
    const[showSignup,setShowSignup] = useState(false);
    const[showPassword,setShowPassword] = useState(false);
    const[email,setEmail]=useState<LoginProp["email"]>("");
    const[password,setPassword]=useState<LoginProp["password"]>("");


    return(
        
    ); 
}

export default Login;