import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './header';
import Post from './post';
import { db } from './firebase';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import BasicModal from './modal';
import Upload from './upload';
import { InstagramEmbed } from 'react-social-media-embed';
import Add from './add';



function App(props) {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState([]);

  useEffect(() => {

    onSnapshot(query(collection(db, 'posts'), orderBy('timestamp', 'desc')), (snapshot) => {
      let data = snapshot.docs.map((doc) => ({
        id: doc.id,
        post: doc.data()
      }));
      setPosts(data);
    })
  }, []);

  const record = (param) => {
    // console.log(event.target.value);
    console.log(new Date(), param);
    addDoc(collection(db, 'interactions'), {
      timestamp: serverTimestamp(),
      element: param
    })
      .then((did) => {
        console.log('Document added with id: ', did);
      });
  };
  
  return (
    <div className="app">
      <div className="app_header">
        <Header record={record} />
        <div className="app_header_modal">
          <BasicModal getUsername={(username) => {
            console.log('username received in app.js', username);
            setUsername(username)
          }
          }
            record={record} />
        </div>
      </div>
      <div className="app_posts">
        <div className="app_posts_left">
          {
            posts.map(({ id, post }) => {
              return <Post key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl}
                record={record}
              />
            })
          }
        </div>
        <div className="app_posts_right">
          <Add record={record} />
        </div>
      </div>
      <Upload username={username} />
    </div>
  );
}

export default App;
