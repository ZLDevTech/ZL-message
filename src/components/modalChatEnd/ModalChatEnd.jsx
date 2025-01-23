import { useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function ModalChatEnd({
  setModalEndChat,
  queueId,
  apiKey,
  url,
  chatId,
  setUserChat,
  mobile,
  notifyInfoSuccess,
  notifyInfoError,
}) {
  const handleClose = () => {
    setModalEndChat(false);
  };

  const handleEncerrarChat = () => {
    // Body da requisição para encerrar atendimento
    const endChatBody = {
      queueId: queueId,
      apiKey: apiKey,
      chatId: chatId,
      reason: ".",
    };

    fetch(`${url}/int/endChat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(endChatBody),
    })
      .then((resp) => resp.json())
      .then((data) => {
        // console.log(data);
        const textEndChat = `Chat encerrado!`;
        notifyInfoSuccess(textEndChat);
        setUserChat(null);
      })
      .catch((err) => {
        console.error(err);
        const textInfoError =
          "Ocorreu um erro ao encerrar o chat. Por favor, tente novamente mais tarde.";
        notifyInfoError(textInfoError);
      });
  };

  return (
    <Modal
      open={true} // Altere para a propriedade que controla a abertura do modal
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <>
          <Typography
            id="modal-title"
            variant="h5"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            Deseja encerrar o atendimento?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button variant="contained" onClick={handleEncerrarChat}>
              Sim, Encerrar!
            </Button>
            <Button onClick={handleClose}>Não, cancelar!</Button>
          </Box>
        </>
      </Box>
    </Modal>
  );
}

export default ModalChatEnd;
