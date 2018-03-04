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
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: 'assessment-online',
        clientEmail: 'firebase-adminsdk-yb4gw@assessment-online.iam.gserviceaccount.com',
        privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCNhIvdaO9B7Zej\nWC6a8X6KC+yXm1ME/IwGtx+WG+fhluhs0UU+HGKAvTYj0zJGaT7J2kYP1tBut4y7\nB+Jq3IJJvWV+nHmXmrwYTv8qQP9RRn2Obfpm+LMj/PwoFUESndtDFjCXQEMXPlSC\ne/Jky67eow5nYmvp/fESOe6owMQp2stiic8GD4uKkCf15nwJOb/y4Hgxb3Ufpp/I\nscOOnNZ1Kql4veF3fSvv9l7VJ84KFr7dJk9RDbsRSV2f41igw3X024IxgASqV/2H\neE/Wf4e2zA9a2LJSBZfsVC6XwGWHNaZ8E8JuZ2eP0WhS33A4SIeAqN86/CQ7kQ03\nJjcAFkq7AgMBAAECggEAMvyaV79C1IIBrDxNLk3rxVjeeRDhLF7BJHo9yxtqxABW\n5T3QsLwRUUjahLXG209368nUjEhc+EbxUUFZ9h5UYrT2KFPACzsYobl0fYjFdEbt\nXa+KFCdug3zWbKqbs1Vkdhs8joH8qhcu44Q8pMwtyND+k4kGUFvJy0NMFUi+ZEWC\n8if7KIpmctXOH2IZEwC7mzSzPXwgeEGZEg4kXjYgnn8WosBRWqzEqKRTf4DOX00O\nkSSds9SuIjidqE6amnnmn12VwJqF/9+D7el9LkvPgXTvtx4MoDS4ZYsNvUcl6krR\nAAn6QTWgroda9cSVB4lXi2OIF1eOLk7Q99xwDBv1oQKBgQC+bQ3jpP7PmAJqvAIj\n9HqLUf8Du5+K8kwXB3fH5yAft7olke601lKUdW6upVOoxex5+WoPE+yX0aElhJ+h\naQrzjibB0yVyj2DiCAW7cccZVh17J9SlNm1BXSEY+YBu7D9ZuxVlrBFNLpIyHYxJ\nwZW3O9X8xRpD40buQKTYoR8elQKBgQC+QABkzaQyEWKqIaWhGbbv+lhXxTm2AGb3\nY8cIOiFDjGTLLaPkY8coGEqU3fJwdv+TMB1oQyzTYIse5lpdkJNrAyGixJytqUgp\n95q0ZrRg4GUwGxneM+joryrlTYhlcBA9ze2kEIebyaH8xvVyDWtPXzOOmXKfGXtw\nHk091tWADwKBgQCWv+qg7ruySBqRuKjRIffpV05U/DF/Y/WMvaK7pGMv+NjqaS7a\nBll1ocmvhL5H+/gLT8IAkbtZLOEvvGBK/cdnrH9OLgOVP6BpEATJsXb2vc+08YFM\nEVxIxJsxFEPyjCBSvuJfjOpdeaLO/clTkmcdmcb7xmXWnJRIhPB7doIWSQKBgE+d\ntQx6SnZxdBrCje/HNRlkaMgCT05tCKoK5WX5/aWpAR1N8kJHxzZuQ/fckfKiuf28\nqvHQ+tdSlaXOvI5fTHICE3dsVC0QpJR7fBB20pGgFnh1PvQQQS3u8EKZmbTpmsJi\nhUqdaEK3tMR19o1ONFQ5APhyGted8FxRMf3pA9vdAoGActJaEAdFgkOg9U2t36Ku\nm4p/ZxR6gxhgPdvZAUvXkHF3KreE/vScb/NmFyVzXACibtWT3CmdFS5UDUoHELow\nQLVw1j97e87HI2jSFCk2nsFyIOiLIWE4G2U+A9NRlKcP7mMw1ncuOD08bz1ze6k8\nfrA0Xy58EcFlvVkKbWOCceM=\n-----END PRIVATE KEY-----\n',
    }),
    databaseURL: 'https://assessment-online.firebaseio.com'
});
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
//
// Start writing Firebase Functions
// https://firebase.google.com/functions/write-firebase-functions
/**
 * Cria o usuário
 * @type {HttpsFunction}
 */
exports.handlerUser = functions.https.onRequest((req, res) => {
    corsHandler(req, res, () => {
        const uid = req.body.uid;
        const email = req.body.email;
        const password = req.body.password;
        /**
         * Se tem o uid e o email
         * Atualiza a conta
         */
        if (uid && email) {
            /**
             * Atualiza o usuário.
             * Atenção, para visualizar a atualização no console do firebase, atualize o navegador
             */
            admin.auth().updateUser(uid, { email: email, password: password })
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
            admin.auth().createUser({ email: email, password: password })
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
// /**
//  * Atualiza o usuário
//  * @type {HttpsFunction}
//  */
// exports.updateUser = functions.https.onRequest((req, res) => {
//
//   const email = req.body.email;
//   const password = req.body.password;
//
//   /**
//    * Procurar o usuário pelo e-mail que veio como parâmetro da requisição
//    */
//   admin.auth().getUserByEmail(req.query.email)
//     .then(usuario => {
//
//       /**
//        * Após encontrar o usuário pelo e-mail, atualiza o mesmo a partir do uid
//        */
//       admin.auth().updateUser(usuario.uid, {email: email, password: password})
//         .then(result => {
//           res.send(result)
//         })
//         .catch(exception => {
//           res.status(500) //TODO retornar a exception também
//         });
//     })
//     .catch(exception => {
//       res.status(500) //TODO retornar a exception também
//     });
// });
//
/**
 * Deleta o usuário
 * @type {HttpsFunction}
 */
exports.removeAccount = functions.https.onRequest((req, res) => {
    /**
     * Procurar o usuário pelo e-mail que veio como parâmetro da requisição
     */
    admin.auth().getUserByEmail(req.query.email)
        .then(usuario => {
        /**
         * Após encontrar o usuário pelo e-mail, deleta o mesmo pelo uid
         */
        admin.auth().deleteUser(usuario.uid)
            .then(result => {
            res.sendStatus(200);
        })
            .catch(exception => {
            res.status(500); //TODO retornar a exception também
        });
    })
        .catch(exception => {
        res.status(500); //TODO retornar a exception também
    });
});
//
// /**
//  * Busca o  usuário  pelo e-mail
//  * @type {HttpsFunction}
//  */
// exports.getUserByEmail = functions.https.onRequest((req, res) => {
//
//   /**
//    * Procurar o usuário pelo e-mail que veio como parâmetro da requisição
//    */
//   admin.auth().getUserByEmail(req.query.email)
//     .then(usuario => {
//       res.send(usuario)
//     })
//     .catch(exception => {
//       res.status(500) //TODO retornar a exception também
//     });
// });
//# sourceMappingURL=index.js.map