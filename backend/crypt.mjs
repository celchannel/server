import { EncryptJWT, SignJWT } from "jose";
import { createHmac, randomUUID } from "node:crypto"
import { TextEncoder } from "node:util";

const secret = new TextEncoder().encode(process.env.NODE_JWT); // To convert in Uint8Array

/**
 *
 * @param {String} str
 * @returns {String}
 */
export async function getJwt(str)
{
	return (await new SignJWT({ "name": str, time: Date.now() })
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.sign(secret));
}

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
