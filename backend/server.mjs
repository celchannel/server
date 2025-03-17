import { createServer } from 'node:http';

const hostname = "0.0.0.0";
const port = 6900;

const ctype = "application/json";

async function serverEntrys(req, res)
{
	res.setHeader("Content-Type", ctype);
	res.statusCode = 200;
	res.on("error", console.error);
	res.end(JSON.stringify(`hello boders`));
}

async function main()
{
	try
	{
		process.once("SIGTERM", async (signalCode) => {
			await client.end();
			process.exit(0);
		})
	}
	catch (err)
	{
		console.error(err);
	}

	const server = createServer(serverEntrys);
	server.listen(port, hostname, () => {
		console.log(`Server running at http://${hostname}:${port}/`);
	});
}

main();
