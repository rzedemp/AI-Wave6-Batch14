import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import express, { text } from "express";
import multer from "multer";
import fs from "fs/promises";
import cors from "cors";

const app = express();
const upload = multer();
const ai = new GoogleGenAI({});

// inisialisasi model AI
const geminiModels = {
    text: "gemini-2.5-flash-lite",
    image: "gemini-2.5-flash",
    audio: "gemini-2.5-flash",
    document: "gemini-2.5-flash-lite"
};

//inisialisasi aplikasi back-end/server
app.use(cors()); //.use() --> panggil/bikin middlewaare
// app.use(() => {}); // --> pakai middleware sendiri
app.use(express.json()); // --> untuk membolehkan kita menggunakan 'Contetn-Type: application/json' di header

// inisialisasi route-nya
// .get(), .post(), .put(). patch(), .delete() -> yang paling umum dipakai
// .options() --> lebih jarang dpakai, karena ini lebih ke preflight (untuk CORS umumnya)

app.post("/generate-text", async (req, res) => {
    // handle bagaimana request diterima oleh user
    const { body } = req;

    // guard clause --> satpam
    if (!body) {
        //jika body-nya tidak ada isinya
        res.status(400).send("Tidak ada payload yang dikirim!");
        return;
    }

    // satpam untuk cek tipe data dari body-nya
    // req.body = [] // typeof --> object; Array.isArray(isi) // true
    // req.body = {} // typeof --> object; Array.isArray(isi) // false
    if (typeof body !== 'object') {
        res.status(400).send("Tipe payload-nya tidak sesuai!");
        return;
    }

    const { message } = body;

    if (!message || typeof message !== 'string') {
        res.status().send("Pesan tidak ada atau ormat-nya tidak sesuai.");
        return;
    }

    // logic dimulai di sini

    const response = await ai.models.generateContent({
        contents: message,
        model: geminiModels.text,
    });

    res.status(200).json({
        reply: response.text
    });
});

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);
// }

// await main();

// panggil si app-nya di sini
const port = 3000;

app.listen(port, () => {
    console.log("LOVE YOU", port);
});