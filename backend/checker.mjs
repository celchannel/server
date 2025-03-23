import { isAlnum } from "./utils.mjs";

export class Checker {
	constructor()
	{
	}

	/**
	 *
	 * @param {String} str
	 */
	static username(str)
	{
		if (!(str && str.length >= 3 && str.length <= 40 && isAlnum(str)))
			throw "The username must be between 3 and 20 characters long and must be composed exclusively of letters and numbers, with the exception of the following characters: _-";
	}

	/**
	 *
	 * @param {String} str
	 */
	static password(str)
	{

		if (!(str && str.length >= 5 && str.length <= 250))
			throw "The username must be between 5 and 250 characters long";
	}
}
