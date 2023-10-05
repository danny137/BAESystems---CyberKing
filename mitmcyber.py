from mitmproxy import http

def request(flow: http.HTTPFlow) -> None:
    if flow.request.pretty_url == "https://api.cyberking.uk/challenge-answer":
        print("Modifying request")
        flow.request.text = '["c","y","b","e","r","k","i","n","g"]'
        flow.request.headers["Content-Length"] = str(len(flow.request.text))

def start():
    from mitmproxy.tools.main import mitmdump
    mitmdump(['-s', __file__, '-p', '8081'])

if __name__ == "__main__":
    start()
