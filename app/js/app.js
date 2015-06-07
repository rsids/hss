(function () {
    'use strict';

    var serverUrl,
        socketUrl,
        socket,
        channels = {},
        clientId = null;

    init();

    function init() {
        loadSettings();

        $('.sounds-list').on('click', '.sound', onSoundClick);
        $('.server-btn').on('click', registerServer);
    }

    function loadSettings() {
        $.getJSON('settings.json',null, function(data) {
            serverUrl = 'http://' + data.server + '/hss/';
            socketUrl  = 'ws://' + data.server + ':' + data.port + '/socket/hssSocket.php';
            loadSocket();
            loadSounds();
        });

    }

    function loadSocket() {
        if(socket)
            socket.close();

        try {
            socket = new WebSocket(socketUrl);
            socket.onopen = function(msg) {
                socket.send(JSON.stringify({action:'registerClient'}));
                console.log('Socket opened ', msg)
            };

            socket.onmessage = function(msg) {
                var data = JSON.parse(msg.data);

                switch(data.msg) {
                    case 'clientRegistered':
                        clientId = data.data;
                        break;
                    case 'playSound':
                        playSound(data.data, data.clientId);
                        break;

                }
            };

        } catch (ex) {
            console.log("exception", ex);
        }
    }

    function loadSounds() {
        var source = $('#sound-tpl').html();
        var template = Handlebars.compile(source),
            holder = $('.sounds-list');

        $.ajax(serverUrl + 'getSounds.php').success(function(data) {
            $(data.result).each(function(i, item) {
                var context = {title: item[1], filename: item[0]};
                item = template(context);
                holder.append(item);
            });
        });
    }

    function onSoundClick(evt) {
        var url = $(evt.currentTarget).attr('data-name');
        console.log("Send playsound: " + url);
        socket.send(JSON.stringify({action: 'playSound', data: url, clientId: clientId}));
    }

    function playSound(file, channel) {
        if(!channels.hasOwnProperty(channel)) {
            channels[channel] = new Audio();
        }

        channels[channel].src = '/hss' + file + '.mp3';
        channels[channel].volume = 1;
        channels[channel].play();
    }

    function registerServer() {
        if($('.server-btn').hasClass('active')) {
            socket.send(JSON.stringify({action:'disconnectServer'}));
        } else {
            socket.send(JSON.stringify({action:'registerServer'}));

        }
        $('.server-btn').toggleClass('active');
    }
}());