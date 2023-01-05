// const express = require("express");
const request = require("request");
const axios = require("axios");
const _ = require("lodash");

const fetchToken = async () => {
  const options = {
    method: "POST",
    url: "https://www.googleapis.com/oauth2/v4/token",
    headers: { "content-type": "application/json" },
    body: {
      grant_type: "refresh_token",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      refresh_token:
        "1//0gWBsOFUkjH6LCgYIARAAGBASNwF-L9IriXxDeveNgL1faj3VPcZDxMgL7qNSf-Dt2uj981nI9zD_DJ6ZUGHpGAIHu-EI2_8ghpU",
    },
    json: true,
  };

  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
};

const fetchEmails = async (userId = "me", accessToken) => {
  return axios
    .get(`https://gmail.googleapis.com/gmail/v1/users/${userId}/messages`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data);
};

const readThread = async (userId, threadId, accessToken) => {
  return axios
    .get(
      `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages/${threadId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then((response) => response.data)
    .catch((err) => ({}));
};

const auth = async (req, res) => {
  try {
    const userId = req.params.id || "me";
    const accessToken = await fetchToken().then(
      (response) => response.access_token
    );
    const response = await fetchEmails(userId, accessToken);
    const messages = response.messages;
    const payload = await Promise.all(
      messages.map((message) =>
        readThread(userId, message.threadId, accessToken)
      )
    );

    const filtered = _.map(payload, ["id"]);
    res.status(200);
    res.json({
      result: payload,
    });
  } catch (error) {
    console.log(error);
    res.json({
      result: error.message,
    });
  }
};

const filterProperties = (response) => {
  const updatedProps = response.map((data) => {
    if (data.payload) {
      const subject = _.get(
        _.head(_.filter(data.payload.headers, ["name", "Subject"])),
        "value"
      );
      const from = _.get(
        _.head(_.filter(data.payload.headers, ["name", "From"])),
        "value"
      );
      const date = _.get(
        _.head(_.filter(data.payload.headers, ["name", "Date"])),
        "value"
      );
      return {
        id: data.id,
        date: date,
        subject: subject,
        from: from,
        message: data.snippet,
      };
    } else {
      {
      }
    }
  });

  //console.log("updated " + JSON.stringify(updatedProps))
  return updatedProps;
};

module.exports.auth = auth;
