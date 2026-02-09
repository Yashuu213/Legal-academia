const axios = require('axios');

const BASE_URL = 'https://legal-academia-server.onrender.com';

const diagnose = async () => {
    console.log(`🔍 Starting Diagnostic for: ${BASE_URL}`);
    console.log('------------------------------------------------');

    // 1. Check Root Endpoint (Server Reachability)
    try {
        console.log('1️⃣ Testing Server Root (GET /)...');
        const res = await axios.get(BASE_URL);
        console.log(`   ✅ Status: ${res.status}`);
        // console.log(`   📄 Body: ${res.data}`);
    } catch (err) {
        console.log(`   ❌ Failed: ${err.message}`);
        if (err.response) console.log(`   Status: ${err.response.status}`);
    }

    // 2. Check API Endpoint (DB Connection)
    try {
        console.log('\n2️⃣ Testing API Endpoint (GET /api/updates)...');
        const res = await axios.get(`${BASE_URL}/api/updates`);
        console.log(`   ✅ Status: ${res.status}`);
        console.log(`   📦 Data Length: ${Array.isArray(res.data) ? res.data.length : 'Not Array'}`);
        console.log('   ✅ Database seems connected!');
    } catch (err) {
        console.log(`   ❌ Failed: ${err.message}`);
        if (err.response) {
            console.log(`   Status: ${err.response.status}`);
            console.log(`   Body: ${JSON.stringify(err.response.data)}`);
            if (err.response.status === 500) {
                console.log('   🚨 Server Error (500) -> Likely Database Connection Failed');
            } else if (err.response.status === 404) {
                console.log('   ❓ 404 Not Found -> Route URL might be wrong');
            }
        }
    }

    // 3. Check CORS Headers (Simulate Frontend Request)
    try {
        console.log('\n3️⃣ Testing CORS (OPTIONS /api/updates)...');
        const res = await axios.options(`${BASE_URL}/api/updates`, {
            headers: {
                'Origin': 'https://legal-academia-student.onrender.com',
                'Access-Control-Request-Method': 'GET'
            }
        });
        console.log(`   ✅ Status: ${res.status}`);
        console.log(`   allowed-origin: ${res.headers['access-control-allow-origin']}`);
        console.log(`   allowed-methods: ${res.headers['access-control-allow-methods']}`);
    } catch (err) {
        console.log(`   ❌ CORS Check Failed: ${err.message}`);
    }
};

diagnose();
