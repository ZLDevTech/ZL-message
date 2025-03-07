import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { mutate } from "swr";
import { FaArrowDownWideShort } from "react-icons/fa6";

import Message from "../message/Message";
import Btn from "../btn/Btn";
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
  clientId,
}) {
  //Body da requisição de busca de mensagens do atendimento
  const [chatIdSearch, setChatIdSearch] = useState(chatId);
  const [messagesHistory, setMessagesHistory] = useState({});
  const mensagensAtendimentoBody = {
    queueId: queueId,
    apiKey: apiKey,
    chatId: chatIdSearch,
  };
  const [backgroundImageNight, setBackGroundImageNight] = useState(null);
  const [dataHistoryChat, setDataHistoryChat] = useState([]);
  const refBody = useRef("");

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

  if (
    chatId == messageReceived?.chat_id ||
    chatId == messageLida?.chat_id ||
    chatId == newMessageChat?.chat_id
  ) {
    setTimeout(async () => {
      await mutate(`${url}/int/getChatMessages`);
    }, 2000);
  }

  // Buscar histórico de mensagens do cliente
  useEffect(() => {
    const searchHistory = async () => {
      try {
        fetch(`${url}/int/getClientChatHistory`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            queueId: queueId,
            apiKey: apiKey,
            clientId: clientId,
          }),
        })
          .then((resp) => resp.json())
          .then((data) => {
            setDataHistoryChat(data);
          });
      } catch (error) {
        console.error(
          "Erro ao buscar historico de atendimento para o cliente " + error
        );
      }
    };
    searchHistory();
  }, [clientId]);

  useEffect(() => {
    mutate(`${url}/int/getChatMessages`);
  }, [chatIdSearch]);

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

  //Função para atualizar ou limpar o histórico de mensagens
  const updateMessagesHistory = (newMessages) => {
    setMessagesHistory((prevHistory) => {
      const updatedHistory = { ...prevHistory };

      if (updatedHistory[clientId]) {
        // Para cada nova mensagem, verificar se o id já existe no histórico
        newMessages?.forEach((newMessage) => {
          const existingMessageIndex = updatedHistory[clientId]?.findIndex(
            (msg) => msg?.id === newMessage?.id
          );

          if (existingMessageIndex !== -1) {
            // Se a mensagem já existir, substituímos a mensagem antiga pela nova
            updatedHistory[clientId][existingMessageIndex] = newMessage;
          } else {
            // Se a mensagem não existir, adicionamos ela
            updatedHistory[clientId].push(newMessage);
          }
        });
      } else {
        // Se não houver histórico, adiciona as novas mensagens
        updatedHistory[clientId] = [...newMessages];
      }
      return updatedHistory;
    });
  };

  useEffect(() => {
    if (mensagens) {
      updateMessagesHistory(mensagens.messages);
    }
  }, [mensagens]);

  // Limpando as mensagens quando o clientId mudar
  useEffect(() => {
    setMessagesHistory({}); // Limpa o histórico de mensagens ao trocar o clientId
  }, [clientId]);

  //Realiza a rolagem da tela até o final quando necessario
  useEffect(() => {
    if (refBody.current) {
      refBody.current.scrollTop = refBody.current.scrollHeight;
    }
  }, [mensagens, messagesHistory]);
  function scrollScreen() {
    if (refBody.current) {
      refBody.current.scrollTop = refBody.current.scrollHeight;
    }
  }

  //Mensagem de carregamento
  if (isLoading) {
    return <p>Carregando...</p>;
  }

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
          <div className="containerBtnHistorico">
            <Btn
              dataHistoryChat={dataHistoryChat}
              setChatIdSearch={setChatIdSearch}
            />
          </div>
          {messagesHistory[clientId]
            ?.sort((a, b) => {
              return a.messagetimestamp - b.messagetimestamp;
            })
            ?.map((item) => (
              <Message
                key={`${clientId}-${chatId}-${item.id}`}
                user={item?.direction}
                message={item?.message}
                fk_file={item?.fk_file}
                file_mimetype={item?.file_mimetype}
                file_name={item?.file_name}
                url={url}
                queueId={queueId}
                apiKey={apiKey}
                srvrcvtime={item?.srvrcvtime}
                mobile={mobile}
                clientrcvtime={item?.clientrcvtime}
                clientreadtime={item?.clientreadtime}
                quotedtext={item?.quotedtext}
                deleted={item?.deleted}
                id_message={item?.messageid}
                id_referenceMessage={item?.quotedid}
                chatId={chatId}
                messageTeste={mensagens}
              />
            ))}
          <div className="currentService">
            <FaArrowDownWideShort onClick={scrollScreen} />
          </div>
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
          <div className="containerBtnHistorico">
            <Btn
              dataHistoryChat={dataHistoryChat}
              setChatIdSearch={setChatIdSearch}
            />
          </div>
          {messagesHistory[clientId]
            ?.sort((a, b) => {
              return a.messagetimestamp - b.messagetimestamp;
            })
            ?.map((item) => (
              <Message
                key={`${clientId}-${chatId}-${item.id}`}
                user={item?.direction}
                message={item?.message}
                fk_file={item?.fk_file}
                file_mimetype={item?.file_mimetype}
                file_name={item?.file_name}
                url={url}
                queueId={queueId}
                apiKey={apiKey}
                srvrcvtime={item?.srvrcvtime}
                mobile={mobile}
                clientrcvtime={item?.clientrcvtime}
                clientreadtime={item?.clientreadtime}
                quotedtext={item?.quotedtext}
                deleted={item?.deleted}
                id_message={item?.messageid}
                id_referenceMessage={item?.quotedid}
                chatId={chatId}
                messageTeste={mensagens}
              />
            ))}
          <div className="currentService">
            <FaArrowDownWideShort onClick={scrollScreen} />
          </div>
        </div>
      )}
    </>
  );
}
export default ChatBody;
