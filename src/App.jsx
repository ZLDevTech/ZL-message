import { useState, useEffect } from "react";
import * as C from "./App.js";
import Sidebar from "./components/sidebar/Sidebar";
import Chat from "./components/chat/Chat.jsx";
import useSWR from "swr";
import { mutate } from "swr";
import { io } from "socket.io-client";
import { Howl, Howler } from "howler";
import { isMobile } from "react-device-detect";
import notificationSound from "/assets/i_phone__toquecelular.com_.mp3";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Error from "./components/Error/Error.jsx";
import CryptoJS from "crypto-js";

//Realizando verificação da fila useSWR:
const fetcher_status_fila = (url, verificacaoFilaBody) =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(verificacaoFilaBody),
  }).then((resp) => resp.json());

//Realizando a consulta de atendimentos useSWR:
const fetcher_detalhes_chat = (url, detalhesChatsBody) =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(detalhesChatsBody),
  }).then((resp) => resp.json());

function App() {
  //Parametros Globais
  const [url, setUrl] = useState(""); //Url da instancia
  const [queueId, setQueueId] = useState(); //Id da fila para passar nas requisições
  const [apiKey, setApiKey] = useState(""); //apiKey para passar nas requisições
  const [nameUser, setNameUser] = useState("");
  const [userChat, setUserChat] = useState(null);
  const [playNotification, setPlayNotification] = useState(false);
  const [newMessageChat, setNewMessageChat] = useState(null);
  const [messageReceived, setMessageReceived] = useState(null);
  const [messageLida, setMessageLida] = useState(null);
  const [nightMode, setNightMode] = useState(false);
  const [ocultarChatsEmUra, setOcultarChatsEmUra] = useState(true);

  useEffect(() => {
    const key = "f5b7d9a1-b23a-4b6b-b4fc-cc3a07d8bc91";
    const decryptData = (encryptedData) => {
      const bytes = CryptoJS.AES.decrypt(encryptedData, key);
      return bytes.toString(CryptoJS.enc.Utf8);
    };
    // Extrair parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    const instancia = params.get("instancia");
    const fila = params.get("fila");
    const apikey = params.get("apikey");
    const user = params.get("user");
    // console.log("Instancia criptografado:", instancia);
    // console.log("Fila criptografado:", fila);
    // console.log("APIKEY criptografado: ", apikey);
    // console.log("Usuario criptografado: ", user);
    if (instancia && fila && apikey) {
      setUrl(decryptData(instancia));
      setQueueId(decryptData(fila));
      setApiKey(decryptData(apikey));
      setNameUser(decryptData(user));
    }
    window.addEventListener("message", function (event) {
      if (event.data.type === "utilizaUra") {
        setOcultarChatsEmUra(event.data?.value);
      }
    });
  }, []);

  //Notificações:
  //(Notificação de nova mensagem)
  function notifyInfoNewMessage(data) {
    toast.info(
      `Cliente: ${data?.data?.numero_cliente}. Mensagem: "${data?.data?.mensagem}"`,
      {
        autoClose: 2000,
        position: "top-right",
        progress: undefined,
      }
    );
    window.parent.postMessage(
      {
        type: "toast",
        message: `Nova mensagem recebida! Atendimento: ${data?.data?.numero_cliente}`,
      },
      "*"
    );
  }
  //(Notificação de sucesso)
  function notifyInfoSuccess(textInfoSuccess) {
    toast.success(`${textInfoSuccess}`, {
      autoClose: 2500,
      position: "top-center",
      progress: undefined,
    });
  }
  //(Notificação de erro)
  function notifyInfoError(textInfoError) {
    toast.error(`${textInfoError}`, {
      autoClose: 2500,
      position: "top-center",
      progress: undefined,
    });
  }

  useEffect(() => {
    const sound = new Howl({
      src: [notificationSound],
    });
    if (playNotification) {
      sound.play();
    }
  }, [playNotification]);

  //Verificação de Webhooks:
  useEffect(() => {
    if (url && queueId) {
      //Dados obrigatorios em todos Webhooks: instancia, fila.
      // Configurar opções do cliente Socket.IO https://sandbox.zltecnologia.com.br http://localhost:8006
      const socket = io("https://webhook.startsend.com.br", {
        // path: "/webhook/webhook", // Certifique-se de que está usando o caminho correto
        secure: true,
        timeout: 10000,
      });
      socket.emit("joinRoom", { url, queueId });

      socket.on("connect", () => {
        console.log(
          `Conectado ao servidor Socket.IO na sala: ${url}_${queueId}`
        );
      });

      socket.on("disconnect", () => {
        console.log("Desconectado do servidor Socket.IO");
      });

      // Evento de erro de conexão
      socket.on("connect_error", (error) => {
        console.error("Erro de conexão:", error);
        // Aqui você pode realizar ações dependendo do erro, como tentar reconectar ou exibir uma mensagem
      });

      // Evento de timeout de conexão
      socket.on("connect_timeout", () => {
        console.error("Tempo de conexão com SOCKET.IO excedido.");
        // Ação adicional quando a conexão excede o tempo limite
      });

      socket.on("webhookNewChat", (data) => {
        mutate(`${url}/int/getAllOpenChats`);
        // console.log("Chats atualizados", data);
      });

      socket.on("webhookNewMessage", (data) => {
        if (ocultarChatsEmUra) {
          if (data?.user_id != 0) {
            setNewMessageChat(data);
            setPlayNotification(true);
            notifyInfoNewMessage({ data });
            setTimeout(() => {
              setPlayNotification(false);
            }, 1000);
          } //  else {
          //   console.log(`${data?.numero_cliente}, está na URA`);
          // }
        } else {
          setPlayNotification(true);
          setNewMessageChat(data);
          notifyInfoNewMessage({ data });
          setTimeout(() => {
            setPlayNotification(false);
          }, 1000);
        }
      });

      socket.on("webhookchatClosedHook", (data) => {
        mutate(`${url}/int/getAllOpenChats`);
        // console.log(
        //   "Atendimento encerrado e atualizado a lista de atendimento."
        // );
      });

      socket.on("webhookauthStatusHook", (data) => {
        mutate(`${url}/int/getQueueStatus`);
        // console.log("Alteração no status da fila: ", queueId);
      });

      socket.on("webhookmsgReceivedByServerHook", (data) => {
        setTimeout(() => {
          mutate(`${url}/int/getChatMessages`);
          // console.log("Mensagens atualizadas (operador)");
        }, 2000);
      });

      socket.on("webhookmsgSentHook", (data) => {
        mutate(`${url}/int/getChatMessages`);
        // console.log("Mensagens atualizadas (operador)");
      });

      socket.on("webhookmsgReceivedByUserHook", (data) => {
        // console.log(data);
        setMessageReceived(data);
      });

      socket.on("webhookmsgReadedHook", (data) => {
        // console.log(data);
        setMessageLida(data);
      });

      socket.on("webhookmsgDeletedHook", (data) => {
        setTimeout(() => {
          mutate(`${url}/int/getChatMessages`);
          // console.log("Mensagens deletadas");
        }, 1000);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [url, queueId, ocultarChatsEmUra]);

  // VERIFICAÇÃO DA FILA:
  //Body da verificação:
  const verificacaoFilaBody = { queueId: queueId, apiKey: apiKey };
  //Requisição em formato useSWR:
  const { data: statusFila, error: errorStatusFila } = useSWR(
    `${url}/int/getQueueStatus`,
    (url) => fetcher_status_fila(url, verificacaoFilaBody),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
    }
  );

  //BUSCA PELOS DETALHES DE ATENDIMENTOS:
  //Body da requisição de busca:
  const detalhesChatsBody = { queueId: queueId, apiKey: apiKey };
  //Requisição em formato useSWR:
  const {
    data: chat,
    error: error_chat,
    isLoading,
  } = useSWR(
    `${url}/int/getAllOpenChats`,
    (url) => fetcher_detalhes_chat(url, detalhesChatsBody),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
    }
  );

  //Mensagem de carregamento
  if (isLoading) {
    return <p>carregando...</p>;
  }

  function IsMobile() {
    return /Android|iPhone/i.test(navigator.userAgent);
  }
  // console.log(chat);
  // console.log(IsMobile());
  // console.log(navigator.userAgent);
  // const fullurl = window.location.href;
  // console.log("URL: ", fullurl);
  // console.log("VICTOR: ", chat);

  return (
    <>
      {isMobile || IsMobile == "true" ? (
        <C.Container>
          {statusFila?.authenticated ? (
            <>
              <C.testee>
                <ToastContainer theme="dark" limit={3} />
              </C.testee>
              {userChat ? (
                <Chat
                  userChat={userChat}
                  queueId={queueId}
                  apiKey={apiKey}
                  url={url}
                  setUserChat={setUserChat}
                  photo={userChat?.photo}
                  mobile="true"
                  newMessageChat={newMessageChat}
                  messageReceived={messageReceived}
                  messageLida={messageLida}
                  notifyInfoError={notifyInfoError}
                  notifyInfoSuccess={notifyInfoSuccess}
                  nightMode={nightMode}
                  nameUser={nameUser}
                />
              ) : (
                <>
                  <Sidebar
                    setUserChat={setUserChat}
                    queueId={queueId}
                    apiKey={apiKey}
                    chatId={userChat?.chatId}
                    url={url}
                    chat={chat}
                    number={statusFila?.authenticatedNumber}
                    mobile="true"
                    newMessageChat={newMessageChat}
                    notifyInfoSuccess={notifyInfoSuccess}
                    notifyInfoError={notifyInfoError}
                    nightMode={nightMode}
                    setNightMode={setNightMode}
                    nameUser={nameUser}
                  />
                </>
              )}
            </>
          ) : (
            <Error queueId={queueId} apiKey={apiKey} url={url} />
          )}
        </C.Container>
      ) : (
        <C.Container>
          {statusFila?.authenticated ? (
            <>
              <C.testee>
                <ToastContainer theme="dark" limit={5} />
              </C.testee>
              <Sidebar
                setUserChat={setUserChat}
                queueId={queueId}
                apiKey={apiKey}
                chatId={userChat?.chatId}
                url={url}
                chat={chat}
                number={statusFila?.authenticatedNumber}
                newMessageChat={newMessageChat}
                notifyInfoSuccess={notifyInfoSuccess}
                notifyInfoError={notifyInfoError}
                nightMode={nightMode}
                setNightMode={setNightMode}
                nameUser={nameUser}
              />
              <Chat
                userChat={userChat}
                queueId={queueId}
                apiKey={apiKey}
                url={url}
                setUserChat={setUserChat}
                photo={userChat?.photo}
                newMessageChat={newMessageChat}
                messageReceived={messageReceived}
                messageLida={messageLida}
                notifyInfoError={notifyInfoError}
                notifyInfoSuccess={notifyInfoSuccess}
                nightMode={nightMode}
                nameUser={nameUser}
              />
            </>
          ) : (
            <Error queueId={queueId} apiKey={apiKey} url={url} />
          )}
        </C.Container>
      )}
    </>
  );
}
export default App;
