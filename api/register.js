const Parse = require('parse/node');

Parse.initialize("y0f6hqtsxznapkfrziko6b9pgeny8ewx3hmzu72k", "f2bhfcielmpg5fsqhdcmsgxjhc95zdmnr1fcckrt");
Parse.serverURL = 'https://parseapi.back4app.com/';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'method not allowed' });
    }

    const { name, email, phone, pass } = req.body;

    if (!name || !email || !phone || !pass) {
        return res.status(400).json({ message: "kak, semua data wajib di isi ya jangan ada yang kosong" });
    }
    
    if (pass.length < 6) {
        return res.status(400).json({ message: "maaf kak, pasword harus 6 digit" });
    }

    const user = new Parse.User();
    user.set("username", email);
    user.set("email", email);
    user.set("password", pass);
    user.set("fullname", name);
    user.set("phone", phone);

    try {
        await user.signUp();
        return res.status(200).json({ success: true, message: "berhasil buat akun kak, sabar ya otomatis ke halaman dashboard kok" });
    } catch (e) {
        if (e.code === 202 || e.code === 203) {
            return res.status(400).json({ message: "yah email nya udah di pake orang lain" });
        }
        return res.status(500).json({ message: "yah ada yang error kak" });
    }
}
