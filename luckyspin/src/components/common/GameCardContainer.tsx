import { ReactNode } from "react";

type GameCardContainerProps = {
  children: ReactNode;
};

const GameCardContainer = ({ children }: GameCardContainerProps) => (
  <div className="game-card-container">{children}</div>
);

export default GameCardContainer;
