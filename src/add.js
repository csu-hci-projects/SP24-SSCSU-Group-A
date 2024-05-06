import React from 'react'
import './add.css';

function Add(props) {
    return (
        <div className='ad'>
            <img className='ad_image'
                onClick={() => { props.record('ad') }}
                src='https://img.freepik.com/premium-psd/instagram-post-ads-banner-template-with-creative-digital-business-marketing-concept_169869-559.jpg'
            />
        </div>
    )
}

export default Add
