import ChatHeader from '../chatHeader/ChatHeader';
import './Chat.css';
import ChatBody from '../chatBody/ChatBody';
import ChatFooder from '../chatFooder/ChatFooder'
import Default from '../Default/Default';

function Chat({ userChat, queueId, apiKey, url, photo, setUserChat, mobile, newMessageChat, messageReceived, messageLida, notifyInfoSuccess, notifyInfoError, nightMode, nameUser }){

    if(!userChat) return <Default nightMode={nightMode} />;

    return(
        <>
            {mobile === "true" ?
                <div className='containerChatMobile'>
                    <ChatHeader name={userChat?.name} number={userChat?.number} chatId={userChat?.chatId} queueId={queueId} apiKey={apiKey} url={url} photo={photo} setUserChat={setUserChat} mobile={mobile} notifyInfoSuccess={notifyInfoSuccess} notifyInfoError={notifyInfoError} nightMode={nightMode} />
                    <ChatBody chatId={userChat?.chatId} queueId={queueId} apiKey={apiKey} url={url} mobile={mobile} newMessageChat={newMessageChat} messageReceived={messageReceived} messageLida={messageLida} nightMode={nightMode} />
                    <div className='ChatFooderMobile'>
                    <ChatFooder chatId={userChat?.chatId} queueId={queueId} apiKey={apiKey} cahtNumber={userChat?.number} url={url} notifyInfoError={notifyInfoError} notifyInfoSuccess={notifyInfoSuccess} nightMode={nightMode} nameUser={nameUser} />
                    </div>
                </div>
                :
                <div className='containerChat'>
                    <ChatHeader name={userChat?.name} number={userChat?.number} chatId={userChat?.chatId} queueId={queueId} apiKey={apiKey} url={url} photo={photo} setUserChat={setUserChat} notifyInfoSuccess={notifyInfoSuccess} notifyInfoError={notifyInfoError} nightMode={nightMode} />
                    <ChatBody chatId={userChat?.chatId} queueId={queueId} apiKey={apiKey} url={url} newMessageChat={newMessageChat} messageReceived={messageReceived} messageLida={messageLida} nightMode={nightMode} />
                    <div className='ChatFooder'>
                    <ChatFooder chatId={userChat?.chatId} queueId={queueId} apiKey={apiKey} cahtNumber={userChat?.number} url={url} notifyInfoSuccess={notifyInfoSuccess} notifyInfoError={notifyInfoError} nightMode={nightMode} nameUser={nameUser} />
                    </div>
                </div>
            }
        </>
    )

}

export default Chat;