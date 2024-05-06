import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Input } from '@mui/material';
import Header from './header';
import './modal.css';
//authentication libraries
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { get, update } from 'firebase/database';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const auth = getAuth();

export default function BasicModal(props) {
    //modal states
    const [open, setOpen] = React.useState(false);
    const [openSignin, setOpenSignin] = useState(false);
    //app states
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [user, setUser] = useState(null);

    //modal handlers
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false)
        setOpenSignin(false)
    };

    const signup = (event) => {
        event.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((user) => {
                console.log('User signed up.', user);
                updateProfile(auth.currentUser, {
                    displayName: username
                })
            })
            .catch((error) => {
                console.log('Error while signup', error);
                alert(error);
            })
    };
    const signin = (event) => {
        event.preventDefault();
        console.log(email, password);
        signInWithEmailAndPassword(auth, email, password)
            .then((userc) => {
                setUser(userc.user);
            })
            .catch((error) => {
                alert(error);
            })

        setOpenSignin(false);

        console.log("user:", user);
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                // console.log('authuser:', authUser);
                setUser(authUser);
                props.getUsername(authUser.displayName);
                if (authUser.displayName) {
                    console.log('authUser has displayName', authUser.displayName);
                }
                else {
                    updateProfile(auth.currentUser, {
                        displayName: username
                    })
                }
            }
            else {
                setUser(null);
            }
        });

        return () => {
            //cleanup for previous state.
            unsubscribe();
        }
    }, [user, username]);

    return (
        <div>{
            user ? (
                <Button onClick={() => { auth.signOut() }}>Logout</Button>
            ) :
                (
                    <div className="app_login">
                        <Button onClick={() => setOpenSignin(true)}>Log in</Button>
                        <Button onClick={handleOpen}>Sign up</Button>
                    </div>
                )}
            <Modal
                open={openSignin}
                onClose={() => setOpenSignin(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <center>
                        <Header />
                    </center>
                    <form className='app_signup'>
                        <Input
                            type='email'
                            placeholder='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type='password'
                            placeholder='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button type='submit' onClick={(event) => signin(event)}>Log in!</Button>
                    </form>
                </Box>
            </Modal>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <center>
                        <Header />
                    </center>
                    <form className='app_signup'>
                        <Input
                            type='email'
                            placeholder='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type='text'
                            placeholder='username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input
                            type='password'
                            placeholder='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button type='submit' onClick={(event) => signup(event)}>Sign up!</Button>
                    </form>
                </Box>
            </Modal>
        </div >
    );
}
