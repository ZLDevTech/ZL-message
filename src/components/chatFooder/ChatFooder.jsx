import "./ChatFooder.css";
import { useState, useEffect } from "react";
import { MdSend, MdOutlineCancel } from "react-icons/md";
import ReactModal from "react-modal";
import { Magnifier } from "react-image-magnifiers";
import ReactPlayer from "react-player";
import { IoMdAddCircleOutline } from "react-icons/io";
import { RiLoader3Fill } from "react-icons/ri";
import {
  FaRegFileArchive,
  FaRegStopCircle,
  FaMicrophoneAlt,
} from "react-icons/fa";
import { useRef } from "react";
import { BsFillSendCheckFill } from "react-icons/bs";
import { TbSendOff } from "react-icons/tb";

function ChatFooder({
  chatId,
  queueId,
  apiKey,
  cahtNumber,
  url,
  notifyInfoError,
  notifyInfoSuccess,
  nightMode,
  nameUser,
}) {
  const [message, setMessage] = useState("");
  const enviarMensagensBody = {
    chatId: chatId,
    queueId: queueId,
    apiKey: apiKey,
    clientId: cahtNumber,
    text: `*${nameUser}*:\n${message}`,
  };
  const maxFile = 35 * 1024 * 1024;
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [shiftPressed, setShiftPressed] = useState(false);
  const [nameFile, setNameFile] = useState(null);
  const [widthfile, setWidthFile] = useState(null);
  const [heightfile, setHeightFile] = useState(null);
  const [duration, setDuration] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [fileSize, setFileSize] = useState(null);
  const [base64Data, setBase64Data] = useState(null);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const enviarFilesBody = {
    fileName: nameFile,
    mimeType: mimeType,
    data: base64Data,
    thumbnail: base64Data,
    width: widthfile,
    height: heightfile,
    duration: duration,
    queueId: queueId,
    apiKey: apiKey,
  };
  const [buttonClick, setButtonClick] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [backgroundColorNight, setBackGroundNight] = useState("#f0f2f5");
  const [backgroundColorInputNight, setBackGroundInputNight] =
    useState("white");
  const [colorNight, setColorNight] = useState("black");
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(
    new (window.AudioContext || window.webkitAudioContext)()
  );

  //Night Mode:
  useEffect(() => {
    if (nightMode) {
      setBackGroundNight("#202c33");
      setBackGroundInputNight("#2a3942");
      setColorNight("white");
    } else {
      setBackGroundNight("#f0f2f5");
      setBackGroundInputNight("white");
      setColorNight("black");
    }
  }, [nightMode]);

  const handleEmojiSelect = (emoji) => {
    setChosenEmoji(emoji);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Shift") {
      setShiftPressed(true);
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === "Shift") {
      setShiftPressed(false);
    }
  };

  function handleModalClose() {
    setModalIsOpen(false);
    setSelectedFile(null);
    setNameFile(null);
    setMimeType(null);
    setFileSize(null);
    setPreviewURL(null);
    setWidthFile(null);
    setHeightFile(null);
    setWidthFile(null);
    setHeightFile(null);
    setDuration(null);
    setBase64Data(null);
    setButtonClick(false);
    setAudioBlob(null);
    setAudioURL(null);
  }

  //Iniciando gravação:
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const options = { mimeType: "audio/ogg; codecs=opus" };
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      mediaStreamRef.current = stream;
      mediaRecorder.ondataavailable = async (e) => {
        const blob = new Blob([e.data], { type: "audio/wav" });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));

        const audioContext = audioContextRef.current;
        const audioBuffer = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            audioContext.decodeAudioData(reader.result, resolve, reject);
          };
          reader.onerror = reject;
          reader.readAsArrayBuffer(blob);
        });
        setDuration(audioBuffer.duration);
        setNameFile("áudio");
        setMimeType("audio/ogg");

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result.split(",")[1];
          setBase64Data(base64String);
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Erro ao acessar o microfone: ", error);
    }
  };

  //Parando gravação:
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    }
  };

  function handleFileChange(e) {
    let textInfoSuccess = "Envie arquivos baixados diretamente do WhatsApp";
    notifyInfoSuccess(textInfoSuccess);
    setTimeout(() => {
      const file = e.target.files[0];
      setSelectedFile(file);
      setModalIsOpen(true);

      if (file) {
        setNameFile(file.name);
        setMimeType(file.type);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          setFileSize(file.size);
          let base64 = e.target.result;
          setPreviewURL(base64);

          if (file.type.startsWith("image/")) {
            const img = new Image();
            img.src = base64;
            img.onload = () => {
              setWidthFile(img.width);
              setHeightFile(img.height);
            };
          } else if (file.type.startsWith("video/")) {
            var textInfoError =
              "No momento não é possível enviar Vídeos no Chat";
            handleModalClose();
            return notifyInfoError(textInfoError);
            // const video = document.createElement("video");
            // video.preload = "metadata";
            // video.onloadedmetadata = () => {
            //   setWidthFile(video.videoWidth);
            //   setHeightFile(video.videoHeight);
            //   setDuration(video.duration);
            // };
            // video.src = base64;
          } else if (file.type.startsWith("audio/")) {
            const audio = document.createElement("audio");
            audio.preload = "metadata";
            audio.onloadedmetadata = () => {
              setDuration(audio.duration);
            };
            audio.src = base64;
          }
          base64 = base64.split(",")[1];
          setBase64Data(base64);
        };
      }
    }, 2500);
  }
  if (fileSize > maxFile) {
    var textInfoError = "Erro! Verifique o tamanho do arquivo (Max = 35MB)";
    handleModalClose();
    return notifyInfoError(textInfoError);
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedFile && !audioURL) {
      if (message.length > 0) {
        fetch(`${url}/int/sendMessageToChat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(enviarMensagensBody),
        })
          .then((resp) => resp.json())
          .then((data) => {
            //console.log("Resposta da Api para o envio de mensagem:", data);
          })
          .catch((err) => console.log(err));
        setMessage("");
      }
    } else {
      setButtonClick(true);
      //Logica para envio de arquivos
      //   console.log("Altura: ", widthfile, " largura; ", heightfile);
      //   console.log("Duração: ", duration);
      //   console.log("File name: ", nameFile);
      //   console.log("MimeType: ", mimeType);
      //   console.log(enviarFilesBody?.data);
      //   console.log(fileSize);

      fetch(`${url}/int/uploadFile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enviarFilesBody),
      })
        .then((resp) => resp.json())
        .then((data) => {
          const enviarMensagensFileBody = {
            queueId: queueId,
            apiKey: apiKey,
            chatId: chatId,
            fileId: data?.fileId,
          };
          fetch(`${url}/int/sendMessageToChat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(enviarMensagensFileBody),
          })
            .then((resp) => resp.json())
            .then((data) => {
              handleModalClose();
              let textInfoSuccess = "Enviando";
              notifyInfoSuccess(textInfoSuccess);
            });
        })
        .catch((err) => {
          console.error("Error: ", err);
          let textInfoError =
            "Erro ao enviar o arquivo, verifique o tipo e tamanho do arquivo, e tente novamente!";
          notifyInfoError(textInfoError, "Erro: (", err, ").");
          handleModalClose();
        });
    }
  };

  function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  }

  return (
    <div
      className="containerChatFooder"
      style={{ backgroundColor: backgroundColorNight }}
    >
      <form className="formChatFooder" onSubmit={handleSendMessage}>
        {!audioURL && (
          <>
            <textarea
              className="inputChatFooder"
              style={{
                backgroundColor: backgroundColorInputNight,
                color: colorNight,
                resize: "none",
              }}
              placeholder="Digite uma Mensagem..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              value={message}
            />
            <label className="custom-file-input-label">
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.gif,.ogg,.pdf" // Adicione os tipos de arquivos permitidos (.pdf,.doc,.docx,.txt,
                hidden
              />
              <IoMdAddCircleOutline
                className="add_icon_files"
                style={{ color: colorNight }}
                title="Adicionar Mídia"
              />
            </label>
          </>
        )}
        {/* Utilização de Audio (Ainda em desenvolvimento.)*/}
        {/* {message.length == 0 ? (
          audioURL ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "5%",
              }}
            >
              <audio controls>
                <source src={audioURL} type="audio/mp3" />
                <source src={audioURL} type="audio/ogg" />
              </audio>
              <MdOutlineCancel
                className="submitIcon"
                style={{ color: colorNight }}
                onClick={handleModalClose}
                title="Cancelar"
              />
              <MdSend
                className="submitIcon"
                style={{ color: colorNight }}
                onClick={handleSendMessage}
                title="Enviar"
              />
            </div>
          ) : isRecording ? (
            <FaRegStopCircle
              className="submitIcon"
              style={{ color: colorNight }}
              onClick={stopRecording}
              title="Parar"
            />
          ) : (
            <FaMicrophoneAlt
              className="submitIcon"
              style={{ color: colorNight }}
              onClick={startRecording}
              title="Gravar"
            />
          )
        ) : (
          <MdSend
            className="submitIcon"
            style={{ color: colorNight }}
            onClick={handleSendMessage}
            title="Enviar"
          />
        )} */}
        {message.length != 0 && (
          <MdSend
            className="submitIcon"
            style={{ color: colorNight }}
            onClick={handleSendMessage}
            title="Enviar"
          />
        )}
      </form>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={handleModalClose}
        contentLabel="Imagem Modal"
        className="custom-modal-content"
        overlayClassName="custom-modal-overlay"
      >
        {previewURL && selectedFile?.type.startsWith("image/") ? (
          <Magnifier
            imageSrc={previewURL}
            zoomFactor={1} // Fator de zoom
            zoomStyle={{ zIndex: 9999 }} // Estilo de CSS para o elemento de zoom
            dragToMove={false} // Desativa a capacidade de arrastar para mover
            mouseActivation="click" // Ativa o zoom apenas no clique
            keyboardActivation={shiftPressed ? "shift" : false} // Ativa o zoom apenas se a tecla Shift estiver pressionada
            className="Magnifier"
          />
        ) : previewURL && selectedFile?.type.startsWith("video/") ? (
          <ReactPlayer
            url={previewURL}
            controls={true}
            width="100%"
            height="100%"
          />
        ) : previewURL && selectedFile?.type.startsWith("audio/") ? (
          <audio controls>
            <source src={previewURL} type="audio/mp3" />
            <source src={previewURL} type="audio/ogg" />
          </audio>
        ) : (
          selectedFile && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "#dcdcdc",
                padding: "1rem",
                borderRadius: "1rem",
                border: "1px solid",
              }}
            >
              <FaRegFileArchive fontSize={"2rem"} cursor={"pointer"} />
              <p style={{ fontSize: "2rem" }}>{nameFile}</p>
            </div>
          )
        )}
        {buttonClick ? (
          <RiLoader3Fill className="btnSendFilesNuul" title="Carregando..." />
        ) : (
          <div className="btnFiles">
            <TbSendOff
              className="btnEndFiles"
              onClick={handleModalClose}
              title="Cancelar"
            />
            <BsFillSendCheckFill
              className="btnSendFiles"
              onClick={handleSendMessage}
              title="Enviar"
            />
          </div>
        )}
      </ReactModal>
    </div>
  );
}

export default ChatFooder;
