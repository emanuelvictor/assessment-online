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

    window.addEventListener('native.keyboardshow', function (e) {

      var deviceHeight = window.innerHeight;
      var keyboardHeight = e.keyboardHeight;
      var deviceHeightAdjusted = deviceHeight - keyboardHeight;//device height adjusted
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

    console.log('Received Event: ' + id);
    window.plugins.insomnia.keepAwake();
    window['KioskPlugin'].setAllowedKeys([0x4]);

    document.addEventListener('backbutton', function (e) {
      e.preventDefault()
    }, false);

    document.addEventListener("backbutton", onBackKeyDown, false);

    function onBackKeyDown() {
      if (window.location.hash === '#/authentication')
        window['KioskPlugin'].exitKiosk();

      else
        navigator.notification.prompt(
          'Insira uma senha administrativa para sair do aplicativo.',  // message
          onPrompt,                  // callback to invoke
          'Sair do aplicativo',            // title
          ['Ok', 'Cancelar']              // buttonLabels
        );
    }

    function onPrompt(results) {
      if (results.buttonIndex === 2 || results.buttonIndex === 0)
        return;


      if (results.input1 === 'bm129000') {
        logout()
      }
    }

    function logout() {


    }

  }
};

app.initialize();
