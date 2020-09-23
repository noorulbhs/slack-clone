import React,{useState,useContext,useEffect} from "react";
import {signOut,firestore,auth,fieldValue} from "../firebase";
import {Link} from "react-router-dom";


function SideBar(props){

  const [users,setUsers]=useState([]);


  function fetchUsers(){
    firestore.collection("users")
    .get()
    .then((snapshot)=>{
      const u=snapshot.docs.map(doc=>{
        return {id:doc.id,...doc.data()};
      });
      setUsers(u);
});
}

function addUser(id){
  console.log("ID",id);
  console.log("CurrentID",props.currentChannel.id);
  firestore.collection("channels")
  .doc(props.currentChannel.id)
  .update({
    age:"23",
    members:fieldValue.arrayUnion(id)
  });
}


useEffect(()=>{
  fetchUsers();
  console.log("USERSSS",users);
},[props.currentChannel])

    return(
        <div id="sidebar">
          <div className="user-profile">
            <div className="avatar">
              <img src={auth.currentUser.photoURL} alt="pic"/>
            </div>
            <div>{auth.currentUser.displayName}</div>
            <div style={{marginLeft:10, margingTop:2,cursor:"pointer"}} onClick={signOut}>
              <img src="https://www.flaticon.com/svg/static/icons/svg/2150/2150480.svg"
              height="25" alt="pic"/>
            </div>
          </div>
        <hr className="sidebar-spacer" />

        <div className="channels">
          <div className="header">Channels
            <span style={{marginLeft: 120,cursor:"pointer"}} onClick={props.displayBlock}>+</span>
            <span className={props.classes} style={{marginLeft:10,cursor:"pointer"}}>
              <input placeholder="Channel Name" onChange={props.nameChanged} value={props.channelName}/>
              <textarea placeholder="Channel Description" onChange={props.description} value={props.channelDescription}/>
              <button onClick={props.addChannel}>Add</button>
            </span>
          </div>

          <ul className="channels-list">
            {props.channels.map((channel)=>(
              <li key={channel.id}>
                <Link to={`/?id=${channel.id}`}># {channel.name}</Link>
              </li>
            ))}
          </ul>
          <div style={{marginLeft:20,color:"white",marginBottom:15}}>Members
            <span style={{cursor:"pointer",color:"white",marginLeft:10,cursor:"pointer",marginLeft: 114}} onClick={fetchUsers}>+</span>
            <div>{users.map((user,index)=>(
              <div key={index}>
                <div style={{marginTop:10,marginLeft:10,color:"red"}} onClick={()=>addUser(user.id)}>
                  <ul style={{listStyleType:"none",margin: "0px",padding: "0px"}}>
                    <li># {user.display_name}</li>
                  </ul>
                </div>
                </div>
              ))}
              </div>
            </div>
        </div>
      </div>
    );
}

export default SideBar;
