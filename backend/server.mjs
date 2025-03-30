import express, { json } from "express";
import { getJwt, hashKey } from "./crypt.mjs";
import { Checker } from "./Checker.mjs";
import { DbGet, DbPush } from "./Db.mjs";
import { stat } from "./Stat.mjs"
import { SEBadRequest } from "./Error.mjs";

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

async function sendStat(req)
{
	stat.sendEntryPoint(req.route.path);
}

/**
 *
 * @param {string} username
 */
async function getUserWithUsername(username)
{
	const user = await DbGet.user({username: username})
	if (user == null)
		throw new SEBadRequest("Username invalide");
	return (user);
}

// TODO check data for sql request and verify content
app.post("/api/createaccount/", async (req, res) => {
	sendStat(req);
	try
	{
		const { username, password } = req.body;
		if (Checker.undefined(username, password))
			throw new SEBadRequest("Pseudo and password is needed");
		Checker.username(username);
		Checker.password(password);
		const hashPassword = hashKey(password);
		await Checker.duplicateUsername(username);
		const token = await getJwt(username);
		await Checker.duplicateToken(token);
		await DbPush.User(username, hashPassword, token);
		res.json({success: "Account create", AccessToken: token});
	}
	catch (err)
	{
		err.exec(res);
	}
});

// TODO base function


app.post("/api/login/", async (req, res) => {
	sendStat(req);
	try
	{
		const { username, password } = req.body;
		if (Checker.undefined(username, password))
			throw new SEBadRequest("Pseudo and password is needed");
		Checker.username(username);
		Checker.password(password);
		const user = await getUserWithUsername(username);
		res.json({success: "Account found", AccessToken: user.token});
	}
	catch (err)
	{
		err.exec(res);
	}
});

function getHeaderToken(req)
{
	const authorization = req.header("Authorization");
	if (!authorization)
		throw new SEBadRequest("the token is needed");
	const tab = authorization.split(" ");
	if (tab.length != 2 || tab[0] != "Bearer")
		throw new SEBadRequest("Authorization header bad format (Authorization: Bearer YOURTOKEN)");
	return (tab[1]);
}

async function getUserWithToken(token)
{
	const user = await DbGet.user({token: token});
	if (user == null)
		throw new SEBadRequest("Invalide token");
	return (user);
}

app.post("/api/death/", async (req, res) => {
	sendStat(req);
	try
	{
		const { AreaSID, LevelName, Side, GoldenBerry, PositionX, PositionY } = req.body;
		const token = getHeaderToken(req);
		if (Checker.undefined(AreaSID, LevelName, Side, GoldenBerry, PositionX, PositionY))
			throw new SEBadRequest("Bad argment: AreaSID, LevelName, Side, GoldenBerry, PositionX, PositionY is needed");
		Checker.AreaSID(AreaSID);
		Checker.LevelName(LevelName);
		Checker.Side(Side);
		Checker.GoldenBerry(GoldenBerry);
		Checker.Position(PositionX, 'X');
		Checker.Position(PositionY, 'Y');
		Checker.token(token);
		const AuthorId = (await getUserWithToken(token)).id;
		const LevelNameBase64 = btoa(LevelName);
		const USide = Side.toUpperCase();
		await DbPush.Death(AreaSID, LevelNameBase64, USide, GoldenBerry, PositionX, PositionY, AuthorId);
		res.json({success: "Death save"});
	}
	catch (err)
	{
		err.exec(res);
	}
});

const MAX_TABLE_LEN = 500;

app.get("/api/death/:AreaSID/:LevelName/:Side/", async (req, res) => {
	sendStat(req);
	try
	{
		const AreaSID = parseInt(req.params.AreaSID, 10);
		const { LevelName, Side } = req.params;
		Checker.AreaSID(AreaSID);
		Checker.LevelName(LevelName);
		Checker.Side(Side);
		const LevelNameBase64 = btoa(LevelName);
		const USide = Side.toUpperCase();
		let limits = parseInt(req.query.limits, 10);
		limits = (limits < MAX_TABLE_LEN) ? limits : MAX_TABLE_LEN;
		const bigData = await DbGet.death(AreaSID, LevelNameBase64, USide, limits);
		const smallData = [];
		for (const el of bigData)
		{
			smallData.push({
				PositionX: el.PositionX,
				PositionY: el.PositionY,
				GoldenBerry: el.GoldenBerry,
				AuthorId: el.AuthorId,
				Timestamp: el.tm
			});
		}
		res.json({success: "Data get", data:smallData});
	}
	catch (err)
	{
		err.exec(res);
	}
});

app.get("/api/stat/", async (req, res) => {
	sendStat(req);
	try
	{
		const token = getHeaderToken(req);
		Checker.token(token);
		Checker.userAdmin(await getUserWithToken(token));
		res.json(await stat.getAllEntryPoint());
	}
	catch (err)
	{
		err.exec(res);
	}
});

app.listen(PORT, HOSTNAME, (err) => {
	if (err)
		console.error(err);
	console.log(`server starting to http://${HOSTNAME}:${PORT}/`);
});
