import time
from flask import Flask
from flask_socketio import SocketIO, join_room, leave_room, send, rooms
from flask_cors import CORS
import random
import json

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
cors = CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")


if __name__ == "__main__":
    socketio.run(app)


@app.route("/time")
def get_current_time():
    return {"time": time.time()}


@socketio.on("message")
def handle_message(data):
    print("received message: " + str(data))
    send("message")


@socketio.on("leave")
def on_leave(data):
    username = data["username"]
    room = data["room"]
    leave_room(room)
    send(username + " has left the room.", to=room)


@socketio.on("join")
def on_join(data):
    player_data = json.loads(data["player"])

    player_name = player_data["name"]
    player_id = player_data["id"]
    player_hand = player_data["hand"]

    player = Player(player_name, player_id, player_hand)

    room = data["room"]
    join_room(room)

    print(
        f"{player.name} prisijunge prie kambario {room}, dabar prisijunge {len(socketio.server.manager.rooms(room))}"
    )
    socketio.emit("joined", {"name": player.name, "room": room}, room=room)


class Card:
    def __init__(self, value):
        self.value = value


class Player:
    def __init__(self, name, id, hand):
        self.name = name
        self.id = id
        self.hand = hand

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


class Deck:
    def __init__(self):
        self.cards = [Card(i) for i in range(1, 101)]
        random.shuffle(self.cards)

    def draw(self):
        return self.cards.pop()


class Game:
    def __init__(self, num_players=2, num_lives=2, shuriken=1):
        self.num_players = num_players
        self.players = []
        self.deck = Deck()
        self.round_num = 1
        self.num_lives = 5  # num_players
        self.current_cards = []
        self.shuriken = shuriken

    @socketio.on("start_game")
    def play(self):
        while any(self.players) & (
            self.num_lives > 0
        ):  # Continue until all players have no cards left
            print(f"\n--- Roundas {self.round_num} ---")
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
            elif self.round_num % 3 == 0:
                self.num_lives = self.num_lives + 1

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
                                    # for player in self.players:
                                    #     if player.hand:
                                    #         index_list = []
                                    #         for id, korta in enumerate([card.value for card in player.hand], start=0):
                                    #             if korta < int(card_to_play.value):
                                    #                 index_list.append(id)
                                    #         index_list.sort(reverse=True)
                                    #         for id in index_list:
                                    #             self.current_cards.append(player.hand[id])
                                    #             player.hand.remove(player.hand[id])
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
