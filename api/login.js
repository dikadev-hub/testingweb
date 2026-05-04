const Parse = require('parse/node');

Parse.initialize(
    "Y0f6hqTsxzNapkFRzIKO6b9pGENY8ewx3HMZu72k", 
    "Y4R6Q4AwyZBfGppAeaXDfvfW8MNvIwhdHEJ7KoIc",
    "QKhrsQmDyp2sSEosdc78N8AbJxzbYZFzEyiWc1nl"
);
Parse.serverURL = 'https://parseapi.back4app.com/';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

    const { email, pass } = req.body;

    try {
        // Proses login standar
        const user = await Parse.User.logIn(email.trim().toLowerCase(), pass);
        
        // Jika berhasil, kirim session token
        return res.status(200).json({ 
            success: true, 
            sessionToken: user.getSessionToken() 
        });
    } catch (e) {
        // Jika error "unauthorized", biasanya karena password salah atau CLP terkunci
        return res.status(401).json({ message: "Gagal: " + e.message });
    }
}
