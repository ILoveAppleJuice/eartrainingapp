from flask import Flask,render_template,jsonify,make_response,redirect


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run("0.0.0.0",port=80,debug=True)