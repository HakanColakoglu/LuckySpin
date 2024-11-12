type GameCardProps = {
  onClick?: () => void;
  imageSrc?: string
};

const GameCard = ({ onClick, imageSrc }: GameCardProps) => (
  <div className="game-card" onClick={onClick}>
    <img className='full-image' src={imageSrc}></img>
  </div>
);

export default GameCard;
