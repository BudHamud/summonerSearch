import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import riotAPI from "../api/riotAPI";

const Main = styled.main`
  display: flex;
  justify-content: center;
  .match {
    width: 800px;
    .team {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      .champField {
        justify-self: center;
        text-align: center;
        font-size: 16px;
        img {
          width: 50px;
        }
      }
    }
  }
`;

const Game = () => {
  const { matchId } = useParams();

  const [game, setGame] = useState([]);

  const getGame = async () => {
    const response = await riotAPI.searchGame(matchId.toString());
    console.log(response);
    setGame(response);
  };

  useEffect(() => {
    getGame();
  }, []);

  if (game.length === 0) {
    return <Main>Cargando...</Main>;
  }

  return (
    <Main>
      <section className="match">
        <h3>{game.info.participants[0].win ? "Victory" : "Defeat"}</h3>
        <article className="team">
          {game.info.participants.slice(0, 5).map((e, i) => (
            <div className="champField" key={i}>
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/13.21.1/img/champion/${e.championName}.png`}
                alt={e.championName}
              />
              <p>{e.summonerName}</p>
              <p>
                {e.kills} / {e.deaths} / {e.assists}
              </p>
            </div>
          ))}
        </article>
        <h3>{game.info.participants[5].win ? "Victory" : "Defeat"}</h3>
        <article className="team">
          {game.info.participants.slice(5, 10).map((e, i) => (
            <div className="champField" key={i}>
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/13.21.1/img/champion/${e.championName}.png`}
                alt={e.championName}
              />
              <p>{e.summonerName}</p>
              <p>
                {e.kills} / {e.deaths} / {e.assists}
              </p>
            </div>
          ))}
        </article>
      </section>
    </Main>
  );
};

export default Game;
