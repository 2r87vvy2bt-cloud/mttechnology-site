#!/usr/bin/env python3
"""
Feedback service — replaces the .NET FeedbackMailSenderService.
Accepts: POST /client  { name, email, phone?, description, source }
Sends email via Namecheap Private Email SMTP.
"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import threading
import time
from collections import defaultdict, deque
from flask import Flask, request, jsonify
import logging
import crm

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

SMTP_HOST     = os.getenv("Email__Smtp__Host",     "mail.privateemail.com")
SMTP_PORT     = int(os.getenv("Email__Smtp__Port",  "465"))
SMTP_LOGIN    = os.getenv("Email__Smtp__Login",     "info@mttechnology.eu")
SMTP_PASSWORD = os.getenv("Email__Smtp__Password",  "")
FROM_EMAIL    = os.getenv("Email__SenderEmail",     "info@mttechnology.eu")
TO_EMAIL      = os.getenv("Email__RecipientEmail",  "info@mttechnology.eu")


def send_email(name: str, email: str, phone: str, description: str, source: str):
    msg = MIMEMultipart()
    msg["Subject"] = f"New order request — {name}"
    msg["From"]    = FROM_EMAIL
    msg["To"]      = TO_EMAIL
    msg["Reply-To"] = email

    body = f"""New order request from the website.

Name:        {name}
Email:       {email}
Phone:       {phone or '—'}
Source:      {source}
Description: {description or '—'}
"""
    msg.attach(MIMEText(body, "plain"))

    if SMTP_PORT == 465:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=10) as s:
            s.login(SMTP_LOGIN, SMTP_PASSWORD)
            s.sendmail(FROM_EMAIL, TO_EMAIL, msg.as_string())
    else:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as s:
            s.starttls()
            s.login(SMTP_LOGIN, SMTP_PASSWORD)
            s.sendmail(FROM_EMAIL, TO_EMAIL, msg.as_string())


RATE_MAX    = int(os.getenv("RATE_MAX", "5"))       # requests
RATE_WINDOW = int(os.getenv("RATE_WINDOW", "600"))  # seconds, per client IP
_hits: dict = defaultdict(deque)
_hits_lock = threading.Lock()


def _client_ip() -> str:
    fwd = request.headers.get("X-Forwarded-For", "")
    return (fwd.split(",")[0].strip() if fwd else request.remote_addr) or "?"


def _rate_limited(ip: str) -> bool:
    now = time.time()
    with _hits_lock:
        q = _hits[ip]
        while q and now - q[0] > RATE_WINDOW:
            q.popleft()
        if len(q) >= RATE_MAX:
            return True
        q.append(now)
        return False


@app.route("/client", methods=["POST"])
def client():
    data = request.get_json(silent=True) or {}

    # Honeypot: real users never fill the hidden "website" field.
    if (data.get("website") or "").strip():
        return "", 200

    if _rate_limited(_client_ip()):
        return jsonify({"title": "Too many requests", "status": 429}), 429

    for k, lim in (("name", 200), ("email", 200), ("phone", 60), ("source", 300), ("description", 5000)):
        if len(str(data.get(k) or "")) > lim:
            return jsonify({"title": "Field too long", "status": 400, "errors": {k: ["too long"]}}), 400

    name  = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()

    if not name or not email:
        return jsonify({
            "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
            "title": "Validation failed",
            "status": 400,
            "errors": {
                **({"name":  ["Name is required"]}  if not name  else {}),
                **({"email": ["Email is required"]} if not email else {}),
            }
        }), 400

    # CRM forwarding: parallel, best effort; email below is unaffected by CRM failures.
    crm.forward_async(
        name=name, email=email,
        phone=(data.get("phone") or "").strip(),
        description=(data.get("description") or "").strip(),
        page_url=(data.get("page_url") or request.headers.get("Referer") or "").strip()[:500],
        lang=(data.get("lang") or "").strip()[:5],
    )

    try:
        send_email(
            name=name,
            email=email,
            phone=(data.get("phone") or "").strip(),
            description=(data.get("description") or "").strip(),
            source=(data.get("source") or "").strip(),
        )
        return "", 200
    except Exception as e:
        app.logger.error(f"SMTP error: {e}")
        return jsonify({"title": "Failed to send email", "status": 500}), 500


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=False)
