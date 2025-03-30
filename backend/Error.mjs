import { STATUS } from "./utils.mjs";

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

export class SEISE extends ServerError
{
	constructor ()
	{
		super(STATUS.ise, "Internal Server Error");
	}
}

export class SEBadRequest extends ServerError
{
	constructor (error)
	{
		super(STATUS.bad_request, error);
	}
}
