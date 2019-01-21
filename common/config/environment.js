module.exports = {
    "port": 3600,
    "appEndpoint": "http://192.168.50.253:3600",
    "apiEndpoint": "http://192.168.50.253:3600",
    "jwtSecret": "teamsupersecret",
    "cookieSecret": "cookiesupersecret",
    "jwtExpiration": 3600000,
    "refreshExpiration": 360000000,
    "saltRounds": 10,
    "environment": "dev",
    "permissionLevels": {
        "NORMAL_USER": 1,
        "SPECIAL_USER": 4,
        "ADMIN": 7
    }
}