import random

class TheMindGame:
    def __init__(self, num_players):
        self.num_players = num_players
        self.current_level = 1
        self.deck = list(range(1, 101))
        random.shuffle(self.deck)
        self.player_hands = [[] for _ in range(num_players)]
        
    def deal_initial_cards(self):
        for _ in range(self.current_level):
            for hand in self.player_hands:
                hand.append(self.deck.pop(0))
                
    def play_round(self):
        self.deal_initial_cards()
        
        for level in range(self.current_level):
            plays = []
            for player_idx in range(self.num_players):
                card = self.player_hands[player_idx][level]
                plays.append(card)
                
            plays.sort()
            
            for player_idx in range(self.num_players):
                if plays[player_idx] != self.player_hands[player_idx][level]:
                    print("Game Over! Players failed to play in order.")
                    return False
                    
        self.current_level += 1
        print("Level Cleared!")
        return True

def main():
    num_players = int(input("Enter the number of players: "))
    game = TheMindGame(num_players)
    
    while game.play_round():
        pass
    
if __name__ == "__main__":
    main()