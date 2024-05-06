import { Button } from '@mui/base';
import React, { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { db, storage } from './firebase';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import { set } from 'firebase/database';
import './upload.css';

// Get a reference to the storage service, which is used to create references in your storage bucket



function Upload(props) {

    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [username, setUsername] = useState('');

    const handleUpload = () => {
        const imageRef = ref(storage, `images/${image.name}`);
        uploadBytes(imageRef, image)
            .then((snapshot) => {

                const uploadTask = uploadBytesResumable(imageRef, image);
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgress(progress);
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        // Handle unsuccessful uploads
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            console.log('File available at', downloadURL);
                            setProgress(0);
                            setCaption('');
                            setImage(null);
                        });
                    }
                );
            })
            .catch((error) => {
                console.log('error while uploading', error);
                alert(error.message);
            })
            .then(() => {
                getDownloadURL(imageRef)
                    .then((url) => {
                        console.log('downloaded url', url);
                        addDoc(collection(db, 'posts'), {
                            timestamp: serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: props.username
                        }).then((uid) => {
                            console.log('Post added with postid', uid);
                            console.log('after reset:', progress, caption, image);
                        });
                    })
            }).catch((error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                console.log(error);
                switch (error.code) {
                    case 'storage/object-not-found':
                        console.log('File doesn\'t exist')
                        break;
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect the server response
                        break;
                }

            });
    }

    // console.log('username received in upload', props.username);
    return (
        <div className='upload'>
            <input type="file" onChange={(event) => {
                if (event.target.files[0]) setImage(event.target.files[0]);
            }} />
            <input type="text" placeholder='Enter a caption' value={caption} onChange={(event) => { setCaption(event.target.value) }} />
            <progress className='upload_progress' value={progress} max='100' />
            <Button onClick={handleUpload} >
                Upload
            </Button>
        </div>
    )
}

export default Upload;
