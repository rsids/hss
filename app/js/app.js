(function () {
    'use strict';

    var serverUrl = 'http://hss.nl.dev/hss/',
        socketUrl = 'ws://192.168.178.17:12345/socket/hssSocket.php',
        socket,
        isServer,
        channels = {},
        clientId = null;

    init();

    function init() {
        loadSocket();
        loadSounds();

        $('.sounds-list').on('click', '.sound', onSoundClick);
        $('.server-btn').on('click', registerServer);
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
            holder = $('.sounds-list'),
            item;
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