let sdk = require('../../../bin/libs/vfos-sdk/sdk-include');
var express = require('express');
var router = express.Router();


  /**
   * change the topic you're listening
   */
router.route('/getAll').get(
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
router.route('/').post(
	function (req, res, next) {
		let data = JSON.parse(JSON.stringify(listOfGettingMessages));
		listOfGettingMessages = []
		res.json({
			messages: data
		})
	}
)

router.route('/').put(
	function (req, res, next) {
		let data = JSON.parse(JSON.stringify(listOfGettingMessages));
		listOfGettingMessages = []
		res.json({
			messages: data
		})
	}
)

router.route('/').delete(
	function (req, res, next) {
		let data = JSON.parse(JSON.stringify(listOfGettingMessages));
		listOfGettingMessages = []
		res.json({
			messages: data
		})
	}
)


module.exports = (app) => router;