import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export class DbGet
{
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

export class DbPush
{
	/**
	 *
	 * @param {String} username
	 * @param {String} password
	 * @param {String} token
	 */
	static async newUser(username, password, token)
	{
		if (!username || !password || !token)
			throw "Bad arguments";
		const user = await db.user.create({
			data: {
				name: username,
				password: password,
				token: token
			}
		});
		console.log(user);
	}
}
