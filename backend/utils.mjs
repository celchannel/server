export const STATUS = Object.freeze({
	success: 200,
	bad_request: 400,
	page_not_found: 404,
	ise: 500,
});

export function isAlnum(str)
{
	// /i ignore case (in this case equale to [a-zA-Z0-9])
	// ^ begin start string
	// + checheck last caracter match with regex
	// $ check all string to the end
	return (String(str).match(/^[a-zA-Z0-9_-]+$/g));
}
