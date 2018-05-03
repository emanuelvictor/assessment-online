"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require('cors');
const corsHandler = cors({ origin: true });
/**
 * Credenciais
 * TODO Colocar em outro lugar
 */
// // Produção
// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: 'assessment-online',
//     clientEmail: 'firebase-adminsdk-yb4gw@assessment-online.iam.gserviceaccount.com',
//     privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCNhIvdaO9B7Zej\nWC6a8X6KC+yXm1ME/IwGtx+WG+fhluhs0UU+HGKAvTYj0zJGaT7J2kYP1tBut4y7\nB+Jq3IJJvWV+nHmXmrwYTv8qQP9RRn2Obfpm+LMj/PwoFUESndtDFjCXQEMXPlSC\ne/Jky67eow5nYmvp/fESOe6owMQp2stiic8GD4uKkCf15nwJOb/y4Hgxb3Ufpp/I\nscOOnNZ1Kql4veF3fSvv9l7VJ84KFr7dJk9RDbsRSV2f41igw3X024IxgASqV/2H\neE/Wf4e2zA9a2LJSBZfsVC6XwGWHNaZ8E8JuZ2eP0WhS33A4SIeAqN86/CQ7kQ03\nJjcAFkq7AgMBAAECggEAMvyaV79C1IIBrDxNLk3rxVjeeRDhLF7BJHo9yxtqxABW\n5T3QsLwRUUjahLXG209368nUjEhc+EbxUUFZ9h5UYrT2KFPACzsYobl0fYjFdEbt\nXa+KFCdug3zWbKqbs1Vkdhs8joH8qhcu44Q8pMwtyND+k4kGUFvJy0NMFUi+ZEWC\n8if7KIpmctXOH2IZEwC7mzSzPXwgeEGZEg4kXjYgnn8WosBRWqzEqKRTf4DOX00O\nkSSds9SuIjidqE6amnnmn12VwJqF/9+D7el9LkvPgXTvtx4MoDS4ZYsNvUcl6krR\nAAn6QTWgroda9cSVB4lXi2OIF1eOLk7Q99xwDBv1oQKBgQC+bQ3jpP7PmAJqvAIj\n9HqLUf8Du5+K8kwXB3fH5yAft7olke601lKUdW6upVOoxex5+WoPE+yX0aElhJ+h\naQrzjibB0yVyj2DiCAW7cccZVh17J9SlNm1BXSEY+YBu7D9ZuxVlrBFNLpIyHYxJ\nwZW3O9X8xRpD40buQKTYoR8elQKBgQC+QABkzaQyEWKqIaWhGbbv+lhXxTm2AGb3\nY8cIOiFDjGTLLaPkY8coGEqU3fJwdv+TMB1oQyzTYIse5lpdkJNrAyGixJytqUgp\n95q0ZrRg4GUwGxneM+joryrlTYhlcBA9ze2kEIebyaH8xvVyDWtPXzOOmXKfGXtw\nHk091tWADwKBgQCWv+qg7ruySBqRuKjRIffpV05U/DF/Y/WMvaK7pGMv+NjqaS7a\nBll1ocmvhL5H+/gLT8IAkbtZLOEvvGBK/cdnrH9OLgOVP6BpEATJsXb2vc+08YFM\nEVxIxJsxFEPyjCBSvuJfjOpdeaLO/clTkmcdmcb7xmXWnJRIhPB7doIWSQKBgE+d\ntQx6SnZxdBrCje/HNRlkaMgCT05tCKoK5WX5/aWpAR1N8kJHxzZuQ/fckfKiuf28\nqvHQ+tdSlaXOvI5fTHICE3dsVC0QpJR7fBB20pGgFnh1PvQQQS3u8EKZmbTpmsJi\nhUqdaEK3tMR19o1ONFQ5APhyGted8FxRMf3pA9vdAoGActJaEAdFgkOg9U2t36Ku\nm4p/ZxR6gxhgPdvZAUvXkHF3KreE/vScb/NmFyVzXACibtWT3CmdFS5UDUoHELow\nQLVw1j97e87HI2jSFCk2nsFyIOiLIWE4G2U+A9NRlKcP7mMw1ncuOD08bz1ze6k8\nfrA0Xy58EcFlvVkKbWOCceM=\n-----END PRIVATE KEY-----\n',
//   }),
//   databaseURL: 'https://assessment-online.firebaseio.com'
// });
// Desenvolvimento
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: 'd-assessment-online',
        privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCm7wqxalKqw900\nnp22tQJanv5lf4pOn5VahPfYr5Ej+LnO0RShGBIvwJnbryQBtvST2P8ci9pLQl4D\nGlyxRjppdGfiD4lo5+MsfSS52ww8cYjyhn7LmJxIsRlCUWcg1mJPFTV8S504pFmp\n3HPXbjSVsos4ET137JIOOtJ3RLyXWtw+fUoSlqJz6wc0tLf8v/0ZlHW4H8POyjhA\nn25JWFRyR7tfwNLrQF03Zw4c7O8rjsquQ4YSftsrPJsNnJbTu2SfGXSg9UIA2OqQ\nKumDSVe+Y2rr7wdorXXZYl4Kcvqay6J9SAkJS19kxj8krGJevIPyNIvl1+KI+bbm\njP66QQ8FAgMBAAECggEADIocb0R0QRQVP9CMunlWhoNMIEiIQDeFbacwgpl46Vm+\nbrOZcrAUc6ZVLbb2WTOf+SLTJ6w2DF0H+KszBx+mSnQeS+aiCjGQXhqTbEDw+8cF\nLr9IHdfmS3aUK2gNJglnQ+ytAnEf9liFd2M83L6lmrtum5pTQqN7EDBpIrY/hWNE\nbj4j4e5DvELY+6BGtW5K0BItsgwyU7Nj5OwXS7aPH0j+uHZuVPlvcEeFnMoW0KAM\ncUNiR2n3TEjfCy9MV61nmtYKv90R8Wr+lnewikhMKAwfJ2hFcdp8YTx/FiXkmgVW\nG8ObHFczb/THkOZv/O4+fTlTEYmr0aROyUv+OXCJWQKBgQDiof9VXDUxB/rhsIKD\nCJglUCx1u7InpY21aqLMu8/ccM1daKzbPEGEn552lWzBO0B8uYzK/v503Fbzk7Fz\ngHnvW/Rn3EsugwpFHAohOID4xdzJbrPzLZPEVIR+L0v+e9U3Bx974LeoolQqdKVf\ncKYvk+14O57mLg3ZkLzP/U4O/QKBgQC8kKvDTGgSw6OR7aRfRbhhx8TGQbndL5UQ\npUVL4swiyHlFOAiB6uwWLpy4moBMuKHVQtelSPSJ6pO3lc7s96aI4EXw2kEjW141\nrY7kKGaTiQYuNWYOtTZt+GLfp07DBw7alX3EW1PUECEUDv7L8fHoE4+XSdMzLLcw\ny/xL1ibyqQKBgDPX+yD7xu9AdBPM3Q48mRFwFbuZBFgtdw1ZJ4TOMe6rn08O8vvz\n/Mjp+sYFyKsrcsUVbS/CxVLWVM3Dq4RQj5RB5NcdfdVWBLNqhqay1k4SdT9fI6st\ncfAnpWd4Sloc2dmMt5cPAPSCrd5IcMw0aM/ZdylZ+i+NuX1brtWljIXBAoGBAKsg\nUAEJUlnVGpjQph+gUljKxxV1iIvnJszYcC8SQFhAv23GEFJ3NJJc8vXFoTH/TT8R\nTks+Dk8rh6tQVV5Q0d3eSxrtt7eyr6jfPZJp5810yRsecuReKGtcw75dQ+lSenR8\nvop4p3cIvDxL74h+ph8LwYB3CyiiKA4s0Waxjt8hAoGALLGQHmw4lQAuIf8oCYm2\nQFNXm5HBGZHy2rPWdZk6lcpSXcZTVGKRyzrR2Wxy3gGdOCa/XOmBTblGjSlXt+ni\niCtOI9virFpTbMR3gTIVjWTObtHXajALIOutzsx+66EkWYgiKae3NKiSKilA7ez5\nZuMqfthAb6Rm30sjkcmT770=\n-----END PRIVATE KEY-----\n',
        clientEmail: 'firebase-adminsdk-gwvty@d-assessment-online.iam.gserviceaccount.com',
    }),
    databaseURL: 'https://d-assessment-online.firebaseio.com',
});
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
            admin.auth().updateUser(uid, { email: email, password: password, photoURL: photoURL, displayName: displayName })
                .then(result => {
                console.log(result);
                res.send(result);
            })
                .catch(exception => {
                console.log(exception);
                res.sendStatus(500);
            });
            /**
             * Se não tem tem o uid e tem o email, cria a conta
             */
        }
        else if (!uid && email) {
            /**
             * Cria um usuário
             */
            admin.auth().createUser({ email: email, password: password, photoURL: photoURL, displayName: displayName })
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
        }
        else if (uid && !email) {
            /**
             * Deleta o usuário pelo uid
             */
            admin.auth().deleteUser(uid)
                .then(result => {
                res.sendStatus(200);
            })
                .catch(exception => {
                console.log(exception);
                res.status(500);
            });
        }
        else
            res.status(200);
    });
});
//# sourceMappingURL=index.js.map