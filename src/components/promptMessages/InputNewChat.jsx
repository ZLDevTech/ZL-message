import "./InputNewChat.css";
import { useState, useEffect } from "react";

function InputNewChat({
  setNewNumber,
  setConfirmeNewChat,
  newNumber,
  setVisibleInput,
  mobile,
  nightMode,
}) {
  const [backgroundColorNight, setBackgroundColorNight] = useState("#fefefe");
  const [colorNight, setColorNight] = useState("black");
  const [backgroundColorBottomNight, setBackgroundColorBottomNight] = useState(
    "rgba(46, 46, 46, 0.829)"
  );

  // Função para aplicar a máscara de telefone
  const applyMask = (value) => {
    return value
      .replace(/\D/g, "") // Remove tudo o que não for número
      .replace(/^(\d{2})(\d)/, "($1) $2") // Formata o código de área
      .replace(/(\d{5})(\d{1,4})/, "$1-$2"); // Formata o número com o traço
  };

  // Função que trata as mudanças no campo de telefone
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setNewNumber(applyMask(value)); // Aplica a máscara no valor
  };

  // Night Mode:
  useEffect(() => {
    if (nightMode) {
      setBackgroundColorNight("black");
      setColorNight("white");
      setBackgroundColorBottomNight("rgba(155, 155, 155, 0.829)");
    } else {
      setBackgroundColorNight("#fefefe");
      setColorNight("black");
      setBackgroundColorBottomNight("rgba(46, 46, 46, 0.829)");
    }
  }, [nightMode]);

  function newChat(e) {
    e.preventDefault();
    if (newNumber.length > 5) {
      setConfirmeNewChat(true);
      setTimeout(() => {
        setConfirmeNewChat(false);
      }, 1000);
    } else {
      alert("Digite corretamente o número do cliente");
    }
  }

  function close() {
    setVisibleInput(false);
  }

  return (
    <>
      {mobile === "true" ? (
        <div
          className="modal"
          style={{ backgroundColor: backgroundColorBottomNight }}
        >
          <form
            className="contentInputMobile"
            style={{ backgroundColor: backgroundColorNight }}
          >
            <h3 style={{ color: colorNight }}>Abrir novo atendimento</h3>
            <span style={{ color: colorNight }}>
              Para abrir um novo atendimento, digite o número do cliente, com
              código de área.
            </span>
            {/* Campo de entrada com máscara aplicada */}
            <input
              type="text"
              value={newNumber}
              onChange={handlePhoneChange} // Atualiza o número com a máscara
              className="inputNumberMobile"
              maxLength="15" // Limita o número de caracteres (contando com a máscara)
            />
            <button onClick={newChat}>Abrir Chat</button>
            <span
              style={{ color: colorNight }}
              className="closeMobile"
              onClick={close}
            >
              &times;
            </span>
          </form>
        </div>
      ) : (
        <div
          className="modal"
          style={{ backgroundColor: backgroundColorBottomNight }}
        >
          <form
            className="contentInput"
            style={{ backgroundColor: backgroundColorNight }}
          >
            <h3 style={{ color: colorNight }}>Abrir novo atendimento</h3>
            <span style={{ color: colorNight }}>
              Para abrir um novo atendimento, digite o número do cliente, com
              código de área.
            </span>
            {/* Campo de entrada com máscara aplicada */}
            <input
              type="text"
              value={newNumber}
              onChange={handlePhoneChange} // Atualiza o número com a máscara
              className="inputNumber"
              maxLength="15" // Limita o número de caracteres (contando com a máscara)
            />
            <button onClick={newChat}>Abrir Chat</button>
            <span
              style={{ color: colorNight }}
              className="closeDesck"
              onClick={close}
            >
              &times;
            </span>
          </form>
        </div>
      )}
    </>
  );
}

export default InputNewChat;
