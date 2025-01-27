import { useState, useEffect, useRef } from "react";
// import { pdfjs } from 'react-pdf';
// import { Document, Page } from 'react-pdf';
import * as C from "./MessageStyle";
import { Magnifier } from "react-image-magnifiers";
import ReactModal from "react-modal";
import { FaCheck } from "react-icons/fa6";
import { IoCheckmarkDoneOutline, IoCheckmarkDoneSharp } from "react-icons/io5";
import "./Message.css";
import { FaArrowCircleDown, FaRegFileArchive } from "react-icons/fa";
import { MdDeleteForever, MdArrowBack } from "react-icons/md";
import { CiClock2 } from "react-icons/ci";

function Message({
  user,
  message,
  fk_file,
  file_mimetype,
  url,
  queueId,
  apiKey,
  srvrcvtime,
  mobile,
  clientrcvtime,
  clientreadtime,
  file_name,
  deleted,
  id_message,
  id_referenceMessage,
  chatId,
  messageTeste,
}) {
  //Body da requisição para download da imagem:
  const arquivosmBody = {
    queueId: queueId,
    apiKey: apiKey,
    fileId: fk_file,
    download: false,
  };
  const bodyMessages= {
    queueId: queueId,
    apiKey: apiKey,
    chatId: chatId,
  }
  const [imageBlob, setImageBlob] = useState(null);
  const [audio, setAudio] = useState(null);
  const [video, setVideo] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [genericFile, setGenericFile] = useState(null);
  var ReferenceMessage= ""

  const formatarMensagem = (texto)=>{
    const partes = texto.split(/(\*.*?\*|https?:\/\/[^\s]+)/);
    return partes.map((parte, index)=>{
      if(parte.startsWith('*') && parte.endsWith('*')){
        return <strong key={index}>{parte.slice(1, -1)}</strong>
      }else if(/https?:\/\/[^\s]+/.test(parte)){
        return (
          <a href={parte} key={index} target="_blank" rel="noopener noreferrer">{parte}</a>
        )
      }
      return parte;
    })
  }

  //Configurando modal:
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function handleImg() {
    setModalIsOpen(true);
  }

  function handleModalClose() {
    setModalIsOpen(false);
  }

  const controllerRef = useRef(null); // Utilizamos useRef para armazenar a referência do AbortController

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller; // Armazenamos a referência no controllerRef

    fetchFile(controller);

    return () => {
      controller.abort(); // Cancelamos a requisição ao desmontar o componente
    };
  }, []);

  //TRATATIVA DE MENSAGENS CITADAS
  if(id_referenceMessage){
    //console.log("REFERENCIA: ", id_referenceMessage)
    messageTeste?.messages?.map((item)=>{
      //console.log("MENSAGEM: ",item.messageid)
      if(id_referenceMessage == item.messageid){
        //Criando texto com conteudo dentro da mensagem citada
        ReferenceMessage= item.message
      }
    })
  }

  async function fetchFile(controller) {
    // Verifique se fk_file está definido e válido
    if (typeof fk_file == 'undefined' || !fk_file) {
      // console.log("Arquivo não especificado.");
      return;
    }
    // Passamos o AbortController como argumento
      try {
        const response = await fetch(`${url}/int/downloadFile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(arquivosmBody),
          signal: controller.signal,
        });
  
        if (!response.ok) {
          throw new Error("Falha ao obter o arquivo ");
        }
  
        const blob = await response.blob();
  
        if (file_mimetype === "image/jpeg") {
          setImageBlob(blob);
        } else if (file_mimetype === "audio/ogg; codecs=opus" || file_mimetype === "audio/ogg") {
          setAudio(blob);
        } else if (file_mimetype === "video/mp4") {
          setVideo(blob);
        } else if (file_mimetype === "application/pdf") {
          setPdf(blob);
        } else {
          setGenericFile(blob);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Requisição cancelada");
        } else {
          console.error(file_name, " Erro ao obter o arquivo:", error);
        }
      }
  }

  function downloadFile() {
    if (file_mimetype === "image/jpeg" && imageBlob) {
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "imagem");
      document.body.appendChild(link);
      link.click();
    } else if (file_mimetype === "audio/ogg; codecs=opus" || file_mimetype === "audio/ogg" && audio) {
      const url = URL.createObjectURL(audio);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "áudio");
      document.body.appendChild(link);
      link.click();
    } else if (fk_file && file_mimetype === "video/mp4" && video) {
      const url = URL.createObjectURL(video);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "vídeo");
      document.body.appendChild(link);
      link.click();
    } else if (fk_file && file_mimetype === "application/pdf" && pdf) {
      const url = URL.createObjectURL(pdf);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "pdf");
      document.body.appendChild(link);
      link.click();
    } else if (file_mimetype) {
      const url = URL.createObjectURL(genericFile);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file_name);
      document.body.appendChild(link);
      link.click();
    }
  }

  return (
    <>
      {mobile === "true" ? (
        <C.container>
          <C.lineMessage className={user === 2 || user === 3 ? "me" : ""}>
            <C.contentMessageMobile>
            {id_referenceMessage && (
              <C.messageReference title="Mensagem Citada">
                <p>{formatarMensagem(ReferenceMessage)}</p>
              </C.messageReference>
            )}
              {deleted != 0 &&(
                  <p style={{ fontSize: "0.9rem", textAlign: "right", padding: "2px", color: "#FF0000", fontWeight: "bolder"}}>EXCLUIDA</p>
                )
              }
              <C.message style={{ maxWidth: "100%", maxHeight: "100%" }}>
                {file_mimetype ? (
                  <>
                    {imageBlob ? (
                      <C.img_message>
                        <img
                          src={URL.createObjectURL(imageBlob)}
                          style={{ maxWidth: "30rem", maxHeight: "30rem" }}
                        />
                        {formatarMensagem(message)}
                      </C.img_message>
                    ) : audio ? (
                      <audio
                        controls
                        style={{ maxHeight: "100%" }}
                      >
                        <source
                          src={URL.createObjectURL(audio)}
                          type="audio/mp3"
                        />
                        <source
                         src={URL.createObjectURL(audio)}
                         type="audio/ogg" />
                      </audio>
                    ) : video ? (
                      <C.img_message>
                        <video
                          controls
                          style={{ maxWidth: "20rem", maxHeight: "100%" }}
                        >
                          <source
                            src={URL.createObjectURL(video)}
                            type="video/mp4"
                          />
                        </video>
                        {formatarMensagem(message)}
                      </C.img_message>
                    ) : (
                      <>
                        <div className="fileGeneric">
                          <FaRegFileArchive fontSize={"2rem"} cursor={"pointer"} onClick={downloadFile} />
                          <p>{file_name}</p>
                        </div>
                        {formatarMensagem(message)}
                      </>
                    )}
                  </>
                ) : (
                  formatarMensagem(message)
                )}
              </C.message>
              {fk_file || file_mimetype ? (
                <button onClick={downloadFile} className="buttonDownloadFiles" title="Baixar">
                  <FaArrowCircleDown />
                </button>
              ) : (
                <p></p>
              )}
              <C.messageDate className={user === 2 || user === 3 ? "me" : ""}>
              {srvrcvtime && new Date(srvrcvtime).toLocaleString()}
                { user === 2 || user === 3 ? (
                  !srvrcvtime ? (
                    <CiClock2 style={{ fontSize: "1.2rem" }} />
                  ):
                  clientreadtime ? (
                    <IoCheckmarkDoneSharp
                      style={{ color: "blue", fontSize: "1.4rem" }}
                    />
                  ) : clientrcvtime ? (
                    <IoCheckmarkDoneOutline style={{ fontSize: "1.4rem" }} />
                  ) : (
                    <FaCheck style={{ fontSize: "1.4rem" }} />
                  )
                ) : (
                  <p></p>
                )}
              </C.messageDate>
            </C.contentMessageMobile>
          </C.lineMessage>
        </C.container>
      ) : (
        <C.container>
          <C.lineMessage className={user === 2 || user === 3 ? "me" : ""}>
            <C.contentMessage>
            {/* POSSIBILIDADE DE AÇÕES 
            <C.optionsMessages>
              <MdArrowBack style={{cursor: "pointer"}}/>
              <MdDeleteForever style={{cursor: "pointer"}}/>
            </C.optionsMessages> */}
            {id_referenceMessage && (
              <C.messageReference title="Mensagem Citada">
                <p>{formatarMensagem(ReferenceMessage)}</p>
              </C.messageReference>
            )}
              {deleted != 0 &&(
                <p style={{ fontSize: "1rem", textAlign: "right", padding: "2px", color: "#FF0000", fontWeight: "bolder"}}>EXCLUIDA</p>
                )
              }
              <C.message style={{ maxWidth: "100%", maxHeight: "100%" }}>
                {file_mimetype ? (
                  <>
                    {imageBlob ? (
                      <C.img_message>
                        <img
                          onClick={handleImg}
                          src={URL.createObjectURL(imageBlob)}
                          className="modal-image"
                        />
                        {formatarMensagem(message)}
                        <ReactModal
                          isOpen={modalIsOpen}
                          onRequestClose={handleModalClose}
                          contentLabel="Imagem Modal"
                          className="custom-modal-content"
                          overlayClassName="custom-modal-overlay"
                          style={{
                            overlay: {
                              position: "fixed",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              backdropFilter: "blur(5px)",
                            },
                            content: {
                              overflow: "auto",
                              backgroundColor: "white",
                              borderRadius: "10px",
                              padding: "20px",
                            },
                          }}
                        >
                          <Magnifier
                            imageSrc={URL.createObjectURL(imageBlob)}
                            zoomFactor={1}
                            zoomStyle={{ zIndex: 9999 }}
                            dragToMove={false}
                            mouseActivation="click"
                            keyboardActivation={false}
                            style={{
                              image: {
                                width: "100%", // Tamanho da imagem
                                height: "auto", // Altura automática para manter a proporção
                                borderRadius: "10px", // Borda arredondada
                                boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)", // Sombra suave
                                backgroundColor: "white", // Cor de fundo branca
                              },
                              zoomContainer: {
                                border: "2px solid #007bff", // Borda ao redor da área de zoom
                                borderRadius: "10px", // Borda arredondada
                                backgroundColor: "rgba(255, 255, 255, 0.8)", // Cor de fundo semi-transparente
                              },
                              zoomImage: {
                                borderRadius: "8px", // Borda arredondada para a imagem ampliada
                              },
                            }}
                          />
                        </ReactModal>
                      </C.img_message>
                    ) : audio ? (
                      <audio 
                        controls
                        style={{ maxWidth: "20rem", maxHeight: "100%" }}
                      >
                        <source
                          src={URL.createObjectURL(audio)}
                          type="audio/mp3"
                        />
                        <source
                         src={URL.createObjectURL(audio)}
                         type="audio/ogg" />
                      </audio>
                    ) : video ? (
                      <C.img_message>
                        <video
                          controls
                          style={{ maxWidth: "20rem", maxHeight: "100%" }}
                        >
                          <source
                            src={URL.createObjectURL(video)}
                            type="video/mp4"
                          />
                        </video>
                        {formatarMensagem(message)}
                      </C.img_message>
                    ) : pdf ? (
                      <div className="pdfFile">
                        <embed
                          src={URL.createObjectURL(pdf)}
                          type="application/pdf"
                          width="100%"
                        />
                        <p>{file_name}</p>
                      </div>
                    ) : (
                      <>
                        <div className="fileGeneric">
                          <FaRegFileArchive fontSize={"2rem"} cursor={"pointer"} onClick={downloadFile} />
                          <p>{file_name}</p>
                        </div>
                        {formatarMensagem(message)}
                      </>
                    )}
                  </>
                ) : (
                  formatarMensagem(message)
                )}
              </C.message>
              {fk_file || file_mimetype ? (
                <button onClick={downloadFile} className="buttonDownloadFiles" title="Baixar">
                  <FaArrowCircleDown />
                </button>
              ) : (
                <p></p>
              )}
              <C.messageDate className={user === 2 || user === 3 ? "me" : ""}>
                {srvrcvtime && new Date(srvrcvtime).toLocaleString()}
                { user === 2 || user === 3 ? (
                  !srvrcvtime ? (
                    <CiClock2 style={{ fontSize: "1.2rem" }} />
                  ):
                  clientreadtime ? (
                    <IoCheckmarkDoneSharp
                      style={{ color: "blue", fontSize: "1.4rem" }}
                    />
                  ) : clientrcvtime ? (
                    <IoCheckmarkDoneOutline style={{ fontSize: "1.4rem" }} />
                  ) : (
                    <FaCheck style={{ fontSize: "1.4rem" }} />
                  )
                ) : (
                  <p></p>
                )}
              </C.messageDate>
            </C.contentMessage>
          </C.lineMessage>
        </C.container>
      )}
    </>
  );
}

export default Message;