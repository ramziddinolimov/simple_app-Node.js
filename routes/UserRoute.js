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
  const users = await req.db.collection("users")
  let user = await users.findOne({
    email: email.toLowerCase(),
  });

  if (user) {
    res.render("index", {
      error: "Email already exists",
    });
    return;
  }

  user = await users.insertOne({
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
  const users = await req.db.collection("users")
  let user = await users.findOne({
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



router.get("/profile", AuthUserMiddleware, async (req, res) => {
  const incoming = await req.db.collection("incoming")
  const outcoming = await req.db.collection("outcoming")
  let outcoming1 = await outcoming.find().toArray()
  let incoming1 = await incoming.find().toArray()

  let y=0 
  outcoming1.forEach(i => {
    y+=Number(i.floatingNumber)
  });
  let x=0 
  incoming1.forEach(e => {
    x+=Number(e.number)
  });
  res.render("profile", {
    incoming1,
    outcoming1,
    x,
    y
  });
});


router.post("/incoming", async (req, res) => {
  const incoming = await req.db.collection("incoming")
    incoming.insertOne(req.body)
    res.redirect("/profile")
    

  });

  




router.post("/outcoming", async (req, res) => {
  const outcoming = await req.db.collection("outcoming")
   await outcoming.insertOne(req.body)
   res.redirect("/profile")

});

module.exports = {
  router,
  path: "/",
};






