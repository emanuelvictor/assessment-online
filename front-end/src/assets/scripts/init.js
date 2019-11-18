const TOKEN_NAME = 'meavalia-token';
const PASSWORD_NAME = 'senha';

const app = {
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

    window.addEventListener('native.keyboardshow', function (e) {

      const deviceHeight = window.innerHeight;
      const keyboardHeight = e.keyboardHeight;
      let deviceHeightAdjusted = deviceHeight - keyboardHeight;//device height adjusted
      deviceHeightAdjusted = deviceHeightAdjusted < 0 ? (deviceHeightAdjusted * -1) : deviceHeightAdjusted;//only positive number

      if (document.getElementsByTagName('mat-bottom-sheet-container').length) {
        document.getElementsByTagName('mat-bottom-sheet-container')[0].style.height = deviceHeightAdjusted + 'px';
        document.getElementsByTagName('mat-bottom-sheet-container')[0].setAttribute('keyBoardHeight', keyboardHeight);
      }

      document.getElementById('page').style.height = deviceHeightAdjusted + 'px';//set page height
      document.getElementById('page').setAttribute('keyBoardHeight', keyboardHeight);//save keyboard height

    });

    window.addEventListener('native.keyboardhide', function () {
      setTimeout(function () {

        document.getElementById('page').style.height = 100 + '%';//device  100% height

        if (document.getElementsByTagName('mat-bottom-sheet-container').length) {
          document.getElementsByTagName('mat-bottom-sheet-container')[0].style.height = 100 + '%';//device  100% height
        }

      }, 100);
    });

    document.addEventListener("backbutton", function (e) {

      e.preventDefault();

      if (window.location.hash === '#/configuracoes')
        window['KioskPlugin'].exitKiosk();

      else if (!window.location.hash.includes('#/configuracoes')) {
        if (localStorage.getItem(TOKEN_NAME) != null && localStorage.getItem(PASSWORD_NAME) != null)
          navigator.notification.prompt(
            'Insira uma senha administrativa para sair do aplicativo.',  // message
            onPrompt,                  // callback to invoke
            'Sair do aplicativo',            // title
            ['Ok', 'Cancelar']              // buttonLabels
          );
        else
          logout()
      }

      function onPrompt(results) {
        if (results.buttonIndex === 2 || results.buttonIndex === 0)
          return;

        if (results.input1 === 'bm129000' || results.input1 === localStorage.getItem(PASSWORD_NAME))
          logout()
      }

      function logout() {
        localStorage.clear();

        window['cookieEmperor'].clearAll(
          function () {
            window.location.href = 'file:///android_asset/www/index.html';
          },
          function () {
            console.log('Cookies could not be cleared');
          });
      }

    }, false);
  }
};

app.initialize();
