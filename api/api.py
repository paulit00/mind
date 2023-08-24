import time
from flask import Flask
from flask_socketio import SocketIO, join_room, leave_room, send, rooms
from flask_cors import CORS
import random
import json
from typing import List

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
cors = CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

games = {}
if __name__ == "__main__":
    socketio.run(app)


def get_user_count_in_room(room):
    user_count = 0
    for namespace_data in socketio.server.manager.rooms.values():
        room_data = namespace_data.get(room)
        if room_data is not None:
            user_count += len(room_data)
    return user_count


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

    @socketio.on("choose_card_to_play")
    def choose_card_to_play(self):
        if not self.hand:
            return None
        while True:
            try:
                print(f"{self.name}'s kortos: {[card.value for card in self.hand]}")
                value = min([card.value for card in self.hand])
                selected_card = next(
                    (card for card in self.hand if card.value == value),
                    None,
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
                    print("Neteisinga korta. Pasirink error 2.")
            except ValueError:
                print("Ivesta bloga reiksme. Ivesk teisinga kortos reiksme.")


class Deck:
    def __init__(self):
        self.cards = [Card(i) for i in range(1, 101)]
        random.shuffle(self.cards)

    def draw(self):
        return self.cards.pop()


class Game:
    """zaidimas"""

    def __init__(self, room, num_players=1, num_lives=2, shuriken=1):
        self.room = room
        self.players: List[Player] = []
        self.num_players = len(self.players)
        self.deck = Deck()
        self.round_num = 1
        self.num_lives = len(self.players)
        self.current_cards = []
        self.shuriken = shuriken
        self.game_started = False
        self.all_dealt_cards = []

    def clear(self):
        self.num_players = len(self.players)
        self.deck = Deck()
        self.round_num = 1
        self.num_lives = len(self.players)
        self.current_cards.clear()
        self.shuriken = 1
        self.game_started = False
        self.all_dealt_cards.clear()
        for player in self.players:
            player.hand.clear()

    def get_player_by_id(self, player_id) -> Player:
        for player in self.players:
            if player.id == player_id:
                return player
        return None

    def still_playing(self):  # yra zaideju ir yra gyvybiu
        if any(self.players) & (self.num_lives > 0):
            return True
        else:
            return False

    def cards_in_hand(self):  # yra kortu ir yra gyvybiu
        if any(player.hand for player in self.players) & (self.num_lives > 0):
            return True
        else:
            return False

    def level_complete(self):
        if any(player.hand for player in self.players):
            return False
        else:
            return True

    def lives_shuriken_level(self):
        if (self.round_num - 1) != 0:
            if (self.round_num - 1) % 2 == 0:
                self.shuriken = self.shuriken + 1
            elif (self.round_num - 1) % 3 == 0:
                self.num_lives = self.num_lives + 1
            return self.num_lives, self.shuriken
        else:
            return self.num_lives, self.shuriken

    def play(self):
        """zaisti"""
        # Play the round

        print(f"\n--- {self.round_num} Levelis ---")
        self.current_cards.clear()
        self.all_dealt_cards = []

        self.num_lives, self.shuriken = self.lives_shuriken_level()
        # Deal cards for each player
        num_cards_to_deal = self.round_num
        for player in self.players:
            player.draw_cards(self.deck, num_cards_to_deal)
            self.all_dealt_cards.extend(player.hand)

        print(
            f"Turimos gyvybes: {self.num_lives} \n Turimi shurikenai: {self.shuriken}"
        )
        socketio.emit(
            "game_info", json.dumps(self, default=lambda o: o.__dict__), to=self.room
        )

    @socketio.on("player_play_card")
    def player_play_card(data):
        game = format_game(data)
        player = format_player(data, game)
        print(f"{player.name} deda korta.")

        if game.cards_in_hand():
            card_to_play = player.choose_card_to_play()
            if card_to_play is not None:
                game.current_cards.append(card_to_play)
                if sorted([card.value for card in game.all_dealt_cards])[
                    : len(game.current_cards)
                ] == [x.value for x in game.current_cards]:
                    print("Padeta maziausia korta")
                    player.play_card(card_to_play)
                    if len([card.value for card in game.all_dealt_cards]) == len(
                        [x.value for x in game.current_cards]
                    ):
                        game.round_num = game.round_num + 1
                        print("")
                        socketio.emit(
                            "level_complete",
                            json.dumps(game, default=lambda o: o.__dict__),
                            to=game.room,
                        )
                else:
                    print("Padeta korta nera maziausia, praradote gyvybe")
                    player.play_card(card_to_play)
                    for player in game.players:
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
                                game.current_cards.append(player.hand[id])
                                player.hand.remove(player.hand[id])
                        game.current_cards.sort(key=lambda card: card.value)
                    game.num_lives = game.num_lives - 1
                    print(f"Liko {game.num_lives} gyvybes")
                    if game.num_lives == 0:
                        print("Game over")
                        game = restart_game(game)
                        socketio.emit(
                            "game_info",
                            json.dumps(game, default=lambda o: o.__dict__),
                            to=game.room,
                        )
                    elif len([card.value for card in game.all_dealt_cards]) == len(
                        [x.value for x in game.current_cards]
                    ):
                        game.round_num = game.round_num + 1
                        socketio.emit(
                            "level_complete",
                            json.dumps(game, default=lambda o: o.__dict__),
                            to=game.room,
                        )

        print(f"Kortos ant stalo: {[card.value for card in game.current_cards]}")
        socketio.emit(
            "game_info", json.dumps(game, default=lambda o: o.__dict__), to=game.room
        )


@socketio.on("play_shuriken")
def play_shuriken(data):
    game = format_game(data)
    print("certified shurken moment")
    if game.shuriken > 0:
        game.shuriken = game.shuriken - 1
        kortu_list = []
        for player in game.players:
            if player.hand:
                kortu_list.append(min([card.value for card in player.hand]))
        for player in game.players:
            if player.hand:
                index_list = []
                for id, korta in enumerate(
                    [card.value for card in player.hand], start=0
                ):
                    if korta <= max(kortu_list):
                        index_list.append(id)
                index_list.sort(reverse=True)
                for id in index_list:
                    game.current_cards.append(player.hand[id])
                    player.hand.remove(player.hand[id])
            game.current_cards.sort(key=lambda card: card.value)
        socketio.emit(
            "game_info", json.dumps(game, default=lambda o: o.__dict__), to=game.room
        )
        if game.level_complete():
            game.round_num = game.round_num + 1
            socketio.emit(
                "level_complete",
                json.dumps(game, default=lambda o: o.__dict__),
                to=game.room,
            )
    else:
        print("Neturite shurikenu ggwp")


# format data to player object
def format_player(data, game: Game) -> Player:
    player_data = json.loads(data["player"])
    player_id = player_data["id"]
    print(f"Player id: {player_id}")
    player = game.get_player_by_id(player_id)
    return player


def format_game(data) -> Game:
    room = data["room"]
    game = get_game(room)
    return game


def restart_game(game: Game) -> Game:
    game.clear()
    return game


def create_new_game(room, player: Player) -> Game:
    game = Game(room)
    game.players.append(player)
    game.num_players = len(game.players)
    game.num_lives = game.num_players
    games[room] = game
    return game


def get_game(room) -> Game:
    return games.get(room)


def join_game(game: Game, player: Player) -> Game:
    game.players.append(player)
    game.num_players = len(game.players)
    game.num_lives = game.num_players
    return game


def leave_game(game: Game, player: Player) -> Game:
    game.players.remove(player)
    game.num_players = len(game.players)
    return game


@socketio.on("start_next_level")
def start_next_level(data):
    game = format_game(data)
    game.play()
    socketio.emit("hide_next_level_button", room=game.room, to=game.room)


def delete_game(room):
    del games[room]


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
    user_count = get_user_count_in_room(room)
    if user_count == 1:
        game = create_new_game(room, player)
        print(f"Player in game: {game.players[0].name}")
        print(f"{player.name} sukure kambari {room}")
    else:
        existing_game = get_game(room)
        if existing_game:
            join_game(existing_game, player)
            print(f"{player.name} joined an existing game in room {room}")
            socketio.emit("ready_to_start", {"room": room}, room=room, to=room)
        else:
            print(f"No existing game found for room {room}")
    print(
        f"{player.name} prisijunge prie kambario {room}, dabar prisijunge {user_count}"
    )
    socketio.emit("joined", {"name": player.name, "room": room}, room=room, to=room)


@socketio.on("start_game")
def start_game(data):
    room = data["room"]
    print(f"kambarys {room}")
    game_to_play = get_game(room)
    game_to_play.game_started = True
    print(f"Pradedamas zaidimas {game_to_play.num_players}")
    game_to_play.play()


if __name__ == "__main__":
    num_players = 2
    game = Game(num_players)
    game.play()
