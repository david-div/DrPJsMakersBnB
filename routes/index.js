var express = require("express");
var router = express.Router();
var sess;

router.get("/", function(req, res) {
	sess = req.session;
	res.render("welcome", {
		currentUser: sess.currentUser
	});
});

router.get("/signin", function(req, res) {
	res.redirect("/users/signin");
});

router.post("/signin", function(req, res) {
	res.redirect("/users/signin");
});

module.exports = router;
