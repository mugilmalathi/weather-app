import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "../../styles/style.css";
import Chart from "react-apexcharts";
import Map from "../Map";
import { FaSearch } from "react-icons/fa";

const Home = () => {

  const [cities, setCities] = useState([]);
  const [weather, setWeather] = useState([]);
  const [display, setDisplay] = useState(true);
  const [cityName, setCityName] = useState("");

  const [modalIsOpen, setIsOpen] = useState(false);
  const arr = useRef([]);

  const location = () => {
    axios
      .get(" https://ipinfo.io/json?token=52ed0181817dc8")
      .then((response) => {
        setCityName(response.data.city);
        WeatherFetch(response.data.city);
        localStorage.setItem("cityName", JSON.stringify(response.data.city));
      });
  };

  useEffect(() => {
    location();
  }, []);

  const WeatherFetch = (name) => {
    let lon;
    let lat;

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${name}&cnt=7&appid=5c6004fc3786d57b9d23c346916d72e5&units=metric`
      )
      .then((res) => {
        lon = res.data.city.coord.lon;
        lat = res.data.city.coord.lat;
      })
      .catch((error) => {
        console.log("error 34:", error);
      });

    setTimeout(() => {
      sevenDayas(lat, lon);
    }, 500);
  };

  const sevenDayas = (lat, lon) => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=44d2f0f421a5b483b38e2ea12704107e&units=metric`
      )
      .then((res) => {
        setWeather(res.data.daily);

        let x = res.data.daily[0].feels_like;

        arr.current = Object.values(x);
      })
      .catch((error) => {
        console.log("error 42:", error);
      });
  };

  const citiesFetch = (e) => {
    const { value } = e.target;

    if (value.length != 0) {
      setDisplay(false);

      axios
        .get(`https://list-of-cities.herokuapp.com/cities`)
        .then(({ data }) => {
          let arr = data.filter((post) =>
            post.city.toLowerCase().includes(value)
          );

          setCities([...arr]);
        })
        .catch((error) => {
          console.log("error:", error);
        });
    } else {
      setDisplay(true);
    }
  };

  const fetchWeather = (ele) => {
    setDisplay(true);
    WeatherFetch(ele.city);
    setCityName(ele.city);
    localStorage.setItem("cityName", JSON.stringify(ele.city));
  };


  const openPopup = (data) => {
    let day = Object.values(data.feels_like);

    arr.current = day;

    setIsOpen(true);
    localStorage.setItem("singleCity", JSON.stringify(data));
  };

  return (
    <div className="container">
      <div className="container_inside">
        <input
          type="text"
          className="input"
          onChange={citiesFetch}
          placeholder="Search city"
        />
        <div className="search1">
          <span>
            <FaSearch />
          </span>
        </div>

        <div
          className="outputBox"
          style={{ display: display ? "none" : "block" }}
        >
          {cities.map((ele, i) => {
            return (
              <div
                key={i}
                className="cityBoxSingle"
                onClick={() => {
                  fetchWeather(ele);
                }}
              >
                <span className="city">{ele.city}</span>,{" "}
                <span className="state">{ele.state}</span>
              </div>
            );
          })}
        </div>

        <div className="singleData">
          <h2 style={{ textAlign: "center", marginTop: "-10px", color:"gray" }}>
            {cityName}
          </h2>
          <div className="outWeatherBox">
            {weather.map((data, i) => {
              return (
                <div
                  key={i}
                  className="singleweather"
                  onClick={() => {
                    openPopup(data);
                  }}
                >
                  <h3 style={{ margin: "0px" }}>
                    {new Date(`${data.dt}` * 1000).toLocaleDateString("en", {
                      weekday: "short",
                    })}
                  </h3>
                  <p style={{ margin: "0px" }}>{data.weather[0].main}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                    alt=""
                    className="cloudImg"
                  />

                  <p className="temp">{data.temp.min} °</p>
                  <h4 className="temp">{data.temp.max} °</h4>
                </div>
              );
            })}
          </div>
        </div>

        <Chart
          id="chartData"
          type="area"
          series={[
            {
              name: "Temperature",
              data: [...arr.current],
            },
          ]}
          options={{
            dataLabels: {
              formatter: (val) => {},
            },
            yaxis: {
              labels: {
                formatter: (val) => {
                  return `${Math.ceil(25)}℃`;
                },
              },
            },
            xaxis: {
              categories: ["12:00am", "6:00am", "12:00pm", "6:00pm"],
            },
          }}
        />

        <div className="map_div">
          <Map />
        </div>
      </div>
    </div>
  );
};

export default Home;
