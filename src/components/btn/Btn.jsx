import "./Btn.css";

function Btn({ txtBtn, typeBtn, dadosAtendimentos }) {
  const handleSerchMessage = async () => {
    
  }

  return (
    <button className={`btn ${typeBtn}`} onClick={handleSerchMessage}>
      {txtBtn}
    </button>
  );
}

export default Btn;
