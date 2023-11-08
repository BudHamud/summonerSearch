import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import riotAPI from "../api/riotAPI.js";

const Main = styled.main`
  .summoner {
    .summonerGrid {
      background-color: #111;
      display: grid;
      gap: 20px;
      grid-template-columns: 150px 1fr;
      .summonerImg {
        img {
          width: 150px;
        }
        /* p {
        font-weight: 600;
        font-size: 20px;
        background-color: #000;
        padding: 5px 10px;
        border-radius: 100%;
        bottom: 0px;
        left: 0px;
        position: absolute;
      } */
      }
      .summonerInfo {
        justify-self: center;
        text-align: center;
        .champs {
          display: flex;
          gap: 20px;
          .champInfo {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            img {
              margin: 10px 0;
              height: 50px;
            }
          }
        }
      }
    }
    .footer {
      background-color: #111;
      padding: 15px;
      display: flex;
      justify-content: space-evenly;
    }
  }
  .history {
    h2 {
      margin-bottom: 20px;
    }
    margin: 0 auto;
    width: 600px;
    .historyBox {
      border-top: solid 2px #fff;
      .header {
        display: flex;
        justify-content: space-between;
      }
      .body {
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
          width: 50px;
        }
        a {
          color: #fff;
          text-decoration: none;
        }
      }
    }
  }
`;

const Profile = () => {
  const { region, summonerName } = useParams();

  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [champs, setChamps] = useState([]);

  const getUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await riotAPI.searchSummoner(region, summonerName);
      console.log(response);
      setUserData(response);
    } catch (err) {
      setError("Error al buscar al usuario.");
    } finally {
      setLoading(false);
    }
  };

  const fetchChamps = async () => {
    const arrJson = await fetch("/champions.json");
    const jsonData = await arrJson.json();
    setChamps(jsonData);
  };

  const searchChamp = (champId) => {
    return champs.find((e) => e.key === champId.toString());
  };

  function getTimeAgo(gameCreation) {
    const now = new Date();
    const gameDate = new Date(gameCreation);
    const timeDifference = now - gameDate;
    const seconds = timeDifference / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const months = days / 30;

    if (months >= 1) {
      return `${Math.floor(months)} month${
        Math.floor(months) > 1 ? "s" : ""
      } ago`;
    } else if (days >= 1) {
      return `${Math.floor(days)} day${Math.floor(days) > 1 ? "s" : ""} ago`;
    } else if (hours >= 1) {
      return `${Math.floor(hours)} hour${Math.floor(hours) > 1 ? "s" : ""} ago`;
    } else {
      return `${Math.floor(minutes)} minute${
        Math.floor(minutes) > 1 ? "s" : ""
      } ago`;
    }
  }

  useEffect(() => {
    getUserData();
    fetchChamps();
  }, []);

  if (userData.length === 0) {
    <Main>
      <p>Loading...</p>
    </Main>;
  }

  return (
    <Main>
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      {userData && (
        <React.Fragment>
          <section className="summoner">
            <article className="summonerGrid">
              <div className="summonerImg">
                <img src={userData.profileIconUrl} alt="summonerImg" />
              </div>
              <div className="summonerInfo">
                <h3>{userData.name}</h3>
                <div className="champs">
                  {userData.masteries.slice(0, 3).map((e) => (
                    <div key={e.championId} className="champInfo">
                      <p>{searchChamp(e.championId).name}</p>
                      <img src={`/m${e.championLevel}.webp`} />
                      <p> {e.championPoints}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
            <article className="footer">
              <h3 className="level">LVL {userData.summonerLevel}</h3>
              {userData.league.map((e) => (
                <p key={e.legueId}>
                  {e.queueType.replaceAll("_", " ").split(" ")[1]} {e.tier}{" "}
                  {e.rank} {e.leaguePoints} LP - {e.wins} W {e.losses} L{" "}
                </p>
              ))}
            </article>
          </section>
          <section className="history">
            <h2>History</h2>
            {userData.matchlist.map((e, i) => {
              const summonerObj = e.info.participants.find(
                (e) => e.summonerName === userData.name
              );
              return (
                <div className="historyBox" key={i}>
                  <div className="header">
                    <h4>{summonerObj.win ? "Victory" : "Defeat"}</h4>
                    <p>{getTimeAgo(e.info.gameCreation)}</p>
                    <p>
                      {" "}
                      {Math.floor(e.info.gameDuration / 60)}:
                      {e.info.gameDuration -
                        Math.floor(e.info.gameDuration / 60) * 60}
                    </p>
                  </div>
                  <div className="body">
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/13.21.1/img/champion/${summonerObj.championName}.png`}
                      alt={summonerObj.championName}
                    />
                    <p>
                      {summonerObj.kills} / {summonerObj.deaths} /{" "}
                      {summonerObj.assists}
                    </p>
                    <Link to={`/match/${e.info.platformId}_${e.info.gameId}`}>
                      See more
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        </React.Fragment>
      )}
    </Main>
  );
};

export default Profile;
