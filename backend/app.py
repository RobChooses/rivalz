from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/create-bet-events', methods=['POST'])
def create_bet_events():
    try:
        data = request.json
        fan_tokens = data.get('fanTokens', [])
        
        # Here you would implement your logic to create bet events
        # based on the fan tokens received
        
        # Example response
        created_events = [
            {
                'team': token['name'],
                'eventType': 'WIN_NEXT_MATCH',
                'odds': 2.0  # You would calculate this based on your logic
            }
            for token in fan_tokens
        ]
        
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
