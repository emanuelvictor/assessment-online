var TOKEN_NAME = 'ubest-token';
var UNIDADE_ID = 'unidadeId';
var END_POINT = 'https://ubest.com.br/sistema/mobile/';

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

    window.addEventListener('native.keyboardshow', function (e) {

      console.log('native.keyboardshow');
      var deviceHeight = window.innerHeight;
      var keyboardHeight = e.keyboardHeight;
      var deviceHeightAdjusted = deviceHeight - keyboardHeight;//device height adjusted
      deviceHeightAdjusted = deviceHeightAdjusted < 0 ? (deviceHeightAdjusted * -1) : deviceHeightAdjusted;//only positive number

      document.getElementsByTagName('mat-bottom-sheet-container').style.height = deviceHeightAdjusted + 'px';
      document.getElementsByTagName('mat-bottom-sheet-container').setAttribute('keyBoardHeight', keyboardHeight);

      document.getElementById('page').style.height = deviceHeightAdjusted + 'px';//set page height
      document.getElementById('page').setAttribute('keyBoardHeight', keyboardHeight);//save keyboard height

    });

    window.addEventListener('native.keyboardhide', function (e) {
      setTimeout(function () {

        document.getElementById('page').style.height = 100 + '%';//device  100% height
        document.getElementsByTagName('mat-bottom-sheet-container').style.height = 100 + '%';//device  100% height

      }, 100);
    });

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

      else if ((window.location.hash.includes('#/avaliar') && !window.location.hash.includes('selecionar-atendentes')) || window.location.hash === '#/configurar-unidades-e-avaliacoes' || window.location.hash === '#/selecionar-avaliacao') {
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

    function removeHashs() {
      for (var _i = 0; _i < localStorage['hashs.length']; _i++) {
        localStorage.removeItem[_i];
      }

      localStorage.removeItem['hashs.length'];
    }


    function getHashs() {
      var hashs = [];

      for (var _i = 0; _i < window.localStorage['hashs.length']; _i++) {
        hashs.push(window.localStorage[_i])
      }

      return hashs
    }

    function onPrompt(results) {
      if (results.buttonIndex === 2 || results.buttonIndex === 0)
        return;

      window.plugins.toast.showWithOptions(
        {
          message: 'Saindo do aplicativo ... aguarde',
          duration: 'long', // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
          position: 'bottom',
          addPixelsY: -40  // added a negative value to move it up a bit (default 0)
        }
      );

      var bcrypt = window['dcodeIO'].bcrypt;

      // var hash = '$2a$10$Ipj9ID5eqEUELkadTfVqm.2Z42AlAARdihUlQegDBaALlaCh8sqeq';

      // console.log(bcrypt.compareSync("123456", hash));

      var hashs = getHashs();
      if (bcrypt.compareSync(results.input1, '$2a$10$NbtZRkg8a97Ulr6SMYFM/O0tP3eBzwuYdmURSSuoJpjGWw39okuRy')){
        logout();
        return
      }

      for (var i = 0; i < hashs.length; i++) {
        if (bcrypt.compareSync(results.input1, hashs[i])) {
          logout();
          return
        }
      }

      window.plugins.toast.showWithOptions(
        {
          message: "Senha incorreta",
          duration: "long", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
          position: "bottom",
          addPixelsY: -40  // added a negative value to move it up a bit (default 0)
        }
      )

    }

    function logout() {

      localStorage.removeItem(TOKEN_NAME);
      localStorage.removeItem(UNIDADE_ID);
      removeHashs();

      window['cookieEmperor'].clearAll(
        function () {
          window.location.href = 'file:///android_asset/www/index.html';
        },
        function () {
          console.log('Cookies could not be cleared');
        });

    }

  }
};

app.initialize();
