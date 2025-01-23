import "./SidebarHeader.css";
import React from "react";
import { useState, useEffect } from "react";
import { MdAccountCircle, MdAddCircle } from "react-icons/md";
import { mutate } from "swr";
import InputNewChat from "../promptMessages/InputNewChat";
import { RiLoader3Fill } from "react-icons/ri";
import InputSearch from "../search/InputSearch";
import { CiSearch } from "react-icons/ci";
import { FaMoon, FaSun } from "react-icons/fa";

function SidebarHeader({
  number,
  url,
  apiKey,
  queueId,
  mobile,
  setSearch,
  notifyInfoSuccess,
  notifyInfoError,
  setOpenNewChat,
  setNightMode,
  nightMode,
  nameUser,
}) {
  const [visibleUpdate, setVisibleUpdate] = useState(true);
  const [visibleinput, setVisibleInput] = useState(false);
  const [newNumber, setNewNumber] = useState(null);
  const [confirmeNewChat, setConfirmeNewChat] = useState(false);
  const [visibleNumber, setVisibleNumber] = useState(true);
  const [nightModeHeader, setNightModeHeader]= useState(false);
  const [backgroundNight, setBackgroundNight]= useState("#f0f2f5");
  const [colorNight, setColorNight]= useState("black")
  //Body da requisição de novo chat:
  const bodyNewChat = { queueId: queueId, apiKey: apiKey, number: newNumber };
  // const [visibleMessageFleg, setVisibleMessageFleg]= useState(false);
  // const[typeMessageFleg, setTypeMessageFleg]= useState("");
  const [visibleInputSearch, setVisibleInputSearch] = useState(false);

  function update() {
    mutate(`${url}/int/getAllOpenChats`);
    setVisibleUpdate(false);
    let textInfoSuccess = "Atualizado!";
    notifyInfoSuccess(textInfoSuccess);
    setTimeout(() => {
      setVisibleUpdate(true);
    }, 60000);
  }

  //Mudança de cor do cabeçalho
  function handleColorChange (){
    // setColor(e.target.value)
    if(!nightModeHeader){
      setNightMode(true);
      setNightModeHeader(true);
      setBackgroundNight("#202c33");
      setColorNight('white');
    }else{
      setNightMode('');
      setNightModeHeader(false);
      setBackgroundNight('#f0f2f5');
      setColorNight('black')
    }
  }

  function newChat() {
    setVisibleInput(true);
  }

  useEffect(() => {
    if (confirmeNewChat) {
      // console.log(bodyNewChat);
      //Requisição para novo chat:
      fetch(`${url}/int/openChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyNewChat),
      })
        .then((resp) => resp.json())
        .then((data) => {
          // console.log(data?.message);
          setVisibleInput(false);
          if (data?.message == "success") {
            let textInfoSuccess = `Chat aberto! ${newNumber}`;
            notifyInfoSuccess(textInfoSuccess);
            setOpenNewChat(`55${newNumber.replace(/\D/g, "")}@s.whatsapp.net`);
          } else if (data?.message == "Client already has open chat.") {
            let textInfoError = "Cliente já possui chat aberto.";
            notifyInfoError(textInfoError);
          } else if (data?.message == "The phone number is not a whatsapp user.") {
            let textInfoError = "Número não possui WhatsApp.";
            notifyInfoError(textInfoError);
          } else if (data?.message == "Invalid phone number") {
            let textInfoError = "Número inválido.";
            notifyInfoError(textInfoError);
          }
          setNewNumber(null);
        })
        .catch((err) => console.error(err));
    }
  }, [confirmeNewChat]);

  function Search() {
    setVisibleInputSearch(true);
  }

  function visibleNum() {
    if (!visibleNumber) {
      setVisibleNumber(true);
    } else if (visibleNumber) {
      setVisibleNumber(false);
    }
  }

  return (
    <>
      {mobile === "true" ? (
        <div className="containerSidebarHeaderMobile" style={{backgroundColor: backgroundNight, color: colorNight}}>
          <MdAccountCircle className="avatar" />
          <div className="numberNameUser">
            <h2>{number}</h2>
            <span>({nameUser})</span>
          </div>
          <div className="options" style={{color: colorNight}}>
            {visibleUpdate && <RiLoader3Fill onClick={update} title="Atualizar" />}
            <MdAddCircle onClick={newChat} title="Novo chat" />
            <CiSearch onClick={Search} title="Pesquisar" />
            {/* Alteração de cor do cabeçalho */}
            {!nightModeHeader ? (
              <FaMoon onClick={handleColorChange} style={{color: colorNight}}/>
              ): (
                <FaSun onClick={handleColorChange} style={{color: colorNight}}/>
              )
            }
            {visibleInputSearch && (
              <InputSearch
                setVisibleInputSearch={setVisibleInputSearch}
                setSearch={setSearch}
                nightMode={nightMode}
              />
            )}
            {visibleinput && (
              <InputNewChat
                setNewNumber={setNewNumber}
                setConfirmeNewChat={setConfirmeNewChat}
                newNumber={newNumber}
                setVisibleInput={setVisibleInput}
                mobile={mobile}
                nightMode={nightMode}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="containerSidebarHeader" style={{backgroundColor: backgroundNight, color: colorNight}}>
          <div className="avatarNumber">
            <MdAccountCircle onClick={visibleNum} className="avatar" title="Ocultar/Mostrar usuário" />
            {visibleNumber && 
              <div className="numberNameUser">
                <h2>{number}</h2>
                <span>({nameUser})</span>
              </div>}
          </div>
          <div className="options" style={{color: colorNight}}>
            {visibleUpdate && <RiLoader3Fill onClick={update} title="Atualizar" />}
            <MdAddCircle onClick={newChat} title="Novo chat" />
            <CiSearch onClick={Search} title="Pesquisar" />
            {/* Alteração de cor do cabeçalho */}
            {!nightModeHeader ? (
              <FaMoon onClick={handleColorChange} title="Escuro" style={{color: colorNight}}/>
              ): (
                <FaSun onClick={handleColorChange} title="Claro" style={{color: colorNight}}/>
              )
            }
            {visibleInputSearch && (
              <InputSearch
                setVisibleInputSearch={setVisibleInputSearch}
                setSearch={setSearch}
                nightMode={nightMode}
              />
            )}
            {visibleinput && (
              <InputNewChat
                setNewNumber={setNewNumber}
                setConfirmeNewChat={setConfirmeNewChat}
                newNumber={newNumber}
                setVisibleInput={setVisibleInput}
                nightMode={nightMode}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
export default SidebarHeader;