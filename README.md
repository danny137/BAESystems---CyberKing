# CyberKing Challenge by BAE Systems

This is my entry for the CyberKing challenge by BAE Systems. The code can be run in Python (written with 3.11 environment) and Node.js.

## Python

To use Python, it uses `mitmproxy` and `selenium-wire` to intercept the request made to the challenge-answer API and modify it to send the completed answer before actually collecting each item. I had to use a proxy due to `pyppeteers` limitations as it does not have the required `page.route` function.

### Installation

```bash
pip install -r requirements.txt
```

**Note:** You need to go into `main.py` and add your local IP address.

### Usage

```bash
python main.py
```

## Node.js

I did not have this problem with Node.js. This only uses `puppeteer`.

### Installation

```bash
npm i puppeteer
```

### Usage

```bash
node js/main.js
```

After setting up, simply speak to the genie and collect an item!
