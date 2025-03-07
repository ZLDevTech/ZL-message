import { mutate } from "swr";
import "./SidebarChatsItem.css";
import { MdPerson } from "react-icons/md";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MdOutlineMarkUnreadChatAlt } from "react-icons/md";

function SidebarChatsItem({
  id,
  name,
  number,
  setUserChat,
  photo,
  url,
  search,
  setSearch,
  isChatIdIncluded,
  removeFromChatList,
  openNewChat,
}) {
  const digitsOnly = number.replace(/\D/g, "");
  const [displayNotification, setDisplayNotification] = useState(false);

  useEffect(() => {
    // Define um intervalo para alternar a exibição do ícone a cada 1 segundo
    const interval = setInterval(() => {
      setDisplayNotification((prevDisplay) => !prevDisplay); // Alterna entre true e false
    }, 1000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval);
  }, []);

  let formattedNumber;
  if (digitsOnly.length === 13) {
    formattedNumber = digitsOnly; //Caso possuir já o nono digito
  } else if (digitsOnly.length === 12) {
    formattedNumber = digitsOnly.replace(
      /^(55)(\d{2})(\d{4})(\d{4})$/,
      "$1$29$3$4"
    );
  }
  const numberValidado = `${formattedNumber}@s.whatsapp.net`;

  function handleNewChat() {
    setUserChat(null);
    const userChat = {
      chatId: id,
      name: name,
      number: number,
      photo: photo,
    };
    setTimeout(() => {
      mutate(`${url}/int/getChatMessages`);
      removeFromChatList(id);
      setUserChat(userChat);
      setSearch(null);
    }, 1000);
  }

  useEffect(() => {
    if (search == numberValidado || openNewChat == numberValidado) {
      // console.log("Funcionou. Search: ",search,", NumberValidado: ",numberValidado," Id: ",id)
      toast.success("Chat Localizado", {
        autoClose: 3000, // Tempo de exibição do toast (5 segundos)
        position: "top-center", // Posição do toast
      });
      handleNewChat();
    }
  }, [search, numberValidado]);

  return (
    <>
      {isChatIdIncluded ? (
        <>
          {search == numberValidado ? (
            <>
              <div
                className="containerSidebarChatsItemSearch"
                onClick={handleNewChat}
              >
                {photo ? (
                  <img src={URL.createObjectURL(photo)} />
                ) : (
                  <MdPerson className="avatarSidebarChatsItem" />
                )}
                <span className="nameSidebarChatsItem">{name}</span>
                <div
                  className={`icon_notification${displayNotification ? "" : "Hidden"}`}
                >
                  <MdOutlineMarkUnreadChatAlt />
                </div>
              </div>
            </>
          ) : (
            <div className="containerSidebarChatsItem" onClick={handleNewChat}>
              {photo ? (
                <img src={URL.createObjectURL(photo)} />
              ) : (
                <MdPerson className="avatarSidebarChatsItem" />
              )}
              <span className="nameSidebarChatsItem">{name}</span>
              <div
                className={`icon_notification${displayNotification ? "" : "Hidden"}`}
              >
                <MdOutlineMarkUnreadChatAlt />
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {search == numberValidado ? (
            <>
              <div
                className="containerSidebarChatsItemSearch"
                onClick={handleNewChat}
              >
                {photo ? (
                  <img src={URL.createObjectURL(photo)} />
                ) : (
                  <MdPerson className="avatarSidebarChatsItem" />
                )}
                <span className="nameSidebarChatsItem">{name}</span>
              </div>
            </>
          ) : (
            <div className="containerSidebarChatsItem" onClick={handleNewChat}>
              {photo ? (
                <img src={URL.createObjectURL(photo)} />
              ) : (
                <MdPerson className="avatarSidebarChatsItem" />
              )}
              <span className="nameSidebarChatsItem">{name}</span>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default SidebarChatsItem;
