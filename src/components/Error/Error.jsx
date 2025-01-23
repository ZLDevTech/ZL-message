import React from 'react';
import { auth, provider } from "../../services/Autenticacao"
import { useState } from 'react';

import './Error.css'

function Error({ url, queueId, apiKey }){
    const connectData = { queueId: queueId, apiKey: apiKey };
    const [svgContent, setSvgContent]= useState(false);
    const [btnVisible, setBtnVisible]= useState(true);

    function previewEnable(){
        if(svgContent){
            setSvgContent(false)
        }else{
            setSvgContent(true)
        }
    }

    function connect(){
        setBtnVisible(false);
        fetch(`${url}/int/disableQueue`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(connectData),
        }).then((resp) => resp.json())
        .then((data)=>{
            // console.log(data);
            fetch(`${url}/int/enableQueue`,{
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(connectData),
            }).then((resp)=> resp.json())
            .then((data)=>{
                // console.log(data);
                fetch(`${url}/int/connectQueue`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                body: JSON.stringify(connectData),
                }).then((resp) => resp.json())
                .then((data)=>{
                    // console.log(data)
                    setTimeout(()=>{
                        fetch(`${url}/int/getQueueQrCode`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(connectData),
                        }).then((resp)=> resp.text())
                        .then((svgContent)=>{
                            previewEnable();
                            // document.getElementById('svgContainer').innerHTML = svgContent;
                            setTimeout(()=>{
                                document.getElementById('svgContainer').innerHTML = svgContent;
                                setTimeout(()=>{
                                    setSvgContent(false);
                                    setBtnVisible(true);
                                }, 15000)
                            }, 1000)
                        })
                        .catch(Error => () =>{
                            console.error(Error);
                            setBtnVisible(true);
                            setSvgContent(false);
                        })
                    }, 2000)
                }).catch(Error => () =>{
                    console.error(Error);
                    setBtnVisible(true);
                    setSvgContent(false);
                })
            }).catch(Error => () =>{
                console.error(Error);
                setBtnVisible(true);
                setSvgContent(false);
            })
        }).catch(Error => () =>{
            console.error(Error);
            setBtnVisible(true);
            setSvgContent(false);
        })
    }

    return(
        <div className="container">
            {/* <div className="background-deco"></div>
            <div className="sad-face">😞</div>
            <h1>Fila desconectada</h1>
            <p>Oops! Parece que a fila foi desconectada. Por favor, tente novamente.</p>
            <button type="button" onClick={teste} className="btn-retry">Conectar</button>
            <div id="svgContainer"></div> */}
            {!svgContent ?
                (
                <>
                    <div className="background-deco"></div>
                    <div className="sad-face">😞</div>
                    <h1>Fila desconectada</h1>
                    <p>Oops! Parece que a fila foi desconectada. Por favor, tente novamente.</p>
                    {btnVisible ? (
                        <button type="button" onClick={connect} className="btn-retry">Conectar</button>
                    ):(
                        <button type="button" onClick={connect} className="btn-loading">Aguarde</button>
                    )
                    }
                </>  
                ):(
                    <>
                        <div className="svg-container" id="svgContainer" dangerouslySetInnerHTML={{ __html: svgContent }}></div>
                    </>
                )
            }
        </div>
    )
}

export default Error;