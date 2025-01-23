import "./ChatHeader.css";
import { useState, useEffect } from "react";
import ModalChatEnd from "../modalChatEnd/ModalChatEnd";

import { MdPerson, MdArrowBackIos } from "react-icons/md";
import { BsDoorClosed } from "react-icons/bs";

function ChatHeader({
  photo,
  name,
  chatId,
  queueId,
  apiKey,
  url,
  setUserChat,
  mobile,
  notifyInfoSuccess,
  notifyInfoError,
  number,
  nightMode,
}) {
  const [modalEndChat, setModalEndChat] = useState(false);
  const [imageBlob, setImageBlob] = useState(null);
  const [backgroundColorNight, setBackGroundNight] = useState("#f0f2f5");
  const [colorNight, setColorNight] = useState("black");
  let photoChatsBody = { queueId: queueId, apiKey: apiKey, chatId: chatId };
  // console.log(photoChatsBody)

  useEffect(() => {
    if (photoChatsBody) {
      //Requisição para buscar fotos dos atendimentos
      fetch(`${url}/int/getUserProfilePicture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(photoChatsBody),
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error("Falha ao obter a imagem");
          }
          return resp.blob();
        })
        .then((blob) => {
          setImageBlob(blob);
        })
        .catch((error) => {
          console.error("Erro ao obter a imagem:", error);
        });
    }
  }, []);

  //night Mode:
  useEffect(() => {
    if (nightMode) {
      setBackGroundNight("#202c33");
      setColorNight("white");
    } else {
      setBackGroundNight("#f0f2f5");
      setColorNight("black");
    }
  }, [nightMode]);

  function endChat() {
    setModalEndChat(true);
  }

  function toBack() {
    setUserChat(null);
  }

  //Limpando numero do cliente para cabeçario
  const cleanPhoneNumber = number.replace(/\D/g, "");
  number = cleanPhoneNumber;

  return (
    <>
      {mobile === "true" ? (
        <div
          className="containerChatHeaderMobile"
          style={{ backgroundColor: backgroundColorNight, color: colorNight }}
        >
          <div className="userInfoMobile">
            {imageBlob ? (
              <img src={URL.createObjectURL(imageBlob)} alt="Avatar" />
            ) : (
              <MdPerson className="avatarInfoMobile" />
            )}
            <div className="nameContentMobile">
              <span className="nameChatHeaderMobile">{name}</span>
              <span className="numberChatHeader">{number}</span>
            </div>
          </div>
          <div className="optionsChatHeaderMobile">
            <MdArrowBackIos onClick={toBack} title="Voltar" />
            <BsDoorClosed onClick={endChat} title="Encerrar" />
          </div>
          {modalEndChat && (
            <ModalChatEnd
              setModalEndChat={setModalEndChat}
              queueId={queueId}
              apiKey={apiKey}
              chatId={chatId}
              url={url}
              setUserChat={setUserChat}
              mobile={mobile}
              notifyInfoSuccess={notifyInfoSuccess}
              notifyInfoError={notifyInfoError}
            />
          )}
        </div>
      ) : (
        <div
          className="containerChatHeader"
          style={{ backgroundColor: backgroundColorNight, color: colorNight }}
        >
          <div className="userInfo">
            {imageBlob ? (
              <img src={URL.createObjectURL(imageBlob)} alt="Avatar" />
            ) : (
              <MdPerson className="avatarInfo" />
            )}
            <div className="nameContent">
              <span className="nameChatHeader">{name}</span>
              <span className="numberChatHeader">{number}</span>
            </div>
          </div>
          <div className="optionsChatHeader" style={{ color: colorNight }}>
            <MdArrowBackIos onClick={toBack} title="Voltar" />
            <BsDoorClosed onClick={endChat} title="Encerrar" />
          </div>
          {modalEndChat && (
            <ModalChatEnd
              setModalEndChat={setModalEndChat}
              queueId={queueId}
              apiKey={apiKey}
              chatId={chatId}
              url={url}
              setUserChat={setUserChat}
              notifyInfoSuccess={notifyInfoSuccess}
              notifyInfoError={notifyInfoError}
            />
          )}
        </div>
      )}
    </>
  );
}

export default ChatHeader;
