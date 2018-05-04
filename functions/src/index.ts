import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const cors = require('cors');
const corsHandler = cors({origin: true});

/**
 * Credenciais
 * TODO Colocar em outro lugar
 */
// Produção
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "cinecataratas-online",
    clientEmail: "firebase-adminsdk-g7qhs@cinecataratas-online.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC4oUuTMJNNpUQ5\nr6XF1Of2rIm75Ad8Hr9m3rqQ/jMQYVzYh8HebhT05tk3PrT2WEsfoCbGMqmtEDq9\nX533IsPuX9UhK8PLTSMPI6lusFCHaectp7u5vBLSAAOPwg/ItLG8TuPYC2iHkg+E\nAdJ2hIS9j7T2PL33c4wVs6JI+vFP+6Sb/SC2KE03pkcBxdSglYLBOdo0aJAu4MY4\nmiGPrEs0Yg2aALg+1T6piOyIVolo4BzxLtmgy27Z3uEYfRU3RCvwGs0kxDj8YmEv\nLMW5K0LRwPB8g9BV+b6a85e3gKtYep+AAPVWNnUV+RYIVYqjmgW2SZb5tIoTn3ui\nSoGdRNRNAgMBAAECggEAJRAb/7wsldWrUHk2KfSHbDlOnO01o3D4s0na4ehlj9A7\ntyvpeyFWC6Obzz9DTICE9CBOKFNbRGaRpBpht46/DkcmnbYPY+xkMVHTXWj/gW98\n/OlDAhIDJSzjiiRGzt+XHlon2uLPZQepHbLP8QLBMtx6U0P2TopfgKvC1Cur7YYa\nLUmAYrtxXAenXWYHyoGd3aBRRfiXH1/eYMhzt7UnAn7cO8z5IJZq6zGYf9saTZOv\nU+kXv+IeGgDED/U527jw9cxU8egfGrCPfrdEuJ/Xcy30JLXGy4DEv0Ja7DhVcfqJ\niNRfsQ/YteU/9yLmNk/lGCed4nBMCt2fsYLIpBN9cQKBgQD+2egaVtuU+g9ovBsA\n0jHlBp7oqklpJjC1bRhxYtz8dYt+o7wlwEsCEqGd5PePLu3il7DgXWVdgZbpDZ4A\n1yAQOuOUY+nDMufgsdmIvdeOUSYuKsTkdnYSKsTUYS5KjGWPkEg3jJ45BHsq3uk2\nFR54ADsVL2h+BBXRHZd2K3/vqwKBgQC5dlrPfm/mQF8mZ6d1EgAir6p0QhZ90iUY\nfOpx03Aj3XgDbfR2NbHxNrBwd95t9D646uFMS2EgIZXDkUSKlroVWZQagnySOFKH\nqhq9pTrzuT3CWGb6K31xIJMgxGUujGnVkoQJalVW9yU6Y/oymMswxmNisaifa0Xm\nUAja5b2z5wKBgQCXL/CIx6Rmgd5oVMd0Oj5NTxswje0VCwn0Z28LvQm6X4VMsJfq\nkWQuK51jTTUr5TxMo47T27RJv5omUeS9POIRns3p90fzfByhaQDTJURecnfDBa5e\nloQ/DM5N7AUJRrbtbzvYcHxg+O6UpT8WzXqQ2Bo03DYSJBxJPVPgT7gLFwKBgByK\nFv1ZIpUXEM1TJBTC2Vx9FcjgJp/kB6tWBanQdLBAM2irsfPC3YgV917HQ2Y+MKy6\nEENyUhbktCwtHZQKD8abS0wtCkhh/Gk+BvFqDMFWnydZ/TbAHISdE6b2Me/Q0bR4\n4HKmd01zqLnsiqLgmlv+G2sjlaQ6mL4RUNuGgQO/AoGBAI8tjYDc5c+ROQsvgsai\njVa3iGNmGD6obNhY7dcI8qppEksraHS7Fo1L98KKGg4GX6I8fap0IzfHHQXPxmxT\n/4g+BnwXHjRzFjBKMUDSew9B8OcpN65TgsiocWzFIrAspkwKm/uP4EsCiMkDLVjl\nk8cH/OH27GFEKGhwg4VpAZoV\n-----END PRIVATE KEY-----\n"
  }),
  databaseURL: 'https://cinecataratas-online.firebaseio.com'
});


// // Desenvolvimento
// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: 'd-assessment-online',
//     privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCm7wqxalKqw900\nnp22tQJanv5lf4pOn5VahPfYr5Ej+LnO0RShGBIvwJnbryQBtvST2P8ci9pLQl4D\nGlyxRjppdGfiD4lo5+MsfSS52ww8cYjyhn7LmJxIsRlCUWcg1mJPFTV8S504pFmp\n3HPXbjSVsos4ET137JIOOtJ3RLyXWtw+fUoSlqJz6wc0tLf8v/0ZlHW4H8POyjhA\nn25JWFRyR7tfwNLrQF03Zw4c7O8rjsquQ4YSftsrPJsNnJbTu2SfGXSg9UIA2OqQ\nKumDSVe+Y2rr7wdorXXZYl4Kcvqay6J9SAkJS19kxj8krGJevIPyNIvl1+KI+bbm\njP66QQ8FAgMBAAECggEADIocb0R0QRQVP9CMunlWhoNMIEiIQDeFbacwgpl46Vm+\nbrOZcrAUc6ZVLbb2WTOf+SLTJ6w2DF0H+KszBx+mSnQeS+aiCjGQXhqTbEDw+8cF\nLr9IHdfmS3aUK2gNJglnQ+ytAnEf9liFd2M83L6lmrtum5pTQqN7EDBpIrY/hWNE\nbj4j4e5DvELY+6BGtW5K0BItsgwyU7Nj5OwXS7aPH0j+uHZuVPlvcEeFnMoW0KAM\ncUNiR2n3TEjfCy9MV61nmtYKv90R8Wr+lnewikhMKAwfJ2hFcdp8YTx/FiXkmgVW\nG8ObHFczb/THkOZv/O4+fTlTEYmr0aROyUv+OXCJWQKBgQDiof9VXDUxB/rhsIKD\nCJglUCx1u7InpY21aqLMu8/ccM1daKzbPEGEn552lWzBO0B8uYzK/v503Fbzk7Fz\ngHnvW/Rn3EsugwpFHAohOID4xdzJbrPzLZPEVIR+L0v+e9U3Bx974LeoolQqdKVf\ncKYvk+14O57mLg3ZkLzP/U4O/QKBgQC8kKvDTGgSw6OR7aRfRbhhx8TGQbndL5UQ\npUVL4swiyHlFOAiB6uwWLpy4moBMuKHVQtelSPSJ6pO3lc7s96aI4EXw2kEjW141\nrY7kKGaTiQYuNWYOtTZt+GLfp07DBw7alX3EW1PUECEUDv7L8fHoE4+XSdMzLLcw\ny/xL1ibyqQKBgDPX+yD7xu9AdBPM3Q48mRFwFbuZBFgtdw1ZJ4TOMe6rn08O8vvz\n/Mjp+sYFyKsrcsUVbS/CxVLWVM3Dq4RQj5RB5NcdfdVWBLNqhqay1k4SdT9fI6st\ncfAnpWd4Sloc2dmMt5cPAPSCrd5IcMw0aM/ZdylZ+i+NuX1brtWljIXBAoGBAKsg\nUAEJUlnVGpjQph+gUljKxxV1iIvnJszYcC8SQFhAv23GEFJ3NJJc8vXFoTH/TT8R\nTks+Dk8rh6tQVV5Q0d3eSxrtt7eyr6jfPZJp5810yRsecuReKGtcw75dQ+lSenR8\nvop4p3cIvDxL74h+ph8LwYB3CyiiKA4s0Waxjt8hAoGALLGQHmw4lQAuIf8oCYm2\nQFNXm5HBGZHy2rPWdZk6lcpSXcZTVGKRyzrR2Wxy3gGdOCa/XOmBTblGjSlXt+ni\niCtOI9virFpTbMR3gTIVjWTObtHXajALIOutzsx+66EkWYgiKae3NKiSKilA7ez5\nZuMqfthAb6Rm30sjkcmT770=\n-----END PRIVATE KEY-----\n',
//     clientEmail: 'firebase-adminsdk-gwvty@d-assessment-online.iam.gserviceaccount.com',
//   }),
//   databaseURL: 'https://d-assessment-online.firebaseio.com',
// });

/**
 * Cria o usuário
 * @type {HttpsFunction}
 */
exports.handlerUser = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {

    const uid = req.body.uid;
    const email = req.body.email;
    const password = req.body.password;
    const photoURL = req.body.photoURL;
    const displayName = req.body.displayName;

    /**
     * Se tem o uid e o email
     * Atualiza a conta
     */
    if (uid && email) {

      /**
       * Atualiza o usuário.
       * Atenção, para visualizar a atualização no console do firebase, atualize o navegador
       */
      admin.auth().updateUser(uid, {email: email, password: password, photoURL: photoURL, displayName: displayName})
        .then(result => {
          console.log(result);
          res.send(result)
        })
        .catch(exception => {
          console.log(exception);
          res.sendStatus(500);
        });

      /**
       * Se não tem tem o uid e tem o email, cria a conta
       */
    } else if (!uid && email) {

      /**
       * Cria um usuário
       */
      admin.auth().createUser({email: email, password: password, photoURL: photoURL, displayName: displayName})
        .then(result => {
          res.send(result);
        })
        .catch(exception => {
          console.log(exception);
          res.sendStatus(500);
        });

      /**
       * Se tem uid e não tem email, deleta a conta
       */
    } else if (uid && !email) {

      /**
       * Deleta o usuário pelo uid
       */
      admin.auth().deleteUser(uid)
        .then(result => {
          res.sendStatus(200)
        })
        .catch(exception => {
          console.log(exception);
          res.status(500)
        });

    } else res.status(200);

  })
});
