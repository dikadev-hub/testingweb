const Parse = require('parse/node');
const crypto = require('crypto');

Parse.initialize(
    "Y0f6hqTsxzNapkFRzIKO6b9pGENY8ewx3HMZu72k", 
    "Y4R6Q4AwyZBfGppAeaXDfvfW8MNvIwhdHEJ7KoIc",
    "QKhrsQmDyp2sSEosdc78N8AbJxzbYZFzEyiWc1nl"
);
Parse.serverURL = 'https://parseapi.back4app.com/';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'method not allowed' });

    const { email, pass } = req.body;
    if (!email || !pass) return res.status(400).json({ message: "email/pass kosong" });

    const cleanEmail = email.trim().toLowerCase();

    try {
        // Parse login default nyari ke kolom 'username'
        const user = await Parse.User.logIn(cleanEmail, pass);
        
        if (!user.get('apiKey')) {
            const newKey = "sk-" + crypto.randomBytes(16).toString('hex');
            user.set("apiKey", newKey);
            await user.save(null, { useMasterKey: true });
        }

        return res.status(200).json({ 
            success: true, 
            sessionToken: user.getSessionToken() 
        });
    } catch (e) {
        // Error 101 di Parse itu 'Invalid username/password' (Akun tidak ditemukan)
        return res.status(401).json({ message: "login gagal: " + e.message });
    }
}
