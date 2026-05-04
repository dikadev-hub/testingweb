const Parse = require('parse/node');
const crypto = require('crypto');

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

    const { name, email, phone, pass } = req.body;

    if (!name || !email || !phone || !pass) {
        return res.status(400).json({ message: "kak, semua data wajib di isi ya jangan ada yang kosong" });
    }

    const apiKey = "sk-" + crypto.randomBytes(16).toString('hex');

    const user = new Parse.User();
    user.set("username", email);
    user.set("email", email);
    user.set("password", pass);
    user.set("fullname", name);
    user.set("phone", phone);
    user.set("apiKey", apiKey);

    try {
        await user.signUp(null, { useMasterKey: true });
        return res.status(200).json({ success: true, message: "berhasil buat akun kak" });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}
