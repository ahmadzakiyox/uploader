// server.js

const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// Konfigurasi Multer untuk penyimpanan file
const storage = multer.diskStorage({
    // Menentukan folder tujuan untuk menyimpan file
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    // Menentukan nama file yang akan disimpan
    filename: function (req, file, cb) {
        // Buat nama unik: timestamp + nama asli file
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Middleware untuk menyajikan file statis dari folder 'uploads'
// Ini agar file yang di-upload bisa diakses dari browser
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route untuk menyajikan halaman HTML utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route untuk menangani proses upload file
// 'fileSaya' adalah nama dari input <input type="file" name="fileSaya"> di HTML
app.post('/upload', upload.single('fileSaya'), (req, res) => {
    if (!req.file) {
        // Jika tidak ada file yang di-upload
        return res.status(400).json({ error: 'Tidak ada file yang di-upload.' });
    }

    // Jika berhasil, kirim kembali URL publik dari file tersebut
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({
        message: 'File berhasil di-upload!',
        url: fileUrl
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
