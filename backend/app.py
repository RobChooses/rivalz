from flask import Flask, request, jsonify
from flask_cors import CORS
from bet_events_generator import generate_bet_events

app = Flask(__name__)
CORS(app)

@app.route('/api/create-bet-events', methods=['POST'])
def create_bet_events():
    try:
        data = request.json
        fan_tokens = data.get('fanTokens', [])
        # Log fan tokens received in request
        print("Received fan tokens for bet event generation:")
        for token in fan_tokens:
            print(f"- {token}")
        # Generate bet events using OpenAI
        created_events = generate_bet_events(fan_tokens)
        
        return jsonify({
            'success': True,
            'events': created_events
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
