import React,{useContext} from "react";
import {Switch,Route,Redirect} from "react-router-dom";
import {SignIn,Slack} from './';
import {UserContext} from "../providers/UserProvider"


const PrivateRoute=({component:Component, isLoggedIn,...others})=>{
  //const =props;
return(
  <Route
    {...others}
    render={(props)=>{
      if(isLoggedIn){
        return<Component {...props}/>
      }

      return(
        <Redirect to ={{
          pathname:"/login",
          state:{
            from:props.location
          }
      }}/>
    );
    }}
  />
);
}

function App(){
  const auth = useContext(UserContext);
//  console.log("Authhh",auth);
  //const loggedin=auth.user?true:false;
  if (auth.loading) {
     return <h1>Loading!</h1>;
   }
    return(
        <div>
          <Switch>
            <Route path="/login" exact component={SignIn}/>
            <Route path="/signup"  exact component={SignIn}/>
            <PrivateRoute path="/" exact component={Slack} isLoggedIn={auth.user?true:false}/>
          </Switch>
        </div>
    );
}




export default App;
