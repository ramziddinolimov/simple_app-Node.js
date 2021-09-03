const router = require("express").Router();
const { createCrypt, compareCrypt } = require("../modules/bcrypt");
const { createToken, checkToken } = require("../modules/jwt");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/signup", (req, res) => {
  res.render("sign");
});

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    res.render("index", {
      error: "Email or Password not found",
    });
    return;
  }

  let user = await req.db.users.findOne({
    email: email.toLowerCase(),
  });

  if (user) {
    res.render("index", {
      error: "Email already exists",
    });
    return;
  }

  user = await req.db.users.insertOne({
    email: email.toLowerCase(),
    password: await createCrypt(password),
  });

  res.redirect("/");
});

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    res.render("index", {
      error: "Email or Password not found",
    });
    return;
  }

  let user = await req.db.users.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    res.render("index", {
      error: "User not found",
    });
    return;
  }

  if (!(await compareCrypt(user.password, password))) {
    res.render("index", {
      error: "Password is incorrect",
    });
    return;
  }

  const token = createToken({
    user_id: user._id,
  });

  res.cookie("token", token).redirect("/profile");
});

async function AuthUserMiddleware(req, res, next) {
  if (!req.cookies.token) {
    res.redirect("/");
  }

  const isTrust = checkToken(req.cookies.token);

  if (isTrust) {
    req.user = isTrust;
    next();
  } else {
    res.redirect("/");
  }
}



router.get("/profile", AuthUserMiddleware, (req, res) => {
  res.render("profile");
});


router.post("/incoming", async (req, res) => {
  let {floatingInput, number} = req.body
  console.log(floatingInput, number);
  let ds = await  req.db.dss.find({
    s: floatingInput,
    

  })

  console.log(ds);

  let dm = await  req.db.dms.findOne({
    
    m: number

  })
});


router.post("/outcoming", async (req, res) => {
  let {text, floatingNumber} = req.body
  let cs = await req.db.css.findOne({
    s: text,
    m: floatingNumber
    
  })
});

module.exports = {
  router,
  path: "/",
};






