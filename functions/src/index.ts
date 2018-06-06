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
    projectId: "sodupe-online",
    clientEmail: "firebase-adminsdk-i218d@sodupe-online.iam.gserviceaccount.com",
    privateKey:  "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDXiGRAbDu1+12r\nLyVzATem/GBrbqjVDOJ8c7WwnERge39KPEsrF5b5o/iX/yGhXK56JRW1C/vP5jeO\nDysrHZG+vhEWovMMvDnkY7pwfDmVMjFw53RWzn8H02sq3Jqi0sjZtrtG3BAiKhXs\njJsWfR48Mt2NBx9ahiP5F7uKSprw1oyeD6X92IQ69FoQfToeH5mi2DU8UztKbura\ncRxrqQVQM1liamUfAAp6b58wuJwK6Y9ihUyDAfeEL7+yskfpI4mIeoj2Jd+rWEFx\nchTDkpUdROISDdxJxLf5KtBwnNhz+u2JScMRLgqmqae26sLFO0Y0WYV82HdCcU8Y\nYFlai0/vAgMBAAECggEAY+Ih75cZDuuIS7JELSlVxK2182Orm1xmw50OCORKbdod\nseYCQdyjS1q5dJs4VyLv+swf5LDCiGTcvxl5fHguGFLV8YMflvnN7HFpMALp3qIN\ntpCU4ju9M/++7PSiNy3vBbJA1QRb97FASskYgFIIhoZeFSLFXXrHxgLBF0QezNgO\ng1hIb7bBXLsjw1BClPd6TpZMG6mjYAZQQ617U1WtTEH3fMPGBRCZ1i8eaXkifnfB\nYyN0QbxVHBXqRSAWrL6Qqr7Mzz3WHEjnmdyC7iMvgnOwbVDkUd7u0395C0KLiY36\nXId8nmMZmQhqNYUfXEtdL1fc/XFoJvB3ELsO2wgxRQKBgQD/eUx0qfaQCPepd+pi\neOtR2jQHgRMNiAL9RMxmBQrW8VvcB4YK8te0OSI2/AlGQA8f6DBqiMWabSRcwPPu\nfBWyVFuEV2JsdIeOvF8do863gMFgGV0M7XCK9xMx4Gh19o20oP7ZI4rpeodqWlkh\nT6X4c176NFHil2JcH47lvFbVbQKBgQDX+giaTl1AgtmovZfnoyn2B+Dw+udyYvqc\naNmQ9O6uRaDm1UHUxveJ0AapepX5AW7Pw0B10u9e4tXXwJ7sdCL23254Cq2bkAB6\ng3GF6d179wn7+NtHNJ4tGOYDvyldlnGTmUKDWVUG6kLohT+YzsSh6kng+UPQbkfK\nK4Ewve1NSwKBgQDdwzSL/NGr/CzH7fEGo8JZnhkV/oREdbFqmqL3WB8tr/u2Rs2j\niWOW7RV3N1bxpT+7ybjlcW5ee6lZ3qCgfxPyZem/On+Ud58IVxoVx5D0l47E1Z+B\nTkcoSgtee1cSNwCRMEOox4KY46TSvDSshtAimDt045/FGvXl0/seD1wtDQKBgCkU\n5GIFmfNVcHWKasSi4q5r3Tu5XiEB9s2dnBTYojYABJUj53vDxP4v1bSTHsfYn+1h\nJHfFAcc4uphpiVFM3gG7ilXHIjK+93hWXFeunnSgDwQg2AT5W0UUwVvhFss4fK4o\nruAxM9023jdAcVJtsjViTV8/yshw0bMBB3fwCJ11AoGAcgRgrzBBgGZKoh5ZUPZC\n2KPrAxj1SK6xh+0NlehsWEwe6kN6aVolKbf7zHV/x1YBBbUpOU/2QEre8rdL1aCG\n5iuvINk8j9U63PHJJWmlbTfmHMtO4Jhfmo4ldFjOW3itg2sqQaGPVJjUBGZgZQ1P\nZHI5RG1CwKJAhhhxNk3Rpao=\n-----END PRIVATE KEY-----\n"
  }),
  databaseURL: 'https://sodupe-online.firebaseio.com'
});


// Desenvolvimento
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
