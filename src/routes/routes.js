import express from 'express';
import axios from 'axios';
import querystring from 'querystring';

const router = new express.Router();

const sendDirectMessageTobot = (responseText) => {
  const options = {
    token: 'xoxb-558972477111-560379059399-iFAN3xmLH6Lc7KzMLnXi3RKo',
    channel: 'DGFJNCVAR',
    text: responseText,
    attachments: [
      {
        text: 'Cool  \n Have you updated your client on this?',
        fallback: "Shame... buttons aren't supported in this land",
        callback_id: 'q1',
        color: '#3AA3E3',
        attachment_type: 'default',
        actions: [
          {
            name: 'yes',
            text: 'yes',
            type: 'button',
            value: 'yes',
          },
          {
            name: 'No',
            text: 'No',
            type: 'button',
            value: 'no',
            style: 'danger',
          },
        ],
      },
    ],
    as_user: false,
    headers: {
      'Content-type': 'application/json',
    },
  };

  return axios.post('https://slack.com/api/chat.postMessage', querystring.stringify(options))
    .then((res) => {
      // console.log(querystring.stringify(options));
      res.status(200).end();
    });
};

router.post('/events', (req, res) => {
  const payload = req.body;
  console.log(payload);
  const message = {
    challenge: payload.challenge,
  };

  if (payload.type === 'url_verification') {
    // console.log(payload);
    res.status(200).json(message);
  }

  if (payload.event.type === 'message' && payload.event.subtype !== 'bot_message') {
    let response;
    if (payload.event.text.includes('Hello')) {
      response = 'Hello there :smiley: \n What have you accomplished in the past 24hrs?';
      sendDirectMessageTobot(response);
    }
  }
});

export default router;
