/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch")

admin.initializeApp();
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// exports.helloWorld = functions.https.onCall((data, context) => {
//   const name = data.name || "Anonymous";
//   return {
//     message: `Hello, ${name}!`,
//   };
// });
// exports.helloHttp = functions.https.onRequest((req, res) => {
//   const name = req.query.name || req.body.name || "Anonymous";
//   res.json({ message: `Hello, ${name}!` });
// });

exports.processPayment = functions.https.onRequest(async (req, res) => {
  try {
    const { token, amountInCents } = req.body;

    if (!token || !amountInCents) {
      return res.status(400).json({ error: "Missing token or amountInCents" });
    }

    const response = await fetch("https://online.yoco.com/v1/charges/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //"X-Auth-Secret-Key": functions.config().yoco.secret_key, // secure config
        "X-Auth-Secret-Key": "sk_test_960bfde0VBrLlpK098e4ffeb53e1"
      },
      body: JSON.stringify({
        token,
        amountInCents,
        currency: "ZAR",
      }),
    });

    const json = await response.json();

    res.status(response.status).json({
      status_code: response.status,
      json_response: json,
    });

  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});