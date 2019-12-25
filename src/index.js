// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 8080

const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")

// Require:
const postmark = require("postmark")

// Send an email:
const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY)

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

app.use(cors())

app.get("/", (req, res) => {
  res.send(
    "This is a basic express app to sign up to a newsletter. Pass an email to /register to sign up"
  )
})

// This endpoint is for testing purposes only!
app.post("/register", async (req, res) => {
  const { email } = req.body

  if (!email) {
    throw Error("No email address provided")
    res.status(400).send("No email address provided")
  }

  try {
    await client.sendEmail({
      From: "info@fillmydiary.co.uk",
      To: "jack@noface.co.uk",
      Subject: "Test",
      TextBody: "Hello from Postmark!",
    })
  } catch (err) {
    throw Error(err)
    res.status(400).send(err)
  }

  res
    .status(200)
    .send(`You've signed up to the Celtic Elements newsletter with ${email}`)
})

app.listen(port, () => {
  console.log("Our app is running on http://localhost:" + port)
})
