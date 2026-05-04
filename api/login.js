const Parse = require('parse/node');

Parse.initialize(
    "Y0f6hqTsxzNapkFRzIKO6b9pGENY8ewx3HMZu72k", 
    "Y4R6Q4AwyZBfGppAeaXDfvfW8MNvIwhdHEJ7KoIc",
    "QKhrsQmDyp2sSEosdc78N8AbJxzbYZFzEyiWc1nl"
);
Parse.serverURL = 'https://parseapi.back4app.com/';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'method not allowed' });
    }

    const { email, pass } = req.body;

    if (!email || !pass) {
        return res.status(400).json({ message: "kak, email dan password wajib di isi ya" });
    }

    try {
        const user = await Parse.User.logIn(email, pass);
        return res.status(200).json({ 
            success: true, 
            message: "berhasil masuk kak, tunggu bentar ya",
            sessionToken: user.getSessionToken() 
        });
    } catch (e) {
        return res.status(400).json({ message: "yah ada yang error kak, email atau password salah" });
    }
}
