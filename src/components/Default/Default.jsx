import { useState, useEffect } from "react";
import "./Default.css";
import { FcAlarmClock, FcCalendar } from "react-icons/fc";
// import { MdMessage } from "react-icons/md";
import { BiChat } from "react-icons/bi";

function Default({ nightMode }) {
  const [time, setTime] = useState(new Date());
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [dataCity, setDataCity] = useState(null);
  const [visibleInfoCity, setVisibleInfoCity] = useState(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  //Buscando coordenadas do cliente
  useEffect(() => {
    function obterLocalizacao() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          (error) => {
            console.error("Erro ao obter localização", error);
          }
        );
      } else {
        console.error("Geolocalização não suportada pelo navegador.");
      }
    }
    obterLocalizacao();
  }, []);

  // Quando a localização estiver disponível, buscar os dados do clima
  useEffect(() => {
    if (latitude && longitude) {
      const dadosClima = async () => {
        const api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=3c5a9966882f283c86151557dbf9662b&lang=br_pt`;
        try {
          const res = await fetch(api);
          const datares = await res.json();
          setDataCity(datares);
          setVisibleInfoCity(true);
        } catch (error) {
          console.error("Erro ao buscar dados do clima", error);
        }
      };
      dadosClima();
    }
  }, [latitude, longitude]); // Só chama a API quando latitude e longitude estiverem disponíveis

  window.addEventListener("message", function (event) {
    if (event.data.type === "location") {
      setLatitude(event.data.lat);
      setLongitude(event.data.lon);
    }
  });

  return (
    <div className={nightMode ? "containerDefaultNight" : "containerDefault"}>
      <div className="cityInfo">
        {visibleInfoCity ? (
          <>
            <div className="cityName">{dataCity?.name}</div>
            <div className="cityClimate">
              {Math.floor(dataCity?.main?.temp) <= 10 ? (
                <span className="temperatura">
                  {Math.floor(dataCity?.main?.temp)} °C ❄️
                </span>
              ) : Math.floor(dataCity?.main?.temp) > 10 &&
                Math.floor(dataCity?.main?.temp) <= 20 ? (
                <span className="temperatura">
                  {Math.floor(dataCity?.main?.temp)} °C 🌥️
                </span>
              ) : Math.floor(dataCity?.main?.temp) > 20 &&
                Math.floor(dataCity?.main?.temp) <= 35 ? (
                <span className="temperatura">
                  {Math.floor(dataCity?.main?.temp)} °C 🌤️
                </span>
              ) : Math.floor(dataCity?.main?.temp) > 35 ? (
                <span className="temperatura">
                  {Math.floor(dataCity?.main?.temp)} °C ☀️
                </span>
              ) : (
                <p>Erro ao carregar clima...</p>
              )}
              <p>Umidade :{dataCity?.main?.humidity}%</p>
            </div>
          </>
        ) : (
          <p className="permissaoLocal">
            Para obter os dados da sua região, permita que o site acesse sua
            localização
          </p>
        )}
      </div>
      <div className="img">
        {/* <MdMessage /> */}
        <BiChat/>
      </div>
      {time.toLocaleTimeString() >= "06:00:00" &&
      time.toLocaleTimeString() <= "11:59:59" ? (
        <h1 className="titleDefaultMorning">Bom dia!</h1>
      ) : time.toLocaleTimeString() >= "12:00:00" &&
        time.toLocaleTimeString() <= "17:59:59" ? (
        <h1 className="titleDefaultAfternoon">Boa tarde!</h1>
      ) : (
        time.toLocaleTimeString() >= "18:00:00" &&
        time.toLocaleTimeString() <= "05:59:59" && (
          <h1 className="titleDefaultNight">Boa noite!</h1>
        )
      )}
      <div className="infoDefault">
        <span>
          <FcAlarmClock /> {time.toLocaleTimeString()}
        </span>
        <span>
          <FcCalendar /> {date.toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export default Default;
