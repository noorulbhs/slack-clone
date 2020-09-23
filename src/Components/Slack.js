import React,{useEffect,useState,useContext} from "react";
import {SideBar,MainContainer} from "./";
import {firestore,auth} from "../firebase";
import {useLocation} from "react-router-dom";
import {UserContext} from "../providers/UserProvider";

function useQuery(){
  return new URLSearchParams(useLocation().search);
}


function Slack(props){
  const {history}=props;
  const [channels,setChannels]=useState([]);
  const [currentChannel,setCurrentChannel]=useState({});
  const [updatedChannel,setUpdatedChannel]=useState('');
  const [channelDescription,setDescription]=useState('');
  const [channelName,setChannelName]=useState('');
  const [clicked,setClicked]=useState(0);
  const [classes,setClasses]=useState("hideChannelList");
  const [editChannelClass,setEditChannelClass]=useState("hideEditChannelName");
  const [show,setShow]=useState(false);

  const query=useQuery();
  const channelId=query.get('id');

  const auth2=useContext(UserContext);

    function addChannel(){
      const data={
        created_by:auth2.user.uid,
        description:channelDescription,
        name:channelName,
        members:[auth2.user.uid]
      }

      firestore.collection("channels")
      .add(data)
      .then(()=>{
        setChannelName('');
        setDescription('');
        setClasses("hideChannelList");
        setClicked(clicked+1);
      })
    }


    function displayBlock(){
      setClasses("addChannel");
    }

    function nameChanged(event){
      setChannelName(event.target.value);
    }

    function description(event){
      setDescription(event.target.value);
    }


    function editChannelName(event){
      setUpdatedChannel(event.target.value);
    }

    function showEditChannel(){
        setShow(!show);
        if(show){
          setEditChannelClass("editChannelName");
        }
        else {
          setEditChannelClass("hideEditChannelName");
        }
    }

    function onEnter(event){
      if(event.keyCode===13){
        firestore.collection("channels")
        .doc(currentChannel.id)
        .update({
          name:updatedChannel
        })
        .then(()=>{
          setClicked(clicked-1);
          setUpdatedChannel('');
          setEditChannelClass("hideEditChannelName");
        })
      }
    }



  useEffect(()=>{
    firestore.collection("channels")
    .where("members","array-contains",auth.currentUser.uid)
    .get()
    .then((snapshot)=>{
      const channels=snapshot.docs.map(doc=>{
        return {
          id:doc.id,
          ...doc.data()
        }
      });
      //console.log("Slack->Channels",channels);
      setChannels(channels);
      if(!channelId){
        history.push({
          pathname:"/",
          search: `?id=${channels[0].id}`
        });
        setCurrentChannel(channels[0]);
      }else{
        const filteredChannel=channels.filter((ch)=> ch.id===channelId);
        setCurrentChannel(filteredChannel[0]);
      }
    }).catch((error)=>{
      //console.error(error);
    });
    console.log("Channels",channels);
  },[channelId,clicked] );

    return(
        <div id="slack">
          <SideBar channels={channels} currentChannel={currentChannel} channelName={channelName} nameChanged={nameChanged} channelDescription={channelDescription} description={description} addChannel={addChannel} displayBlock={displayBlock} classes={classes}/>
          <MainContainer channel={currentChannel} updatedChannel={updatedChannel} editChannelName={editChannelName} onEnter={onEnter} editChannelClass={editChannelClass} showEditChannel={showEditChannel}/>
        </div>
    );
}

export default Slack;
