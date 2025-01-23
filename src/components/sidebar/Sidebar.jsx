import "./Sidebar.css";
import { useEffect, useState } from "react";
import SidebarHeader from "../sidebarHeader/SidebarHeader";
import SidebarChats from "../sidebarChats/SidebarChats";

function Sidebar({
  setUserChat,
  queueId,
  apiKey,
  url,
  chat,
  number,
  mobile,
  newMessageChat,
  notifyInfoSuccess,
  notifyInfoError,
  setNightMode,
  nightMode,
  nameUser,
}) {
  const [search, setSearch] = useState("");
  const [allChatIds, setAllChatIds] = useState(new Set());
  const [openNewChat, setOpenNewChat] = useState("");
  const [backgroundColorNight, setBackgroundColorNight] = useState("#ffffff");
  const [colorNight, setColorNight] = useState("black");
  const [borderRightNight, setBorderRightNight] = useState(
    "0.5rem solid #c7c7c7"
  );
  const [orderBy, setOrderBy] = useState("default");

  useEffect(() => {
    const updatedChatIds = new Set([
      ...allChatIds,
      Number(newMessageChat?.chat_id),
    ]);
    setAllChatIds(updatedChatIds);
  }, [newMessageChat]);

  // Night mode:
  useEffect(() => {
    if (nightMode) {
      setBackgroundColorNight("#111b21");
      setColorNight("white");
      setBorderRightNight("0.1rem solid #141414");
    } else {
      setBackgroundColorNight("#ffffff");
      setColorNight("black");
      setBorderRightNight("0.1rem solid #c7c7c7");
    }
  }, [nightMode]);

  const handleOrderChange = (event) => {
    setOrderBy(event.target.value);
  };

  const removeFromChatList = (chatIdToRemove) => {
    const updatedChatIds = Array.from(allChatIds).filter(
      (chatId) => chatId !== chatIdToRemove
    );
    setAllChatIds(new Set(updatedChatIds));
  };

  // Função de ordenação
  const sortedChats = (chat?.chats || []).slice().sort((a, b) => {
    if (orderBy === "default") {
      // Ordenação pela clientId (como estava antes)
      return Number(a.chatId) - Number(b.chatId);
    } else if (orderBy === "lastMessage") {
      // Ordenação pela última mensagem recebida (lastRcvMsgTime)
      return (b?.lastRcvMsgTime || 0) - (a?.lastRcvMsgTime || 0);
    }
    return 0;
  });

  return (
    <>
      {mobile === "true" ? (
        <div
          className="containerSidebarMobile"
          style={{
            backgroundColor: backgroundColorNight,
            color: colorNight,
            borderRight: borderRightNight,
          }}
        >
          <SidebarHeader
            number={number}
            url={url}
            queueId={queueId}
            apiKey={apiKey}
            mobile={mobile}
            setSearch={setSearch}
            notifyInfoSuccess={notifyInfoSuccess}
            notifyInfoError={notifyInfoError}
            chat={chat}
            setOpenNewChat={setOpenNewChat}
            setNightMode={setNightMode}
            nightMode={nightMode}
            nameUser={nameUser}
          />
          <div className="containerSelect">
            <select
              id="orderBySelect"
              onChange={handleOrderChange}
              value={orderBy}
              title=" Obs: Ordem Padrão: Últimos atendimentos sempre no final."
            >
              <option value="default">Ordem Padrão</option>
              <option value="lastMessage">Última Mensagem Recebida</option>
            </select>
          </div>
          {sortedChats?.map((item) => {
            const isChatIdIncluded = Array.from(allChatIds).some(
              (id) => Number(id) === Number(item.chatId)
            );
            return (
              <SidebarChats
                key={item.chatId}
                id={item.chatId}
                name={
                  item.clientName ||
                  item.clientUsername ||
                  item.clientProfileName ||
                  item.clientNumber
                }
                number={item.clientId}
                setUserChat={setUserChat}
                queueId={queueId}
                apiKey={apiKey}
                url={url}
                search={search}
                setSearch={setSearch}
                isChatIdIncluded={isChatIdIncluded}
                removeFromChatList={removeFromChatList}
                openNewChat={openNewChat}
                nightMode={nightMode}
                newMessageChat={newMessageChat}
              />
            );
          })}
        </div>
      ) : (
        <div
          className="containerSidebar"
          style={{
            backgroundColor: backgroundColorNight,
            color: colorNight,
            borderRight: borderRightNight,
          }}
        >
          <SidebarHeader
            number={number}
            url={url}
            queueId={queueId}
            apiKey={apiKey}
            setSearch={setSearch}
            notifyInfoSuccess={notifyInfoSuccess}
            notifyInfoError={notifyInfoError}
            chat={chat}
            setOpenNewChat={setOpenNewChat}
            setNightMode={setNightMode}
            nightMode={nightMode}
            nameUser={nameUser}
          />
          <div className="containerSelect">
            <select
              id="orderBySelect"
              onChange={handleOrderChange}
              value={orderBy}
              title=" Obs: Ordem Padrão: Últimos atendimentos sempre no final."
            >
              <option value="default">Ordem Padrão</option>
              <option value="lastMessage">Última Mensagem Recebida</option>
            </select>
          </div>
          {sortedChats?.map((item) => {
            const isChatIdIncluded = Array.from(allChatIds).some(
              (id) => Number(id) === Number(item.chatId)
            );
            return (
              <SidebarChats
                key={item.chatId}
                id={item.chatId}
                name={
                  item.clientName ||
                  item.clientUsername ||
                  item.clientProfileName ||
                  item.clientNumber
                }
                number={item.clientId}
                setUserChat={setUserChat}
                queueId={queueId}
                apiKey={apiKey}
                url={url}
                search={search}
                setSearch={setSearch}
                isChatIdIncluded={isChatIdIncluded}
                removeFromChatList={removeFromChatList}
                openNewChat={openNewChat}
                nightMode={nightMode}
                newMessageChat={newMessageChat}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

export default Sidebar;
