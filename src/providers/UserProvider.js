import React,{Component,createContext} from "react";
import {auth} from "../firebase";
import {createOrGetUserProfileDocument} from "../firebase";


const initialUserState={user:null,loading:true};
export const UserContext=createContext(initialUserState);

class UserProvider extends Component{
  state=initialUserState;

  componentDidMount=async()=>{
    //Will be fired whenever you go from logged in to logged out state o vice-versa
      auth.onAuthStateChanged(async(userAuth)=>{
        //  console.log('UserProvider -> componentDidMount -> userAuth',userAuth);

          if(userAuth){
            const userRef=await createOrGetUserProfileDocument(userAuth);
          //  console.log("userRef",userRef);

            userRef.onSnapshot(snapshot=>{
            //  console.log("Snapshot",snapshot);
            //  console.log("Snapshot data",snapshot.data());
              this.setState({
                user:{uid:snapshot.id,
                ...snapshot.data()},
                loading:false
              });
            });
          }
          this.setState({user:userAuth,loading:false});
      });
  }


  render(){
  //  console.log(this.state.user);
    return(
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default UserProvider;
