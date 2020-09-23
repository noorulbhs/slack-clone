import * as firebase from 'firebase';
//import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';


const firebaseConfig={
  // Your web app's Firebase configuration
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
};


  // Initialize Firebase
firebase.initializeApp(firebaseConfig);


export const fieldValue=firebase.firestore.FieldValue;
export const auth=firebase.auth();
export const firestore=firebase.firestore();

export const signInWithGoogle=()=>{
  const googleProvider=new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(googleProvider);
}



export const signOut=()=>{
  auth.signOut();
}



export const createOrGetUserProfileDocument=async(user)=>{
  if(!user) return;

  const userRef=firestore.doc(`users/${user.uid}`);
  const snapshot=await userRef.get();

  if(!snapshot.exist){
    const{displayName,email,photoURL}=user;

    try{
      const user={
        display_name:displayName,
        email,
        photo_url:photoURL,
        created_at:new Date()
      };
      await userRef.set(user);
    }
    catch(error){
    //  console.log("Error",error);
    }
  }
  return getUserDocument(user);
}

async function getUserDocument(user){
  if(!user.uid) return null;

  try{
    const userDocument=await firestore.collection('user').doc(user.uid);
    return userDocument;
  }
  catch(error){
  //  console.error("Error in getUserDocument",error.message);
  }
}
