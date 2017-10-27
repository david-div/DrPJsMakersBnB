var express = require("express");
var router = express.Router();
var mongojs = require("mongojs");
var db = mongojs("makersbnb", ["users"]);
var session = require("express-session");

module.exports = router;

var sess;

router.post("/", function(req, res) {
	res.redirect("/rooms");
});

router.post("/signin", function(req, res) {
	res.render("signin", {});
});

router.get("/signin", function(req, res) {
	sess = req.session;

	res.render("signin", {
		currentUser: req.currentUser
	});
});

router.post("/confirm", function(req, res) {
	sess = req.session;

	req.checkBody("username", "Username must be filled in").notEmpty();
	req.checkBody("password", "Password must be filled in").notEmpty();

	var errors = req.validationErrors();

	if (errors === false) {
		errors = [];
	}

	sess.tempUser = undefined;

	db.users.find(function(err, docs) {
		docs.forEach(function(user) {
			if (
				user.username === req.body.username &&
				user.password === req.body.password
			) {
				sess.tempUser = user;
			}
		});
		if (sess.tempUser !== undefined) {
			sess.currentUser = sess.tempUser;
			res.redirect("/rooms");
		} else {
			var detailsError = { msg: "No user found with those details" };
			errors.push(detailsError);
			res.render("signin", {
				currentUser: req.currentUser,
				errors: errors
			});
		}
	});
});

router.post("/signout", function(req, res) {
	sess = req.session;
	sess.currentUser = undefined;
	res.redirect("/rooms");
});
