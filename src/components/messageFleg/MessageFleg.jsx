import { useState, useEffect } from 'react';
import './MessageFleg.css';



function MessageFleg({ text, className, setVisibleMessageFleg, visibleMessageFleg }){

    useEffect(() =>{

        if(!text){
            setVisibleMessageFleg(false)
            return
        }

        setVisibleMessageFleg(true)

        const timer = setTimeout(() =>{
            setVisibleMessageFleg(false)
        }, 5000)

        return () => clearTimeout(timer)

    },[text])

    return (
        <>
            {
                visibleMessageFleg && (
                    <div className={`${'message'} ${className}`}><p>{text}</p></div>
                )
            }
        </>
    )


}

export default MessageFleg;