
const mongoose = require('mongoose');
const School = require('./backend/models/School');
require('dotenv').config({ path: './backend/.env' });

async function checkData() {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smp-pgri';
        console.log(`Connecting to ${mongoUri}...`);
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

        const school = await School.findOne();
        if (school) {
            console.log("=== SCHOOL DATA FOUND ===");
            console.log(JSON.stringify(school.about, null, 2));
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
