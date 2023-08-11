class Player {
  id: string = "";
  name: string = "";
  hand: number[];
}
class Card {
  value: number = 0;
}

class Game {
  id: string = "";
  num_players: number = 2;
  players: Player[];
  deck: Card[];
  round_num: number = 1;
  num_lives: number = 1;
  current_cards: Card[];
  shuriken: number = 0;
}

export type { Card, Game };
export { Player };
