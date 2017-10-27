var express = require("express");
var router = express.Router();
var mongojs = require("mongojs");
var db = mongojs("makersbnb", ["users"]);
var User = require("../models/user");
var session = require("express-session");
var signUpError = undefined;

var sess;

router.get("/", function(req, res) {
	sess = req.session;

	if (sess.currentUser === undefined) {
		res.render("signup", {
			currentUser: sess.currentUser
		});
	} else {
		res.send("Already signed in");
	}
});

router.post("/", function(req, res) {
	sess = req.session;

	req.checkBody("name", "Name is required").notEmpty();
	req.checkBody("username", "Username must be filled in").notEmpty();
	req.checkBody("password", "Password must be filled in").notEmpty();
	req.checkBody("email", "Email must be filled in").notEmpty();

	var errors = req.validationErrors();

	if (errors === false) {
		errors = [];
	}

	db.users.find(function(err, docs) {
		docs.forEach(function(user) {
			if (user.username === req.body.username) {
				var signUpError = { msg: "A user already exists with that username" };
				console.log(signUpError);
				errors.push(signUpError);
			}
		});
		if (errors.length !== 0) {
			res.render("signup", {
				errors: errors,
				currentUser: sess.currentUser
			});
		} else {
			var newUser = new User(
				req.body.name,
				req.body.username,
				req.body.password,
				req.body.email
			);
			db.users.insert(newUser);
			sess.currentUser = newUser;
			res.redirect("/rooms");
		}
	});
});

module.exports = router;
