import "./InputSearch.css";
import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { toast } from "react-toastify";

function InputSearch({ setVisibleInputSearch, mobile, setSearch, nightMode }) {
  const [newNumber, setNewNumber] = useState(""); // Inicializamos com uma string vazia
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

  function searchFunction(e) {
    e.preventDefault();
    const cleanPhoneNumber = newNumber.replace(/\D/g, ""); // Remove qualquer caractere não numérico
    if (cleanPhoneNumber.length === 11) {
      setSearch(`55${cleanPhoneNumber}@s.whatsapp.net`);
      setVisibleInputSearch(false);
    } else {
      toast.error(
        "Para pesquisar por um atendimento, digite o número do cliente, com código de área e nono dígito. Ex: (99) 99999-9999",
        {
          autoClose: 3000, // Tempo de exibição do toast (5 segundos)
          position: "top-center", // Posição do toast
        }
      );
    }
  }

  function close() {
    setVisibleInputSearch(false);
  }

  return (
    <>
      {mobile === "true" ? (
        <div
          className="modal"
          style={{ backgroundColor: backgroundColorBottomNight }}
        >
          <form className="contentInputMobile">
            <h3 style={{ color: colorNight }}>Pesquisar Chat</h3>
            <span style={{ color: colorNight }}>
              Para pesquisar por um atendimento, digite o número do cliente, com
              código de área.
            </span>
            {/* Campo de entrada com máscara aplicada */}
            <input
              type="text"
              value={newNumber}
              onChange={handlePhoneChange} // Atualiza o número com a máscara
              className="inputNumberMobile"
              maxLength="15" // Limita o número de caracteres (contando com a máscara)
              title="Caso o modal suma e não localize o número, verifique os digitos e tente novamente!"
            />
            <button
              className="buttonSearch"
              onClick={searchFunction}
              title="Caso o modal suma e não localize o número, verifique os digitos e tente novamente!"
            >
              <CiSearch />
            </button>
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
            <h3 style={{ color: colorNight }}>Pesquisar Chat</h3>
            <span style={{ color: colorNight }}>
              Para pesquisar por um atendimento, digite o número do cliente, com
              código de área.
            </span>
            {/* Campo de entrada com máscara aplicada */}
            <input
              type="text"
              value={newNumber}
              onChange={handlePhoneChange} // Atualiza o número com a máscara
              className="inputNumber"
              maxLength="15" // Limita o número de caracteres (contando com a máscara)
              title="Caso o modal suma e não localize o número, verifique os digitos e tente novamente!"
            />
            <button
              className="buttonSearch"
              onClick={searchFunction}
              title="Caso o modal suma e não localize o número, verifique os digitos e tente novamente!"
            >
              <CiSearch />
            </button>
            <span
              className="closeDesck"
              style={{ color: colorNight }}
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

export default InputSearch;
