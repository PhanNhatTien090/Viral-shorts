// Test script to verify cache functionality
const http = require('http');

function testCacheHit() {
    const data = JSON.stringify({
        topic: 'trứng gà',
        vibe: 'humorous',
        platform: 'tiktok'
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/generate',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let responseData = '';

            console.log('\n=== Response Started ===');
            console.log('Status:', res.statusCode);
            console.log('Headers:', res.headers);

            res.on('data', (chunk) => {
                const chunkStr = chunk.toString();
                console.log('Received chunk:', chunkStr.substring(0, 100));
                responseData += chunkStr;
            });

            res.on('end', () => {
                console.log('\n=== Response Complete ===');
                console.log('Total length:', responseData.length);
                console.log('X-Cache-Status:', res.headers['x-cache-status']);

                if (responseData.length > 0) {
                    console.log('\n=== First 500 chars ===');
                    console.log(responseData.substring(0, 500));

                    const lines = responseData.split('\n').filter(l => l.trim());
                    console.log(`\nTotal lines: ${lines.length}`);
                    lines.slice(0, 5).forEach((line, i) => {
                        console.log(`Line ${i}:`, line.substring(0, 150));
                    });
                } else {
                    console.log('⚠️ Empty response!');
                }

                resolve(responseData);
            });
        });

        req.on('error', (error) => {
            console.error('Request Error:', error.message);
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

console.log('Testing cache hit for "trứng gà"...\n');
testCacheHit()
    .then(() => {
        console.log('\n✅ Test completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    });
