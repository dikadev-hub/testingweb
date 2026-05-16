import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

const serviceAccount = {
  "type": "service_account",
  "project_id": "market-d978f",
  "private_key_id": "c3f704d6417f42c227d7b29e2904d312edee04de",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQChdV0870xlTHam\nZVmjXFxAniJ43geLc6YrgygXUNVpgeYuSeJAFrpQML2FC3L1/qkIILUoe819PPoB\nC17oE2tz+LEOYhjh6xbI/4SwxEqU5lxdH3zZQcLv62039M8BixO6uj/L7GvRwpbY\nJxmk7f/R6KXD3IzfGEcSfFQSOm6wNk3KDwOXzypMlDz/3gt6joOEEMbR5Wh50/ZZ\nUgDd7rFll58drWwt79m+xdqfhUmbCBU5Hx2fayHx4wrdyCxigad8wkkDKnQ/ZoKg\nwa17qda65pwogboMsqGB1AhFFHGYcVfnFuv0J8/oPR1vgzOzE2sAfNfydEnR4nB/\nHDRVN/SHAgMBAAECggEAC56IROACbcZ7QhhIbiLcb2Ncnw7OGNwMGP+JqBE6JStN\npwZ20Mk8mT7DX3VmeDYzxeZMreAoS/Cnxowh8AOjF6fNs3edy3cBScURsILqdx1o\n3OQXi68EL1iQS0GZOsbedvFRBq+PRtDWeDHAJ7K1AU8udrztf7Sd5heqboa5USxJ\n/NZ16/948kvYFXcmt5c9pu0SV6ot00jJFqpoab5mpAXlW2hdvvHLUgaEs7DcoH0a\n+nK8af4CKRGlTgrMdJgNUUXobsfQ8C1MUqugP5v19aHn5OsuEEBf3Bmd3b/LWXQN\n74jaqapk/2UwsiJIVTIkc0H6so+nRMVrrFVXoUeQ4QKBgQDUOo8QVovvimFtloDN\nTTsP6MgxLcbrZAiaQerNMDk9pUCs5sfLyfNOH2Z799C+8/mUWchYe7XYHyuKa6oU\RQ/4aXxVBbwdTrZ6oupYbSW2Do8g7J2ytz65I1GLRgSi9DAt4NMX0CO0b17ngi6T\n1nBs2fVtYoFrLCacm4cKxCEONwKBgQDCwjDJokZYNW1SJ2uGzIMF/TycQmfm8Oxu\njuGm7HdIA+gRm5Bvha7NhxBobqB+yFOOxis1kSYXREMIr6DvWRHUyCgGXxWXAicc\nfikZf9cbrvj4aXH9DTN9cvceWWtVyLVa+H1IJNO+l+M3rr9d54oGfOHiaw5KQrDI\n63hus/+kMQKBgEef88SJ0PRo+XSoxJOFKxe1ckrWrjmnKxgUgw/45HifmvI/eNKY\nN5r4EfhorHSllmew3WKvbbGg42r15xKsNDWcNC/lnZUuiXteHET3oTCOPVPZR2eX\XH3TI6QjX1E3pEL3i4aP4lz08UykrN+MEalK7f+arR7kaauU+cBybM2FAoGBALBa\nBLFfxlCzOCVO2pe58d5new2HN+wvNfe6W2u57RyBpQ7kjTnek/U5GstleOC0Zqz+\nljuwDgy9W/GujoyMW5AQGeYDDVqqsV2kg3S6hL5lhr3xRS09WeV7R3bswztvPYB9\nR3wfFLkdcbqG+nN+aEYNqMBL7imiD9AvH+MmDBLRAoGBAL0hfPXxqKQnS8QVSBwu\ntuMoY+fYT6SzF3BQZCWzPCQHhgHwNvHtfCySnzAKMyEwESxfpUZw+vQ9fgZ7fEHG\nJ6EjmfIgAEX4R/aFD9T/EhAN0wP3P6/9Y7AAf6WZgExgDuMmoHlK/OPlKma6u5S/\niqSmBlTYfDp0Hx+xgrjbabg9\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
  "client_email": "firebase-adminsdk-fbsvc@market-d978f.iam.gserviceaccount.com"
};

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
        databaseURL: "https://market-d978f-default-rtdb.asia-southeast1.firebasedatabase.app"
    });
}

const db = getDatabase();

const p1 = "gsk_";
const rawKeys = [
    p1 + "B71OpeISm5H9HSI9x3uAWGdyb3FY5nAJNqaSeusVnPHZbjK3NyXK",
    p1 + "i6V2S8FcqiR5hz0PdPggWGdyb3FYYm1bDPNxOOyqWtAiSZnekbOw",
    p1 + "PCvVdMUthQbvwutBhR9BWGdyb3FYGbLtlNEIVXoXd76RSV7YzHa3"
];

async function getProductData() {
    try {
        const snap = await db.ref('products').once('value');
        if (!snap.exists()) return "kosong";
        
        let list = "";
        const data = snap.val();

        Object.values(data).forEach(p => {
            if (p.nama) {
                list += `produk: ${p.nama}\n`;
                if (p.variants && p.variants.length > 0) {
                    p.variants.forEach(v => {
                        if (v.totalStok > 0) {
                            list += `- varian: ${v.nama} | harga: rp${v.harga.toLocaleString()} | stok: ${v.totalStok}\n`;
                        }
                    });
                } else if (p.stok > 0) {
                    list += `- harga: rp${(p.harga || 0).toLocaleString()} | stok: ${p.stok}\n`;
                }
                list += `kategori: ${p.kategori || 'umum'}\n---\n`;
            }
        });
        return list || "kosong";
    } catch (e) { return "error"; }
}

export default async function handler(req, res) {
    let userQuery = "";

    if (req.method === 'GET') {
        // Jika dibuka langsung dari browser URL (contoh: ?msg=halo)
        const { msg } = req.query;
        userQuery = msg;
        
        if (!userQuery) {
            return res.status(400).json({ 
                status: false, 
                message: "silahkan masukkan pertanyaan di url, contoh: /api/hexa-ai?msg=halo sprei ready?" 
            });
        }
    } else if (req.method === 'POST') {
        // Jika ditembak dari file HTML lama kamu
        const { messages } = req.body;
        userQuery = messages && messages.length > 0 ? messages[messages.length - 1].content : '';
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }

    if (!userQuery) {
        return res.status(400).json({ error: "Query stands empty" });
    }

    try {
        const products = await getProductData();
        
        const sys = `kamu adalah asisten ramah dari dexa elite market.
        tugas: jawab pertanyaan user tentang stok dan harga secara jujur sesuai data.
        gaya bahasa: santai, sopan, awali dengan salam (halo kak/siap kak), dan gunakan huruf kecil semua.
        format: gunakan list/bullet point agar rapi jika menyebutkan produk.
        
        data produk asli (database):
        ${products}
        
        aturan ketat:
        1. sebutkan nama produk, harga, dan stoknya dengan jelas.
        2. jika produk tidak ada di data di atas, jawab "maaf banget kak, untuk produk itu sekarang lagi kosong stoknya".
        3. jangan pernah mengarang harga sendiri.`;

        let groqResponse;
        let success = false;

        for (let i = 0; i < rawKeys.length; i++) {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { 
                    "Authorization": "Bearer " + rawKeys[i], 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [{role: "system", content: sys}, {role: "user", content: userQuery}],
                    temperature: 0.2
                })
            });

            if (response.status === 429) continue;

            if (response.ok) {
                groqResponse = await response.json();
                success = true;
                break;
            }
        }

        if (!success) {
            return res.status(200).json({
                choices: [{ message: { content: "maaf banget kak, server chat lagi penuh antrean." } }]
            });
        }

        // Jika request dari browser (GET), kita rapikan output JSON-nya biar enak dibaca langsung
        if (req.method === 'GET') {
            return res.status(200).json({
                status: true,
                query: userQuery,
                reply: groqResponse.choices[0].message.content
            });
        }

        // Jika request dari HTML (POST), return format asli bawaan Groq
        return res.status(200).json(groqResponse);

    } catch (error) {
        console.error(error);
        return res.status(200).json({
            choices: [{ message: { content: "waduh, server lagi pusing nih kak." } }]
        });
    }
}
