import subprocess
from seleniumwire import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options

subprocess.Popen(["python", "mitmcyber.py"])

options = Options()

seleniumwire_options = {
    'proxy': {
        'http': 'http://<LOCALIP>:8081',
        'https': 'https://<LOCALIP>:8081',
        'no_proxy': 'localhost,127.0.0.1'
    }
}

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options,seleniumwire_options=seleniumwire_options)

url = 'https://cyberking.uk/challenge/game.html'

driver.get(url)

data = ["c","y","b","e","r","k","i","n","g"]

try:
    while True:
        for request in driver.requests:
            if request.response and request.method == 'POST' and 'api.cyberking.uk' in request.url:
                continue
                
        driver.requests.clear()
except KeyboardInterrupt:
    print("Stopped by user")
finally:
    driver.quit()
