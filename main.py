from flask import Flask, render_template
import webbrowser, threading, logging
log = logging.getLogger("werkzeug")
log.setLevel(logging.ERROR)
app = Flask(__name__, template_folder=".", static_folder="static")

print("\nRunning on: http://127.0.0.1:5000\nPress CTRL+C to quit\n")

@app.route("/")
def home():
    return render_template("index.html")

# def open_browser():
#     webbrowser.open("http://127.0.0.1:5000")

if __name__ == '__main__':
    #threading.Timer(1.0, open_browser).start()
    app.run(host="127.0.0.1", port=5000, debug=True)