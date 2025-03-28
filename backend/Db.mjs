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

	static async death(AreaSID, LevelName, Side, howMany)
	{
		return (await db.death.findMany({
			orderBy: {
				id: "desc"
			},
			where: {
				AreaSID: AreaSID,
				LevelName: LevelName,
				Side: Side
			},
			take: howMany
		}));
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
	static async User(username, password, token)
	{
		const user = await db.user.create({
			data:
			{
				name: username,
				password: password,
				token: token
			}
		});
		console.log(user);
	}

	static async Death(AreaSID, LevelName, Side, GoldenBerry, PositionX, PositionY, AuthorId)
	{
		const death = await db.death.create({
			data:
			{
				AreaSID: AreaSID,
				LevelName: LevelName,
				Side: Side,
				GoldenBerry: GoldenBerry,
				PositionX: PositionX,
				PositionY: PositionY,
				AuthorId: AuthorId
			}
		});
		console.log(death);
	}
}
