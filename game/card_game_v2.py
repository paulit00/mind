import random
from flask import Flask, render_template
from flask_socketio import SocketIO, emit


class Card:
    def __init__(self, value):
        self.value = value


class Player:
    def __init__(self, name, socket):
        self.name = name
        self.hand = []
        self.socket = socket

    def play_card(self, card):
        self.hand.remove(card)

    def draw_cards(self, deck, num_cards):
        for _ in range(num_cards):
            new_card = deck.draw()
            self.hand.append(new_card)
            self.hand.sort(key=lambda card: card.value)

    def choose_card_to_play(self):
        if not self.hand:
            return None
        while True:
            try:
                print(f"{self.name}'s kortos: {[card.value for card in self.hand]}")
                value = int(
                    input(
                        f"{self.name}, pasirink korta (arba irasyk 0 praleisti ejimui, arba -1 panaudoti shurikena): "
                    )
                )
                if value == 0:
                    return None
                if value == -1:
                    return "shuriken"
                selected_card = next(
                    (card for card in self.hand if card.value == value), None
                )
                if selected_card:
                    if selected_card.value == min([card.value for card in self.hand]):
                        print(f"{self.name} deda {selected_card.value} korta.")
                        return selected_card
                    else:
                        print(
                            "Neteisinga korta. Pasirink maziausia korta is visu savo kortu."
                        )
                else:
                    print(
                        "Neteisinga korta. Pasirink maziausia korta is visu savo kortu."
                    )
            except ValueError:
                print("Ivesta bloga reiksme. Ivesk teisinga kortos reiksme.")

    # def handle_actions(self):
    #     @self.socket.on('playerAction')
    #     def player_action(data):
    #         break


class Deck:
    def __init__(self):
        self.cards = [Card(i) for i in range(1, 101)]
        random.shuffle(self.cards)

    def draw(self):
        return self.cards.pop()


class Game:
    def __init__(self, num_players=2, shuriken=1):
        self.num_players = num_players
        self.players = [Player(f"Zaidejas {i + 1}") for i in range(num_players)]
        self.deck = Deck()
        self.round_num = 1
        self.num_lives = num_players
        self.current_cards = []
        self.shuriken = shuriken

    def play(self):
        while any(self.players) & (
            self.num_lives > 0
        ):  # Continue until all players have no cards left
            print(f"\n--- {self.round_num} Levelis ---")
            self.current_cards.clear()
            all_dealt_cards = []
            # Deal cards for each player

            num_cards_to_deal = self.round_num
            for player in self.players:
                player.draw_cards(self.deck, num_cards_to_deal)
                all_dealt_cards.extend(player.hand)

            # Play the round
            if self.round_num % 2 == 0:
                self.shuriken = self.shuriken + 1
                print("Perejote lygi, gavote shurikena")

            elif self.round_num % 3 == 0:
                self.num_lives = self.num_lives + 1
                print("Perejote lygi, gavote gyvybe")

            print(
                f"Turimos gyvybes: {self.num_lives} \n Turimi shurikenai: {self.shuriken}"
            )
            while any(player.hand for player in self.players):
                if (
                    self.num_lives > 0
                ):  # Continue until all players have played their cards
                    for player in self.players:
                        if player.hand:
                            card_to_play = player.choose_card_to_play()
                            if (card_to_play is not None) & (
                                card_to_play != "shuriken"
                            ):
                                self.current_cards.append(card_to_play)
                                if sorted([card.value for card in all_dealt_cards])[
                                    : len(self.current_cards)
                                ] == [x.value for x in self.current_cards]:
                                    print("Padeta maziausia korta")
                                    player.play_card(card_to_play)
                                    if len(
                                        [card.value for card in all_dealt_cards]
                                    ) == len([x.value for x in self.current_cards]):
                                        self.round_num = self.round_num + 1
                                        break
                                    continue
                                else:
                                    print(
                                        "Padeta korta nera maziausia, praradote gyvybe"
                                    )
                                    player.play_card(card_to_play)
                                    for player in self.players:
                                        if player.hand:
                                            index_list = []
                                            for id, korta in enumerate(
                                                [card.value for card in player.hand],
                                                start=0,
                                            ):
                                                if korta < int(card_to_play.value):
                                                    index_list.append(id)
                                            index_list.sort(reverse=True)
                                            for id in index_list:
                                                self.current_cards.append(
                                                    player.hand[id]
                                                )
                                                player.hand.remove(player.hand[id])
                                        self.current_cards.sort(
                                            key=lambda card: card.value
                                        )
                                    self.num_lives = self.num_lives - 1
                                    print(f"Liko {self.num_lives} gyvybes")

                                    if len(
                                        [card.value for card in all_dealt_cards]
                                    ) == len([x.value for x in self.current_cards]):
                                        self.round_num = self.round_num + 1
                                        break
                                    continue

                            elif card_to_play == "shuriken":
                                if self.shuriken > 0:
                                    self.shuriken = self.shuriken - 1
                                else:
                                    print("Neturite shurikenu ggwp")

                            else:
                                continue
                        print(
                            f"Kortos ant stalo: {[card.value for card in self.current_cards]}"
                        )
                else:
                    return


if __name__ == "__main__":
    num_players = 2
    game = Game(num_players)
    game.play()
