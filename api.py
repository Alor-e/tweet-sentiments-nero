import os
from flask import Flask, jsonify, request, send_from_directory
from text_engine import text_engine
from tweet_engine import tweet_engine
from flask_cors import CORS, cross_origin


app = Flask(__name__, static_folder='app', static_url_path="/app")
# cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/text', methods=['GET'])
def text_response():
    data = request.args.get("name")
    if data and (not data.isspace()):
        output = text_engine(data)
    else:
        output = []

    response = jsonify(output)
    
    return response


@app.route('/api/tweet', methods=['GET'])
def tweet_response():
    data = request.args.get("name")
    if data and (not data.isspace()):
        output = tweet_engine(data)
    else:
        output = ''

    response = jsonify(output)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/text', methods=['GET'])
@cross_origin()
def text_vue():
    return app.send_static_file("text.html")


@app.route('/tweet', methods=['GET'])
def tweet_vue():
    return app.send_static_file("tweet.html")


@app.route('/<path:path>')
def universal_path(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)


@app.route('/', methods=['GET'])
def base():
    return tweet_vue()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))
