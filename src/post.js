import React from 'react'
import './post.css';
import { Avatar } from '@mui/material';

function Post(props) {
    return (
        <div className='post'>
            <div className="post_header" onClick={() => { props.record('post') }}>
                <Avatar
                    className='post_avatar'
                    alt='RafeQazi'
                // src='https://miro.medium.com/v2/resize:fit:1400/1*kxBdslclglg4zgCw0NMIIA.png'
                />
                <h3>{props.username}</h3>
            </div>
            <img className='post_image' src={props.imageUrl} onClick={() => { props.record('like') }} />
            <h4 className='post_text' onClick={() => { props.record('comment') }}><strong>{props.username}:</strong>{props.caption}</h4>
        </div>
    )
}

export default Post
