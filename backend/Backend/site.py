from flask import Flask, request, jsonify
from flask_cors import CORS
from googlesearch import search
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)  # Allow all origins

@app.route("/search", methods=["GET"])
def google_search():
    query = request.args.get("q", "").strip()
    query=query+" interview experience"
    print("console output:", query)

    # Validate input
    if not query:
        return jsonify({"error": "Missing search query. Please provide ?q=<your search term>"}), 400
    if len(query) < 2:
        return jsonify({"error": "Search query too short. Please provide at least 2 characters."}), 400

    results = []

    try:
        print("Searching for:", query)

        try:
            urls = list(search(query))
        except Exception as e:
            print("Error during Google search:", e)
            return jsonify({"error": "Failed to query Google search", "details": str(e)}), 500

        if not urls:
            return jsonify({"query": query, "results": [], "message": "No search results found"}), 200

        for url in urls:
            try:
                r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=5)
                soup = BeautifulSoup(r.text, "html.parser")
                title = soup.title.string.strip() if soup.title else "No title found"
                results.append({"title": title, "link": url})
            except Exception as e:
                results.append({"title": "[Error fetching title]", "link": url, "error": str(e)})

        return jsonify({"query": query, "results": results}), 200

    except Exception as e:
        print("General backend error:", e)
        return jsonify({"error": "Unexpected backend error", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8383)
