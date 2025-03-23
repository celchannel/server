import express, { json } from "express";
import { getJwt, hashKey } from "./crypt.mjs";
import { PrismaClient } from "@prisma/client";
import { STATUS } from "./utils.mjs";
import { Checker } from "./checker.mjs";

const HOSTNAME = "0.0.0.0";
const PORT = 6900;

const db = new PrismaClient();

const app = express();

app.use(express.json({limit: "10000kb"}))

app.get("/", (req, res) => {
	res.json("success: hello");
	res.end()
})

app.get("/api/hello/", (req, res) => {
	res.json("success: hello");
})

// TODO check data for sql request and verify content
app.post("/api/createaccount/", async (req, res) => {
	try
	{
		const username = req.body.username;
		const password = req.body.password;
		if (!username || !password)
			throw "Pseudo and password is needed";
		Checker.username(username);
		Checker.password(password);
		

	}
	catch (err)
	{
		res.status(STATUS.bad_request).json({error: err});
		return ;
	}
	console.log("username:", req.body.username);
	console.log("password", hashKey(req.body.password));
	try
	{
		const user = await db.user.create({
			data: {
				name: req.body.username,
				password: hashKey(req.body.password),
				token: await getJwt(req.body.username)
			}
		});
		console.log("user create:", user);
	}
	catch (err)
	{
		console.error(err);
	}
	res.json("success: info registered");
});

app.listen(PORT, HOSTNAME, (err) => {
	if (err)
		console.error(err);
	console.log(`server starting to http://${HOSTNAME}:${PORT}/`);
});
