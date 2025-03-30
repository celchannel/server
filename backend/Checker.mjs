import { DbGet } from "./Db.mjs";
import { SEBadRequest } from "./Error.mjs";
import { isAlnum, isToken } from "./utils.mjs";

export class Checker {

	static Tstring(any, arg)
	{
		if (typeof any != "string")
			throw new SEBadRequest(`The ${arg} must be a string`);
	}

	static Tnumber(any, arg)
	{
		if (typeof any != "number")
			throw new SEBadRequest(`The ${arg} must be a number`);
	}

	/**
	 *
	 * @param {string} str
	 */
	static username(str)
	{
		if (typeof str != "string")
			throw new SEBadRequest ("The username must be a string");
		if (!(str && str.length >= 3 && str.length <= 40 && isAlnum(str)))
			throw new SEBadRequest ("The username must be between 3 and 20 characters long and must be composed exclusively of letters and numbers, with the exception of the following characters: _-");
	}

	/**
	 *
	 * @param {string} str
	 */
	static password(str)
	{
		if (typeof str != "string")
			throw new SEBadRequest("The password must be a sting");
		if (!(str && str.length >= 5 && str.length <= 250))
			throw new SEBadRequest("The username must be between 5 and 250 characters long");
	}

	/**
	 *
	 * @param {string} str
	 * @returns {object | null}
	 */
	static async duplicateUsername(str)
	{
		if (await DbGet.user({username: str}))
			throw new SEBadRequest("The pseudo is already in use, change the pseudo");
	}

	/**
	 *
	 * @param {string} str
	 * @returns {object | null}
	 */
	static async duplicateToken(str)
	{
		if (await DbGet.user({token: str}))
			throw new SEBadRequest("Wait what bro 🗿🗿🗿");
	}

	/**
	 *
	 * @param {number} nbr
	 */
	static AreaSID(nbr)
	{
		this.Tnumber(nbr, "AreaSID");
		if (!(nbr >= 0 && nbr <= 9))
			throw new SEBadRequest("AreaSID must be between 0 and 9");
	}

	/**
	 *
	 * @param {string} str
	 */
	static LevelName(str)
	{
		this.Tstring(str, "LevelName");
		if (!(str.length >= 1 && str.length <= 100))
			throw new SEBadRequest("LevelName must be between 1 and 100 characters");
	}

	/**
	 *
	 * @param {string} str
	 */
	static Side(str)
	{
		this.Tstring(str, "Side");
		str = str.toUpperCase();
		if (!(str.length == 1 && (str == 'A' || str == 'B' || str == 'C')))
			throw new SEBadRequest("LevelName must be a characters (a | A | b | B | c | C)");
	}

	/**
	 *
	 * @param {boolean} bool
	 */
	static GoldenBerry(bool)
	{
		if (typeof bool != "boolean")
			throw new SEBadRequest("GoldenBerry must be a boolean");
	}

	/**
	 *
	 * @param {number} nbr
	 * @param {string} dir
	 */
	static Position(nbr, dir)
	{
		this.Tnumber(nbr, "Position" + dir);
	}

	static token(str)
	{
		this.Tstring(str, "token");
		if (!(str.length >= 1 && str.length <= 500 && isToken(str)))
			throw new SEBadRequest("Invalide token");
	}

	static undefined(...args)
	{
		for (const arg of args)
		{
			if (arg == undefined)
				return (true);
		}
		return (false);
	}

	static userAdmin(user)
	{
		if (user.rank != "ADMIN")
			throw new SEBadRequest("Admin account is needed");
	}
}
