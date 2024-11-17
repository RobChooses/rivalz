from flask import Flask, request, jsonify
from flask_cors import CORS
from bet_events_generator import generate_bet_events

app = Flask(__name__)
CORS(app)

@app.route('/api/create-bet-events', methods=['POST'])
def create_bet_events():
    try:
        # Ensure content type is application/json
        if not request.is_json:
            return jsonify({
                'success': False,
                'error': 'Content-Type must be application/json'
            }), 415

        # Get JSON body
        body = request.get_json()
        
        # Extract fields from body
        description = body.get('description')
        token_name = body.get('tokenName')

        # Validate required fields
        if not description:
            return jsonify({
                'success': False,
                'error': 'Missing required field: description'
            }), 400
            
        if not token_name:
            return jsonify({
                'success': False,
                'error': 'Missing required field: tokenName'
            }), 400

        # Log the received request
        print(f"Processing bet event:")
        print(f"Token Name: {token_name}")
        print(f"Description: {description}")

        # Generate bet events
        created_events = generate_bet_events(description, token_name)

        # Log the generated events
        print(f"Generated events: {created_events}")

        return jsonify({
            'success': True,
            'events': created_events
        })

    except Exception as e:
        print(f"Error processing bet event: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
