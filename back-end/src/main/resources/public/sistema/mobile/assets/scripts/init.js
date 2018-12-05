var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');

    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log('Received Event: ' + id);
        window.plugins.insomnia.keepAwake();
        window['KioskPlugin'].setAllowedKeys([0x4]);

        document.addEventListener('backbutton', function () {

            if (window.location.hash === '#/authentication')
                window['KioskPlugin'].exitKiosk();

            else if (window.location.hash === '#/avaliar' || window.location.hash === '#/selecionar-unidade')
                window.location.hash = '#/logout';

            else if (window.location.hash === '#/logout')
                window.location.hash = '#/avaliar';

            else if (window.location.hash === '#/selecionar-atendentes')
                window.location.hash = '#/avaliar';

        }, false);


    }
};

app.initialize();