import express, { json } from "express";
import { getJwt, hashKey } from "./crypt.mjs";
import { STATUS } from "./utils.mjs";
import { Checker } from "./checker.mjs";
import { DbGet, DbPush } from "./db.mjs";

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
			await DbPush.User(username, hashPassword, token);
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

function getHeaderToken(req)
{
	const authorization = req.header("Authorization");
	if (!authorization)
		throw "the token is needed";
	const tab = authorization.split(" ");
	if (tab.length != 2 || tab[0] != "Bearer")
		throw "Authorization header bad format (Authorization: Bearer YOURTOKEN)"
	return (tab[1]);
}

async function getUserWithToken(token)
{
	try
	{
		const user = await DbGet.user({token: token});
		if (!user)
			throw null;
		return (user);
	}
	catch (err)
	{
		console.log(err);
		throw "Invalide token";
	}
}

app.post("/api/death/", async (req, res) => {
	try
	{
		const { AreaSID, LevelName, Side, GoldenBerry, PositionX, PositionY } = req.body;
		const token = getHeaderToken(req);
		if (!AreaSID || !LevelName || !Side || !GoldenBerry || !PositionX || !PositionY)
			throw "Bad argment: AreaSID, LevelName, Side, GoldenBerry, PositionX, PositionY is needed"
		Checker.AreaSID(AreaSID);
		Checker.LevelName(LevelName);
		Checker.Side(Side);
		Checker.GoldenBerry(GoldenBerry);
		Checker.Position(PositionX, 'X');
		Checker.Position(PositionY, 'Y');
		Checker.token(token);
		const AuthorId = (await getUserWithToken(token)).id;
		const LevelNameBase64 = btoa(LevelName);
		try
		{
			await DbPush.Death(AreaSID, LevelNameBase64, Side, GoldenBerry, PositionX, PositionY, AuthorId);
			//await DbPush.newUser(username, hashPassword, token);
			res.json({success: "Death save"});
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
