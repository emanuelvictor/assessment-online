"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
//
// Start writing Firebase Functions
// https://firebase.google.com/functions/write-firebase-functions
exports.helloWorld = functions.https.onRequest((request, response) => {
    // response.send("Hello World!");
    response.send('Más acontece é que eu te amo, e esse seu bumbum chamando!');
});
// The Firebase Admin SDK to access the Firebase Realtime Database.
// admin.initializeApp({
//   credential: admin.credential.cert(JSON.stringify(environment.accountService)),
//   databaseURL: "https://assessment-online.firebaseio.com"
// });
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: "assessment-online",
        clientEmail: "firebase-adminsdk-yb4gw@assessment-online.iam.gserviceaccount.com",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCNhIvdaO9B7Zej\nWC6a8X6KC+yXm1ME/IwGtx+WG+fhluhs0UU+HGKAvTYj0zJGaT7J2kYP1tBut4y7\nB+Jq3IJJvWV+nHmXmrwYTv8qQP9RRn2Obfpm+LMj/PwoFUESndtDFjCXQEMXPlSC\ne/Jky67eow5nYmvp/fESOe6owMQp2stiic8GD4uKkCf15nwJOb/y4Hgxb3Ufpp/I\nscOOnNZ1Kql4veF3fSvv9l7VJ84KFr7dJk9RDbsRSV2f41igw3X024IxgASqV/2H\neE/Wf4e2zA9a2LJSBZfsVC6XwGWHNaZ8E8JuZ2eP0WhS33A4SIeAqN86/CQ7kQ03\nJjcAFkq7AgMBAAECggEAMvyaV79C1IIBrDxNLk3rxVjeeRDhLF7BJHo9yxtqxABW\n5T3QsLwRUUjahLXG209368nUjEhc+EbxUUFZ9h5UYrT2KFPACzsYobl0fYjFdEbt\nXa+KFCdug3zWbKqbs1Vkdhs8joH8qhcu44Q8pMwtyND+k4kGUFvJy0NMFUi+ZEWC\n8if7KIpmctXOH2IZEwC7mzSzPXwgeEGZEg4kXjYgnn8WosBRWqzEqKRTf4DOX00O\nkSSds9SuIjidqE6amnnmn12VwJqF/9+D7el9LkvPgXTvtx4MoDS4ZYsNvUcl6krR\nAAn6QTWgroda9cSVB4lXi2OIF1eOLk7Q99xwDBv1oQKBgQC+bQ3jpP7PmAJqvAIj\n9HqLUf8Du5+K8kwXB3fH5yAft7olke601lKUdW6upVOoxex5+WoPE+yX0aElhJ+h\naQrzjibB0yVyj2DiCAW7cccZVh17J9SlNm1BXSEY+YBu7D9ZuxVlrBFNLpIyHYxJ\nwZW3O9X8xRpD40buQKTYoR8elQKBgQC+QABkzaQyEWKqIaWhGbbv+lhXxTm2AGb3\nY8cIOiFDjGTLLaPkY8coGEqU3fJwdv+TMB1oQyzTYIse5lpdkJNrAyGixJytqUgp\n95q0ZrRg4GUwGxneM+joryrlTYhlcBA9ze2kEIebyaH8xvVyDWtPXzOOmXKfGXtw\nHk091tWADwKBgQCWv+qg7ruySBqRuKjRIffpV05U/DF/Y/WMvaK7pGMv+NjqaS7a\nBll1ocmvhL5H+/gLT8IAkbtZLOEvvGBK/cdnrH9OLgOVP6BpEATJsXb2vc+08YFM\nEVxIxJsxFEPyjCBSvuJfjOpdeaLO/clTkmcdmcb7xmXWnJRIhPB7doIWSQKBgE+d\ntQx6SnZxdBrCje/HNRlkaMgCT05tCKoK5WX5/aWpAR1N8kJHxzZuQ/fckfKiuf28\nqvHQ+tdSlaXOvI5fTHICE3dsVC0QpJR7fBB20pGgFnh1PvQQQS3u8EKZmbTpmsJi\nhUqdaEK3tMR19o1ONFQ5APhyGted8FxRMf3pA9vdAoGActJaEAdFgkOg9U2t36Ku\nm4p/ZxR6gxhgPdvZAUvXkHF3KreE/vScb/NmFyVzXACibtWT3CmdFS5UDUoHELow\nQLVw1j97e87HI2jSFCk2nsFyIOiLIWE4G2U+A9NRlKcP7mMw1ncuOD08bz1ze6k8\nfrA0Xy58EcFlvVkKbWOCceM=\n-----END PRIVATE KEY-----\n",
    }),
    databaseURL: 'https://assessment-online.firebaseio.com'
});
// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
// exports.addMessage = functions.https.onRequest((req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text;
//   // Push the new message into the Realtime Database using the Firebase Admin SDK.
//   admin.database().ref('/messages').push({original: original}).then(snapshot => {
//     // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//     res.redirect(303, snapshot.ref);
//   });
// }); 
//# sourceMappingURL=index.js.map