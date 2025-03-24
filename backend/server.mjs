import express, { json } from "express";
import { getJwt, hashKey } from "./crypt.mjs";
import { STATUS } from "./utils.mjs";
import { Checker } from "./checker.mjs";
import { DbPush } from "./db.mjs";

const HOSTNAME = "0.0.0.0";
const PORT = 6900;

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
		const hashPassword = hashKey(password);
		await Checker.duplicateUsername(username);
		const token = await getJwt(username); // TODO check if throw error return an ise
		await Checker.duplicateToken(token);
		try
		{
			await DbPush.newUser(username, hashPassword, token);
			res.json({success: "Account create", AccessToken: token});
		}
		catch (err)
		{
			console.error(err);
			res.status(STATUS.ise).json({error: "Internal Server Error"}); // TODO log data more information (fonction use and other)
	}
	}
	catch (err)
	{
		res.status(STATUS.bad_request).json({error: err});
	}
});

app.listen(PORT, HOSTNAME, (err) => {
	if (err)
		console.error(err);
	console.log(`server starting to http://${HOSTNAME}:${PORT}/`);
});
