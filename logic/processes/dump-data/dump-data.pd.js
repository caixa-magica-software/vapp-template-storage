let sdk = require('../../../bin/libs/vfos-sdk/sdk-include');
var express = require('express');
var router = express.Router();


let vfosMessagingPubsub = sdk.messagingNoIssue;
var broker = sdk.config.MESSAGING_PUBSUB.SERVER_URL;
var userName = "archiver1";
var domain = "pt.vfos";
var routingKeys = ["#"];


/**
 * 
 *  begging of section to archive messaging from a topic
 */
var communications = new vfosMessagingPubsub(broker, userName, domain, routingKeys);
var Topic = "pt.vfos.channel.test";
let listOfGettingMessages = [];

function messageHandler(msg) {
	topic = msg.routingKey;
	console.log('topic ', topic);
	switch (msg.content.toString()) {
		case "trigger":
			console.log("> messageHandler: TRIGGER SPECIAL MESSAGE");
			break;
		default:
			console.log("> messageHandler: msg.content = \"" + msg.content.toString() + "\"");
			if (topic == Topic) {
				listOfGettingMessages.push({
					mgs: msg.content.toString(),
					date: new Date
				})
			}

			break;
	}
}

communications.sendPublication(domain + ".critical", "trigger");
communications.registerPublicationReceiver(messageHandler);
communications.registerPrivateMessageReceiver(messageHandler);
/**
 * end of archive section
 */


/**
 * 	
// Simulating the sending data form a sensor
 * 
 */

let message = {
	mgs: '',
	id: 0
}
let acc = 1;

let myTimer = setInterval(sendMessageViaMessage, 1000 * 2);
function sendMessageViaMessage() {
	console.info('sending new messaging over topic ', Topic);
	message = {
		mgs: 'message from server ',
		id: acc++
	}
	communications.sendPublication(Topic, JSON.stringify(message));
}
/**
 * 
 * end of section of client
 */


 /**
  * 	
  * route section 
  * 
  */

  /**
   * change the topic you're listening
   */
router.route('/change_topic').post(
	function (req, res, next) {

		console.log('body is ', req.body)
		Topic = req.body.topic;
		console.log('TOPIC is ',Topic )
		/* Clear and recreate the interval
		 */
		clearInterval(myTimer);
		myTimer = setInterval(sendMessageViaMessage, 1000 * 2);
		res.json({
			newTopic: Topic
		})

	}
)

/**
 * get the messages that came via pubsub
 */
router.route('/messages').get(
	function (req, res, next) {
		let data = JSON.parse(JSON.stringify(listOfGettingMessages));
		listOfGettingMessages = []
		res.json({
			messages: data
		})
	}
)


module.exports = (app) => router;