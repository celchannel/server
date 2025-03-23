import { createHmac, randomUUID } from "node:crypto"

/**
 *
 * @param {String} pass
 * @returns {String}
 */
export function hashKey(pass)
{
	return (createHmac("sha256", process.env.NODE_ENC_PASS).update(pass).digest('hex'));
}

/**
 *
 * @param {String} pass
 * @param {String} key
 * @returns {Boolean}
 */
export function verifyKey(pass, key)
{
	return (hashKey(pass) === key);
}
