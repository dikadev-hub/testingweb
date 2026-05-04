const Parse = require('parse/node');

Parse.initialize(
    "Y0f6hqTsxzNapkFRzIKO6b9pGENY8ewx3HMZu72k", 
    "Y4R6Q4AwyZBfGppAeaXDfvfW8MNvIwhdHEJ7KoIc",
    "QKhrsQmDyp2sSEosdc78N8AbJxzbYZFzEyiWc1nl"
);
Parse.serverURL = 'https://parseapi.back4app.com/';

export default async function handler(req, res) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'unauthorized' });

    try {
        const user = await Parse.User.become(token);
        return res.status(200).json({
            success: true,
            fullname: user.get('fullname'),
            email: user.get('email'),
            apiKey: user.get('apiKey')
        });
    } catch (e) {
        return res.status(401).json({ message: 'invalid session' });
    }
}
