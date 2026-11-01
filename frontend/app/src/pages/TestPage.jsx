import React from 'react';
import catPhoto from '../assets/cat.jpg'

const CuteCatInfo = () => {
    return (
        <h1>Cats are really cute</h1>
        )
}
export const TestFunction = () => {
    return (
        <>
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
            <button onClick={() => {
                alert("Cat");
            }}
            >Cat Button</button>
            <CuteCatInfo />
        </>
    )
}
