from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import logging
from dotenv import load_dotenv
from pathlib import Path

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = "supersecret"

# ✅ CORS setup for React dev server
CORS(app, origins=["http://localhost:8080", "http://127.0.0.1:8080"], supports_credentials=True)

# Load .env if it exists
env_path = Path(__file__).resolve().parent / ".env"
if env_path.exists():
    load_dotenv(env_path)
    logging.debug("Loaded .env from %s", env_path)
else:
    logging.debug("No .env found at %s", env_path)


@app.route("/ping")
def ping():
    return jsonify({"message": "pong!"})


# ----------------- Job Search Route (public) -----------------
@app.route("/search", methods=["GET"])
def search_jobs():
    keyword = request.args.get("what", "")
    location = request.args.get("where", "")
    page = request.args.get("page", 1, type=int)

    if not keyword or not location:
        return jsonify({"jobs": [], "message": "Please provide both keyword and location."})

    # Adzuna API credentials
    app_id = os.environ.get("ADZUNA_APP_ID", "1505a86a")
    app_key = os.environ.get("ADZUNA_APP_KEY", "55551f34ce6c2c58076b0f5a86fad370")

    url = f"https://api.adzuna.com/v1/api/jobs/in/search/{page}"

    params = {
        "app_id": app_id,
        "app_key": app_key,
        "results_per_page": 10,
        "what": keyword,
        "where": location,
    }

    logging.debug("Fetching from Adzuna: %s with %s", url, params)

    try:
        resp = requests.get(url, params=params, timeout=10)
        resp.raise_for_status()
        json_data = resp.json()
        jobs = json_data.get("results", [])

        # Clean and only keep required fields
        filtered_jobs = [
            {
                "title": job.get("title", "No Title"),
                "company": job.get("company", {}).get("display_name", "Unknown"),
                "location": job.get("location", {}).get("display_name", "Unknown"),
                "description": job.get("description", "No Description"),
                "redirect_url": job.get("redirect_url", "#"),
            }
            for job in jobs
        ]

        return jsonify({"jobs": filtered_jobs})
    except Exception as e:
        logging.exception("Error fetching jobs from Adzuna")
        return jsonify({"jobs": [], "message": str(e)}), 500


if __name__ == "__main__":
    logging.debug("Registered routes:\n%s", app.url_map)
    app.run(debug=True, host="127.0.0.1", port=5000)