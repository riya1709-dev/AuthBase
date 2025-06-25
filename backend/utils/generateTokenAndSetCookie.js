const jwt= require('jsonwebtoken')
const generateTokenAndSetCookie = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	console.log("Generated Token:", token);

	res.cookie("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", 
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	// Log to check if res.cookie() is being executed
	console.log("Cookie Set:", res.getHeaders()["set-cookie"]);

	return token;
};


module.exports= generateTokenAndSetCookie