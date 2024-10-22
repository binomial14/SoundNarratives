# README

## Frontend

Start UI

```bash
npm install
# npm start
HTTPS=true SSL_CRT_FILE=../cert.pem SSL_KEY_FILE=../key.pem PORT=443 npm start
```

## Backend

Build python environment:

```bash
python -m venv s2t_env
source s2t_env/bin/activate
pip install -r backend/requirements.txt
```

Start backend

```bash
python backend/server.py
```


## Trouble shooting

- Use incognito mode

## iPad settings

- [Guided Access](https://www.lifewire.com/prevent-someone-from-exiting-an-ipad-app-4103777)
- Remember to reload both pages right before you click the start button
