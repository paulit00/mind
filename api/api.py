import time
from flask import Flask
from flask_socketio import SocketIO, join_room, leave_room, send
from flask_cors import CORS

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
    send("message", data)


@socketio.on("join")
def on_join(data):
    username = data["username"]
    room = data["room"]
    join_room(room)
    send(username + " has entered the room.", to=room)


@socketio.on("leave")
def on_leave(data):
    username = data["username"]
    room = data["room"]
    leave_room(room)
    send(username + " has left the room.", to=room)
