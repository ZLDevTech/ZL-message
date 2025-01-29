import "./SidebarChats.css";
import { useState, useEffect } from "react";

import SidebarChatsItem from "../sidebarChatsItem/SidebarChatsItem";

function SidebarChats({
  id,
  queueId,
  apiKey,
  name,
  number,
  setUserChat,
  url,
  search,
  setSearch,
  isChatIdIncluded,
  removeFromChatList,
  openNewChat,
  nightMode,
}) {
  //Body da requisição foto dos clientes
  let photoChatsBody = [{ queueId: queueId, apiKey: apiKey, chatId: id }];
  //Const que recebera a foto do cliente
  const [imageBlob, setImageBlob] = useState(null);
  const [borderNight, setBorderNight] = useState("0.1rem solid #0000002c");

  // useEffect(()=>{
  //     //Requisição para buscar fotos dos atendimentos
  // photoChatsBody?.map(item =>{
  //     fetch(`${url}/int/getUserProfilePicture`, {
  //     method: "POST",
  //     headers: {
  //     'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(item)
  //     })
  //     .then(resp =>{
  //         if(!resp.ok){
  //             throw new Error('Falha ao obter a imagem');
  //         }
  //         return resp.blob();
  //     })
  //     .then(blob =>{
  //         setImageBlob(blob);
  //     })
  //     .catch(error =>{
  //         console.error('Erro ao obter a imagem:', error);
  //     })
  //     })
  // }, [])

  useEffect(() => {
    if (nightMode) {
      setBorderNight("0.1rem solid #1c262c");
    } else {
      setBorderNight("0.1rem solid #0000002c");
    }
  }, [nightMode]);

  return (
    <div className="containerSidebarChats">
      <div className="contentSidebarChats" style={{ border: borderNight }}>
        <SidebarChatsItem
          id={id}
          name={name}
          number={number}
          setUserChat={setUserChat}
          photo={imageBlob}
          url={url}
          search={search}
          setSearch={setSearch}
          isChatIdIncluded={isChatIdIncluded}
          removeFromChatList={removeFromChatList}
          openNewChat={openNewChat}
        />
      </div>
    </div>
  );
}

export default SidebarChats;

/* // SidebarChats.js
import './SidebarChats.css';
import { useState, useEffect } from 'react';
import SidebarChatsItem from '../sidebarChatsItem/SidebarChatsItem';

function SidebarChats({ id, queueId, apiKey, name, number, setUserChat, url }) {
    const [imageBase64, setImageBase64] = useState(null);

    useEffect(() => {
        const getImageFromStorage = () => {
            return localStorage.getItem(`image_${id}`);
        };

        const storedImageBase64 = getImageFromStorage();

        if (storedImageBase64) {
            setImageBase64(storedImageBase64);
        } else {
            fetch(`${url}/int/getUserProfilePicture`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ queueId: queueId, apiKey: apiKey, chatId: id })
            })
            .then(resp => {
                if (!resp.ok) {
                    throw new Error('Falha ao obter a imagem');
                }
                return resp.blob();
            })
            .then(blob => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64String = reader.result;
                    localStorage.setItem(`image_${id}`, base64String);
                    setImageBase64(base64String);
                };
                reader.readAsDataURL(blob);
            })
            .catch(error => {
                console.error('Erro ao obter a imagem:', error);
            });
        }
    }, [id, queueId, apiKey, url]);

    return (
        <div className='containerSidebarChats'>
            <div className='contentSidebarChats'>
                <SidebarChatsItem
                    id={id}
                    name={name}
                    number={number}
                    setUserChat={setUserChat}
                    photo={imageBase64}
                    url={url}
                />
            </div>
            <div className='dividerSidebarChats' />
        </div>
    );
}

export default SidebarChats; */
