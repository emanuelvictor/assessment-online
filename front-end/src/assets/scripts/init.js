var TOKEN_NAME = 'assessment-token';
var UNIDADE_ID = 'unidadeId';
var END_POINT = 'https://assessment-online.com.br/sistema/mobile/';

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

    window['cookieEmperor'].getCookie(END_POINT, TOKEN_NAME, function (data) {
      localStorage.setItem(TOKEN_NAME, data.cookieValue);
      console.log('token em cookies ', data.cookieValue);
      console.log('token em localstorage ', localStorage.getItem(TOKEN_NAME));
    }, function (error) {
      if (error) {
        console.log('error: ' + error);
      }
    });

    document.addEventListener('backbutton', function (e) {
      e.preventDefault()
    }, false);

    document.addEventListener("backbutton", onBackKeyDown, false);

    function onBackKeyDown() {
      if (window.location.hash === '#/authentication')
        window['KioskPlugin'].exitKiosk();

      else if (window.location.hash === '#/avaliar' || window.location.hash === '#/selecionar-unidade') {
        if (localStorage.getItem(UNIDADE_ID) != null)
          navigator.notification.prompt(
            'Insira uma senha administrativa para sair do aplicativo.',  // message
            onPrompt,                  // callback to invoke
            'Sair do aplicativo',            // title
            ['Ok', 'Cancelar']              // buttonLabels
          );
        else
          logout();
      }
    }

    function onPrompt(results) {

      var xmlhttpAuthenticate = new XMLHttpRequest();
      var authenticateUrl = END_POINT + 'unidades/authenticate/' + localStorage.getItem(UNIDADE_ID) + '?password=' + results.input1;

      xmlhttpAuthenticate.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {

          logout()

        } else if (this.readyState > 3 && results.input1 !== null && results.input1.length) {
          window.plugins.toast.showWithOptions(
            {
              message: "Senha incorreta",
              duration: "long", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
              position: "bottom",
              addPixelsY: -40  // added a negative value to move it up a bit (default 0)
            }
          );
        }
      };

      xmlhttpAuthenticate.open("GET", authenticateUrl, true);
      xmlhttpAuthenticate.send();

    }

    function logout() {
      var xmlhttpLogout = new XMLHttpRequest();
      var logoutUrl = END_POINT + 'logout';

      xmlhttpLogout.onreadystatechange = function () {
        localStorage.removeItem(TOKEN_NAME);
        localStorage.removeItem(UNIDADE_ID);

        window['cookieEmperor'].clearAll(
          function () {
            console.log('Cookies have been cleared');
          },
          function () {
            console.log('Cookies could not be cleared');
          });

        // window['KioskPlugin'].exitKiosk();

        // navigator.app.exitApp();

        window.location.href = 'file:///android_asset/www/index.html';

      };

      xmlhttpLogout.open("GET", logoutUrl, true);
      xmlhttpLogout.send();
    }

  }
};

app.initialize();