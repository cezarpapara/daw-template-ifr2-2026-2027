import React from 'react';
import catPhoto from '../assets/cat.jpg'

export default function TestFunction() {
    return (
        <div style={{
            display: 'grid',
            justifyContent: 'center',
            height: '100vh'
        }}>
            <div>
                <h1>Cat</h1>
                <img src={catPhoto}/>
            </div>
        </div>
    )
}
