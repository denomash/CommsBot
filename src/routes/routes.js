/* eslint-disable camelcase */
import express from 'express';
import axios from 'axios';
import request from 'request';
import querystring from 'querystring';
import qs from 'qs';

const router = new express.Router();

function sendMessageToSlackResponseURL(responseURL, JSONmessage) {
  const postOptions = {
    uri: responseURL,
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    json: JSONmessage,
  };
  request(postOptions, (error) => {
    if (error) {
      console.log(error);
    }
  });
}

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
      return res.data;
    }).catch(error => console.log(error));
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

router.post('/command/report', (req, res) => {
  res.status(200).end();
  const payload = req.body;
  const responseURL = payload.response_url;

  const feedback = {
    text: 'Hello :smiley:',
    attachments: [
      {
        text: 'What\'s your progress in the past 24hrs?',
        fallback: "Shame... buttons aren't supported in this land",
        callback_id: 'progress',
        color: '#3AA3E3',
        attachment_type: 'default',
        actions: [
          {
            name: 'Productive',
            text: 'Productive',
            type: 'button',
            value: 'yes',
          },
          {
            name: 'Unproductive',
            text: 'Unproductive',
            type: 'button',
            value: 'no',
            style: 'danger',
          },
          {
            name: 'On vacation',
            text: 'On vacation',
            type: 'button',
            value: 'maybe',
          },
        ],
      },
    ],
  };
  sendMessageToSlackResponseURL(responseURL, feedback);
});

router.post('/actions', (req, res) => {
  try {
    const actionJSONPayload = JSON.parse(req.body.payload); // parse URL-encoded payload JSON string
    const { callback_id, trigger_id } = actionJSONPayload;
    let message;
    switch (callback_id) {
    case 'progress':
      res.status(200).end(); // best practice to respond with 200 status
      console.log(actionJSONPayload);
      if (actionJSONPayload.actions[0].name === 'Productive') {
        message = {
          token: 'xoxp-558972477111-559335643958-558735730897-be87523051880b342b3f47017d012a40',
          trigger_id,
          dialog: JSON.stringify({
            callback_id: 'dev',
            title: 'Request a Ride',
            submit_label: 'Request',
            notify_on_cancel: true,
            state: 'Limo',
            elements: [
              {
                type: 'text',
                label: 'Pickup Location',
                name: 'loc_origin',
              },
              {
                type: 'text',
                label: 'Dropoff Location',
                name: 'loc_destination',
              },
            ],

          }),
        };
        return axios.post('https://slack.com/api/dialog.open', qs.stringify(message))
          .then((resp) => {
            console.log(resp.data);
            return resp.data;
          })
          .catch(err => console.log(err));
        // sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
      } if (actionJSONPayload.actions[0].name === 'Unproductive') {
        message = {
          text: 'That\'s okay.',
          attachments: [
            {
              text: 'Do you have any blockers',
              replace_original: false,
              fallback: "Shame... buttons aren't supported in this land",
              callback_id: 'feedback',
              color: '#3AA3E3',
              attachment_type: 'default',
              actions: [
                {
                  name: 'Yes',
                  text: 'Yes',
                  type: 'button',
                  value: 'yes',
                },
                {
                  name: 'No',
                  text: 'No',
                  type: 'button',
                  value: 'no',
                },
              ],
            },
          ],
        };
        sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
      } if (actionJSONPayload.actions[0].name === 'On vacation') {
        message = {
          text: 'Happy holidays.',
        };
        sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
      }
      break;

    case 'feedback':
      res.status(200).end();
      if (actionJSONPayload.actions[0].name === 'Yes') {
        message = {
          text: 'Awesome :+1:',
          attachments: [
            {
              text: 'Have you updated your client on this',
              replace_original: false,
              fallback: "Shame... buttons aren't supported in this land",
              callback_id: 'feedback2',
              color: '#3AA3E3',
              attachment_type: 'default',
              actions: [
                {
                  name: 'Yes',
                  text: 'Yes',
                  type: 'button',
                  value: 'yes',
                },
                {
                  name: 'No',
                  text: 'No',
                  type: 'button',
                  value: 'no',
                },
              ],
            },
          ],
        };
        sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
      } if (actionJSONPayload.actions[0].name === 'No') {
        message = {
          text: 'That\'s cool',
          attachments: [
            {
              text: 'Have you updated your client on this',
              replace_original: false,
              fallback: "Shame... buttons aren't supported in this land",
              callback_id: 'feedback2',
              color: '#3AA3E3',
              attachment_type: 'default',
              actions: [
                {
                  name: 'Yes',
                  text: 'Yes',
                  type: 'button',
                  value: 'yes',
                },
                {
                  name: 'No',
                  text: 'No',
                  type: 'button',
                  value: 'no',
                },
              ],
            },
          ],
        };
        sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
      }
      break;
    case 'dev':
      console.log(actionJSONPayload);
      return res.status(200);
    //   //   message = {
    //   //     text: 'Cool',
    //   //   };
    //   //   sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
    //   sendDirectMessageTobot("hello");
    //   break;

    case 'feedback2':
      res.status(200).end();
      if (actionJSONPayload.actions[0].name === 'Yes') {
        message = {
          text: 'Keep it up. \n Continue with the same spirit. Communication is a powerfull tool. ',
        };
        sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
      } if (actionJSONPayload.actions[0].name === 'No') {
        message = {
          text: 'It is a good practice to keep the client on the loop. Communication is key. ',
        };
        sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
      }

      break;

    default:
      console.log('Ooops! Something went wrong');
    }
  } catch (error) {
    console.log('Ooops! Something went extra extra wrong');
  }
});

export default router;
