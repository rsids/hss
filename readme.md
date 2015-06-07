# Hidden Sound System - Websocket version
Plays a sound on the machine indicated as 'server'

## Usage
- Add some mp3 files to app/hss/sounds
- Create a settings.json file, add the host, port and url to the server (see settings.example.json)
- On your server, run php app/hss/socket/hssSocket.php
- Navigate in your browser to /index.html
- On the machine with the speakers, click "I'm server"
- Now, any browser which connects, will send the sounds to the machine with the speakers
