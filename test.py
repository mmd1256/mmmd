# app.py (using Flask)
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

messages = []

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('message')
def handle_message(data):
    message = {
        'user': data['user'],
        'content': data['content'],
        'timestamp': data['timestamp']
    }
    messages.append(message)
    emit('message', message, broadcast=True)

@app.route('/messages', methods=['GET'])
def get_messages():
    return jsonify(messages)

if __name__ == '__main__':
    socketio.run(app, debug=True)
# database.py
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['messenger']
messages_collection = db['messages']

def save_message(message):
    return messages_collection.insert_one(message)

def get_all_messages():
    return list(messages_collection.find({}, {'_id': 0}))
