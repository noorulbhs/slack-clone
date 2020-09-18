import React,{useState,useContext} from "react";
import {signOut,firestore,auth} from "../firebase";
import {Link} from "react-router-dom";


function SideBar(props){
  const [users,setUsers]=useState([]);
  function fetcUsers(){
  firestore.collection("users")
  .get()
  .then((snapshot)=>{
    const u=snapshot.docs.map(doc=>{
      return {id:doc.id,...doc.data()};
  });
  setUsers(u);
  console.log();
  console.log(users);
});
}

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
                <span style={{display: "flex",cursor:"pointer"}} onClick={fetcUsers}>+</span>
                <div>{users.map(user=>(
                  <div>
                    <div>{user.displayName}</div>
                    <div>Hello</div>
                  </div>
                ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
}

export default SideBar;
