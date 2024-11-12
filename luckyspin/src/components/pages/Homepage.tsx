import { useNavigate } from "react-router-dom";
import GameCardContainer from "../common/GameCardContainer";
import GameCard from "../common/GameCard";
import { useAuth } from "../../context/AuthContext";
import coinGameIcon from "../../assets/game_icon.jpg";
import "./Homepage.css";

const Homepage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  const handlePlayGameClick = () => {
    if (isSignedIn) {
      navigate("/game/coin");
    } else {
      navigate("/signin");
    }
  };

  const alternativeImage1 =
    "https://stcp-media.imgix.net/core-prod/game/lobby/3611/1?fm=webp&h=307&dpr=1.25";
  const alternativeImage2 =
    "https://stcp-media.imgix.net/core-prod/game/lobby/660/1?fm=webp&h=200&dpr=1.25";
  const alternativeImage3 =
    "https://stcp-media.imgix.net/core-prod/game/lobby/715/1?fm=webp&h=307&dpr=1.25";
  const alternativeImage4 =
    "https://stcp-media.imgix.net/core-prod/game/lobby/7336/1?fm=webp&h=200&dpr=1.25";
  return (
    <>
      <div className="homepage-container">
        <GameCardContainer>
          <GameCard onClick={handlePlayGameClick} imageSrc={coinGameIcon} />
          <GameCardContainer>
            <GameCard imageSrc={alternativeImage1} />
            <GameCard imageSrc={alternativeImage2} />
            <GameCard imageSrc={alternativeImage4} />
            <GameCard imageSrc={alternativeImage3} />
          </GameCardContainer>
          <GameCardContainer>
            <GameCard imageSrc={alternativeImage1} />
            <GameCard imageSrc={alternativeImage2} />
            <GameCard imageSrc={alternativeImage3} />
            <GameCard imageSrc={alternativeImage4} />
          </GameCardContainer>
          <GameCard imageSrc={alternativeImage1} />
          {/* Add more GameCards as needed */}
        </GameCardContainer>
      </div>
    </>
  );
};

export default Homepage;
