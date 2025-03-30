class ServerError
{
	constructor (status, message)
	{
		this.status = status;
		this.message = message;
	}

	async exec(res)
	{
		res.status(this.status).json({error: this.message});
	}
}
