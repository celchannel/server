class Stat
{
	constructor ()
	{
		this.entryPointCall = new Map();
	}

	async sendEntryPoint(entryPoint)
	{
		const entryContent = this.entryPointCall.get(entryPoint);
		if (entryContent != undefined)
			this.entryPointCall.set(entryPoint, entryContent + 1);
		else
			this.entryPointCall.set(entryPoint, 1);
	}

	async getAllEntryPoint()
	{
		const entryPointResult = {};

		for (const [el, key] of this.entryPointCall)
			entryPointResult[el] = key;
		return (entryPointResult);
	}
}

export const stat = new Stat();
