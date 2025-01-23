import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { mutate } from "swr";

import Message from "../message/Message";
import Btn from "../btn/btn";
import "./ChatBody.css";

const fetcher_mensagens_chat = (url, mensagensAtendimentoBody) =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mensagensAtendimentoBody),
  }).then((resp) => resp.json());

function ChatBody({
  chatId,
  queueId,
  apiKey,
  url,
  mobile,
  newMessageChat,
  messageReceived,
  messageLida,
  nightMode,
}) {
  //Body da requisição de busca de mensagens do atendimento
  const mensagensAtendimentoBody = {
    queueId: queueId,
    apiKey: apiKey,
    chatId: chatId,
  };
  const [checkRecebimentoMessage, setCheckRecebimentoMessage] = useState(false);
  const [backgroundImageNight, setBackGroundImageNight] = useState(null);
  const refBody = useRef("");
  // console.log(newMessageChat);
  // console.log(messageReceived);
  // console.log(messageLida);
  // console.log(chatId);

  //night mode:
  useEffect(() => {
    if (nightMode) {
      setBackGroundImageNight(
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGk7AUboWxoesi54sV9_ByLJsdOZJ6PR_2jg&s"
      );
    } else {
      setBackGroundImageNight(null);
    }
  }, [nightMode]);

  if (chatId == newMessageChat?.chat_id) {
    mutate(`${url}/int/getChatMessages`);
    // console.log("Mensagens atualizadas (cliente)");
  }

  if (chatId == messageReceived?.chat_id) {
    setTimeout(() => {
      mutate(`${url}/int/getChatMessages`);
      // console.log("Cliente recebeu mensagem");
    }, 2000);
  }

  if (chatId == messageLida?.chat_id) {
    setTimeout(() => {
      mutate(`${url}/int/getChatMessages`);
      // console.log("Cliente leu mensagem");
    }, 2000);
  }

  //Requisição para buscar as mensagens
  const {
    data: mensagens,
    error: err_mensagens,
    isLoading,
  } = useSWR(
    `${url}/int/getChatMessages`,
    (url) => fetcher_mensagens_chat(url, mensagensAtendimentoBody),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
    }
  );
  // console.log(mensagens);
  // console.log(err_mensagens)

  //Realiza a rolagem da tela até o final quando necessario
  useEffect(() => {
    if (refBody.current) {
      refBody.current.scrollTop = refBody.current.scrollHeight;
    }
  }, [mensagens]);

  //Mensagem de carregamento
  if (isLoading) {
    return <p>carregando</p>;
  }

  //TENTATIVA DE REFERENCIAR MENSAGENS
  // useEffect(() => {
  //   if (mensagens?.messages) {
  //     setValuesList(mensagens.messages.map(item => item));
  //   }
  // }, [mensagens]);
  // console.log(valuesList)
  // useEffect(() => {
  //   if (valuesList && referenceMessageId) {
  //     const foundMessage = valuesList.find(item => item?.messageid === referenceMessageId);
  //     if (foundMessage) {
  //       setTextReference(foundMessage?.message);
  //     }
  //   }
  // }, [valuesList, referenceMessageId]);

  return (
    <>
      {mobile === "true" ? (
        <div
          className="containerChatBodyMobile"
          style={{
            backgroundSize: "cover",
            backgroundImage: `url(${backgroundImageNight})`,
          }}
          ref={refBody}
        >
          {mensagens.messages?.map((item) => (
            <Message
              key={item.id}
              user={item.direction}
              message={item.message}
              fk_file={item.fk_file}
              file_mimetype={item.file_mimetype}
              file_name={item.file_name}
              url={url}
              queueId={queueId}
              apiKey={apiKey}
              srvrcvtime={item.srvrcvtime}
              mobile={mobile}
              clientrcvtime={item.clientrcvtime}
              clientreadtime={item.clientreadtime}
              quotedtext={item.quotedtext}
              deleted={item.deleted}
              id_message={item.messageid}
              id_referenceMessage={item?.quotedid}
              chatId={chatId}
              messageTeste={mensagens}
            />
          ))}
        </div>
      ) : (
        <div
          className="containerChatBody"
          style={{
            backgroundSize: "contain",
            backgroundImage: `url(${backgroundImageNight})`,
          }}
          ref={refBody}
        >
          {/* <div className="containerBtnHistorico">
            <Btn txtBtn="Carregar mensagens anteriores..." typeBtn="default" dadosAtendimentos={""} />
          </div> */}
          {mensagens.messages?.map((item) => (
            <Message
              key={item.id}
              user={item.direction}
              message={item.message}
              fk_file={item.fk_file}
              file_mimetype={item.file_mimetype}
              file_name={item.file_name}
              url={url}
              queueId={queueId}
              apiKey={apiKey}
              srvrcvtime={item.srvrcvtime}
              clientrcvtime={item.clientrcvtime}
              clientreadtime={item.clientreadtime}
              quotedtext={item.quotedtext}
              deleted={item.deleted}
              id_message={item.messageid}
              id_referenceMessage={item?.quotedid}
              chatId={chatId}
              messageTeste={mensagens}
            />
          ))}
        </div>
      )}
    </>
  );
}
export default ChatBody;
