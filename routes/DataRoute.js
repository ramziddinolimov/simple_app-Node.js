const router = require("express").Router();
const { createCrypt, compareCrypt } = require("../modules/bcrypt");
const { createToken, checkToken } = require("../modules/jwt");

// router.get("/profile", (req, res) => {
//     res.render("profile");
//   });

 