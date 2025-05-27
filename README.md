<div align="center" style="display: flex; justify-content: center; align-items: center; text-align: center;">
  <a href="https://github.com/binomial14/SoundNarratives" style="margin-right: 20px; text-decoration: none; display: flex; align-items: center;">
    <img src="frontend/public/soundnarratives.ico" alt="SoundNarratives" width="120">
  </a>
</div>

<div align="center" style="display: flex; justify-content: center; align-items: center; text-align: center;">
    <h2>
    SoundNarratives: Rich Auditory Scene Descriptions to Support Deaf and Hard of Hearing People
    </h2>
</div>

## Frontend

Start UI

```bash
npm install
# npm start
HTTPS=true SSL_CRT_FILE=../cert.pem SSL_KEY_FILE=../key.pem PORT=2000 npm start
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
cd backend
python server.py
```


## Trouble shooting

- Use incognito mode

## iPad settings

- [Guided Access](https://www.lifewire.com/prevent-someone-from-exiting-an-ipad-app-4103777)
- Remember to reload both pages right before you click the start button
