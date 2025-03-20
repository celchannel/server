import express from "express";

const app = express();

app.use(express.json({limit: "10000kb"}))
app.get("/", (req, res) => {
	res.json("success: hello");
	res.end()
})
app.get("/api/a/", (req, res) => {
	res.json("success: hello");
})

const HOSTNAME = "0.0.0.0";
const PORT = 6900;

app.listen(PORT, HOSTNAME, (err) => {
	if (err)
		console.error(err);
	console.log(`server starting to http://${HOSTNAME}:${PORT}/`);
});
