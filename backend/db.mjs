import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export class DbGet {
	constructor() {}

	static async user(obj)
	{
		let result = null;
		if (obj.username)
			result = await db.user.findUnique({
				where: {
					name: obj.username
				}
			});
		else if (obj.token)
			result = await db.user.findUnique({
				where: {
					token: obj.token
				}
			});
		return (result);
	}
}
