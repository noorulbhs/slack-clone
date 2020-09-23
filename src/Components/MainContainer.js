import React,{useState,useEffect} from "react";
import {firestore,auth} from "../firebase";

function MainContainer(props){

  const {channel}=props;
  const [messages,setMessages]=useState([]);
  const [userMessage,setUserMessage]=useState('');
  const [updatedMessage,setUpdatedMessage]=useState("");
  const [clicked,setClicked]=useState(1);
  const [id,setId]=useState("");
  const [classes,setClasses]=useState("hideEditMessage");
  const [show,setShow]=useState(false);
  const [user,setUser]=useState([]);

  function fetchMessages(){
    if(!channel.id) return;

    firestore.collection("messages")
    .where("channel","==",channel.id)
    .orderBy("created_at","asc")
    .get()
    .then((snapshot)=>{
      const messages=snapshot.docs.map(doc=>{
        return {id:doc.id,...doc.data()};
      });
      setMessages(messages);
      // console.log("messagesState",messages);
    });

  }

useEffect(()=>{
  fetchMessages();
  console.log("messages",messages);
},[channel,clicked]);

function handleUserMessage(e){
  setUserMessage(e.target.value);
}

function onEnterPress(e){
  if(e.keyCode===13 && channel.id && userMessage){
    const data={
      from:{
        id:auth.currentUser.uid,
        name:auth.currentUser.displayName,
        photoURL:auth.currentUser.photoURL
      },
      text:userMessage,
      channel:channel.id,
      created_at:new Date()
    };
    firestore.collection("messages")
    .add(data)
    .then(()=>{
      setUserMessage('');
    fetchMessages();
  });
  }
}

function openEdit(id){
  setId(id);
  setShow(!show);
  if(show){
    setClasses("showEditMessage");
  }
  else {
    setClasses("hideEditMessage");
  }
}

function updateMessage(event){
  setUpdatedMessage(event.target.value);
}

function openEditMessageCall(){
  firestore.collection("messages")
  .doc(id)
  .update({
    text:updatedMessage
  })
  .then(()=>{
    setClicked(clicked+1);
    setUpdatedMessage("");
    setClasses("hideEditMessage");
  })
}

function editMessages(event){
    if(event.keyCode===13){
        openEditMessageCall();
  }
}

function userDetail(id){
  console.log(id);
  firestore.collection("users")
  .doc(id)
  .get()
  .then((snapshot)=>{
    setUser(snapshot.data());
  })
}

    return(
      <div id="main-container">
        <div className="about-channel">
          <div className="channel-name">{channel.name}
          <span style={{marginLeft:20,cursor:"pointer"}} onClick={props.showEditChannel}>
              <img src="https://img.icons8.com/pastel-glyph/32/000000/edit.png"/>
          </span>
            <div>
              <input className={props.editChannelClass} placeholder="Channel Nane" value={props.updatedChannel} onChange={props.editChannelName} onKeyDown={props.onEnter} />
            </div>
          </div>
          <div className="channel-desc">{channel.description}</div>
        </div>

        <div className="messages-list">
        {messages.map((message,index)=>(
          <div className="message" key={index}>
            <div className="left-block">
              <img src={message.from.photoURL} alt="left"/>
            </div>
            <div className="right-block">
              <div className="user">
                <div onClick={()=>userDetail(message.from.id)}>{message.from.name}</div>
                <span>1:21 PM</span>
              </div>
              <div className="user-message">{message.text}
                <span style={{marginLeft:50,cursor:"pointer"}} onClick={()=>openEdit(message.id)}>
                  <img src="https://img.icons8.com/pastel-glyph/16/000000/edit.png"/>
                </span>
              </div>
              <input className={message.id===id?classes:"hideEditMessage"} placeholder="Edit message..." value={updatedMessage} onChange={updateMessage} onKeyDown={editMessages}/>
            </div>
          </div>
        ))}
      </div>
          <div className="profile-detail">
              <div className="photo"><img src={user.photo_url} alt="profile_pic"/></div>
              <div>{user.display_name}</div>
              <button className="messageButton">Message</button>
              <button className="callButton">Call</button>

          </div>
        <div className="chat-box">
          <textarea placeholder="Type something and press enter ..." value={userMessage} onChange={handleUserMessage} onKeyDown={onEnterPress}></textarea>
        </div>
      </div>
    );
}

export default MainContainer;
