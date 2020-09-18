import React,{useContext} from "react";
import {signInWithGoogle} from '../firebase';
import {UserContext} from "../providers/UserProvider";
import {Redirect} from "react-router-dom";


function SignIn(){
  const auth=useContext(UserContext);

  if(auth.user){
    return<Redirect to="/" />;
  }
    return(
        <div className="signin-form">
          <h1>SignIn/Sign Up</h1>
          <button className="btn basic-btn" onClick={signInWithGoogle}>
          <img src="https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Google-256.png" alt="pic"/>
          Sign in with Google
          </button>
          <div style={{ textAlign: 'center', fontSize: 13 }}>OR</div>
          <button className="btn basic-btn" onClick={signInWithGoogle}>
          <img src="https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Google-256.png" alt="pic"/>
          Sign up with Google
          </button>
      </div>
    );
}


export default SignIn;
