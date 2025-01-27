import "./Btn.css";
import { useState, useEffect } from "react";

function Btn({ dataHistoryChat, setChatIdSearch }) {
  const [controle, setControle] = useState(dataHistoryChat.length - 1); // Controle do item atual

  useEffect(() => {
    setControle(dataHistoryChat?.length - 1); // Atualiza o controle quando os dados mudam
  }, [dataHistoryChat]);

  const handleSearchMessage = async (direction) => {
    try {
      if (direction === "back" && controle > 0) {
        // Voltar para o atendimento anterior
        const novoControle = controle - 1;
        setChatIdSearch(dataHistoryChat[novoControle]?.chatId);
        setControle(novoControle);
      }
    } catch (error) {
      console.error("Erro ao tentar buscar histórico de atendimento.");
    }
  };

  return (
    <div className="containerBtn">
      {controle > 0 && (
        <button
          className={`btn back`}
          onClick={() => handleSearchMessage("back")}
        >
          Mensagens Anteriores
        </button>
      )}
    </div>
  );
}

export default Btn;
