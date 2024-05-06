import React from 'react'
import './header.css'

function Header(props) {
    const record = props.record;
    return (
        <div onClick={() => props.record('div')}>
            {/* <h2>Header</h2> */}
            <img src="https://i.pinimg.com/564x/ac/76/72/ac76724616bde8c8749f73c1d07ee255.jpg" alt="" className="app_header_image" onClick={() => { props.record('image') }} />
            {/* <BasicModal className='header_modal' getUsername={props.getUsername} /> */}
        </div >
    )
}

export default Header