
const mongoose = require('mongoose');
const School = require('./models/School');
require('dotenv').config();

async function checkData() {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smp-pgri';
        console.log(`Connecting to ${mongoUri}...`);
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

        const school = await School.findOne();
        if (school) {
            console.log("=== SCHOOL DATA FOUND ===");
            console.log("Nama Kepsek:", school.about.sambutan.namaKepsek);
            console.log("Foto Kepsek:", school.about.sambutan.fotoKepsek); // Check this specific field
        } else {
            console.log("No school data found.");
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkData();
