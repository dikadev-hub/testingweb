import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

const serviceAccount = {
  "type": "service_account",
  "project_id": "market-d978f",
  "private_key_id": "c3f704d6417f42c227d7b29e2904d312edee04de",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQChdV0870xlTHam\nZVmjXFxAniJ43geLc6YrgygXUNVpgeYuSeJAFrpQML2FC3L1/qkIILUoe819PPoB\nC17oE2tz+LEOYhjh6xbI/4SwxEqU5lxdH3zZQcLv62039M8BixO6uj/L7GvRwpbY\nJxmk7f/R6KXD3IzfGEcSfFQSOm6wNk3KDwOXzypMlDz/3gt6joOEEMbR5Wh50/ZZ\nUgDd7rFll58drWwt79m+xdqfhUmbCBU5Hx2fayHx4wrdyCxigad8wkkDKnQ/ZoKg\nwa17qda65pwogboMsqGB1AhFFHGYcVfnFuv0J8/oPR1vgzOzE2sAfNfydEnR4nB/\nHDRVN/SHAgMBAAECggEAC56IROACbcZ7QhhIbiLcb2Ncnw7OGNwMGP+JqBE6JStN\npwZ20Mk8mT7DX3VmeDYzxeZMreAoS/Cnxowh8AOjF6fNs3edy3cBScURsILqdx1o\n3OQXi68EL1iQS0GZOsbedvFRBq+PRtDWeDHAJ7K1AU8udrztf7Sd5heqboa5USxJ\n/NZ16/948kvYFXcmt5c9pu0SV6ot00jJFqpoab5mpAXlW2hdvvHLUgaEs7DcoH0a\n+nK8af4CKRGlTgrMdJgNUUXobsfQ8C1MUqugP5v19aHn5OsuEEBf3Bmd3b/LWXQN\n74jaqapk/2UwsiJIVTIkc0H6so+nRMVrrFVXoUeQ4QKBgQDUOo8QVovvimFtloDN\nTTsP6MgxLcbrZAiaQerNMDk9pUCs5sfLyfNOH2Z799C+8/mUWchYe7XYHyuKa6oU\RQ/4aXxVBbwdTrZ6oupYbSW2Do8g7J2ytz65I1GLRgSi9DAt4NMX0CO0b17ngi6T\n1nBs2fVtYoFrLCacm4cKxCEONwKBgQDCwjDJokZYNW1SJ2uGzIMF/TycQmfm8Oxu\njuGm7HdIA+gRm5Bvha7NhxBobqB+yFOOxis1kSYXREMIr6DvWRHUyCgGXxWXAicc\nfikZf9cbrvj4aXH9DTN9cvceWWtVyLVa+H1IJNO+l+M3rr9d54oGfOHiaw5KQrDI\n63hus/+kMQKBgEef88SJ0PRo+XSoxJOFKxe1ckrWrjmnKxgUgw/45HifmvI/eNKY\nN5r4EfhorHSllmew3WKvbbGg42r15xKsNDWcNC/lnZUuiXteHET3oTCOPVPZR2eX\XH3TI6QjX1E3pEL3i4aP4lz08UykrN+MEalK7f+arR7kaauU+cBybM2FAoGBALBa\nBLFfxlCzOCVO2pe58d5new2HN+wvNfe6W2u57RyBpQ7kjTnek/U5GstleOC0Zqz+\nljuwDgy9W/GujoyMW5AQGeYDDVqqsV2kg3S6hL5lhr3xRS09WeV7R3bswztvPYB9\nR3wfFLkdcbqG+nN+aEYNqMBL7imiD9AvH+MmDBLRAoGBAL0hfPXxqKQnS8QVSBwu\ntuMoY+fYT6SzF3BQZCWzPCQHhgHwNvHtfCySnzAKMyEwESxfpUZw+vQ9fgZ7fEHG\nJ6EjmfIgAEX4R/aFD9T/EhAN0wP3P6/9Y7AAf6WZgExgDuMmoHlK/OPlKma6u5S/\niqSmBlTYfDp0Hx+xgrjbabg9\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@market-d978f.iam.gserviceaccount.com",
  "client_id": "114270783947407402507",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40market-d978f.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
        databaseURL: "https://market-d978f-default-rtdb.asia-southeast1.firebasedatabase.app"
    });
}

const db = getDatabase();

export default async function handler(req, res) {
    const { key } = req.query;

    if (req.method !== 'GET') {
        return res.status(405).json({ status: false, message: "metode tidak diizinkan" });
    }

    if (!key) {
        return res.status(400).json({ status: false, message: "masukkan api key" });
    }

    try {
        const snapshot = await db.ref('users').orderByChild('apiKey').equalTo(key).once('value');

        if (!snapshot.exists()) {
            return res.status(404).json({ status: false, message: "api key salah" });
        }

        let userData = {};
        snapshot.forEach(child => { userData = child.val(); });

        res.status(200).json({
            status: true,
            data: {
                username: userData.fullname,
                phone: userData.phone,
                role: userData.role || "user",
                apiKey: userData.apiKey
            }
        });
    } catch (error) {
        res.status(500).json({ status: false, message: "server error" });
    }
}
