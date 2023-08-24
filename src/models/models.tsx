class Player {
  id: string = "";
  name: string = "";
  hand: Card[] = [];
}
class Card {
  value: number = 0;
}

class Game {
  room: string = "";
  num_players: number = 2;
  players: Player[] = [];
  deck: Card[] = [];
  round_num: number = 0;
  num_lives: number = 0;
  current_cards: Card[] = [];
  shuriken: number = 0;
  all_dealt_cards: number[] = [];
  game_started: boolean = false;
}

export type { Card };
export { Player, Game };
