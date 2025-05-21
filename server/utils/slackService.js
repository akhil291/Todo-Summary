const axios = require('axios'); 

async function sendSlackMessage(message) {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!slackWebhookUrl) {
    console.error('Slack Webhook URL is not configured. Cannot send message.');
    throw new Error('Slack Webhook URL is not configured.');
  }

  try {
    await axios.post(slackWebhookUrl, {
      text: `Todo Summary: ${message}`,
    });
    console.log('Slack message sent successfully!');
  } catch (error) {
    console.error('Error sending message to Slack:', error.message);
    if (error.response) {
      console.error('Slack API Error Response Data:', error.response.data);
    }
    throw new Error('Failed to send message to Slack.');
  }
}

module.exports = { sendSlackMessage };