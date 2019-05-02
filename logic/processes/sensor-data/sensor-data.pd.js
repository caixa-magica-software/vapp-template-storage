var express = require('express');
var router = express.Router();

router.route('/').get(
	function(req,res,next){
		res.json({data : new Date()})
	}
)


module.exports = (app) => router; 