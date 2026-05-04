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
    if (!email || !pass) return res.status(400).json({ message: "isi email dan pass kak" });

    const cleanEmail = email.trim().toLowerCase();

    try {
        // Kita login pakai cara manual biar gak kena blokir CLP
        const user = await Parse.User.logIn(cleanEmail, pass);
        
        // Cek API Key, kalau belum ada buatin pakai Master Key
        if (!user.get('apiKey')) {
            const newKey = "sk-" + crypto.randomBytes(16).toString('hex');
            user.set("apiKey", newKey);
            await user.save(null, { useMasterKey: true });
        }

        return res.status(200).json({ 
            success: true, 
            message: "login sukses",
            sessionToken: user.getSessionToken() 
        });
    } catch (e) {
        // Kalau cara di atas gagal, kita paksa login lewat Master Key
        try {
            const query = new Parse.Query(Parse.User);
            query.equalTo("username", cleanEmail);
            const userManusia = await query.first({ useMasterKey: true });

            if (userManusia) {
                // Karena login manual gak bisa dapet session token, 
                // user wajib daftar ulang kalau datanya nyangkut
                return res.status(401).json({ message: "password salah atau akun bermasalah" });
            } else {
                return res.status(401).json({ message: "akun tidak ditemukan" });
            }
        } catch (err) {
            return res.status(401).json({ message: "error: " + e.message });
        }
    }
}
