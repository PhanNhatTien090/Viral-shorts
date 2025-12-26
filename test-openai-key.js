// Test OpenAI API Key
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.OPENAI_API_KEY;

console.log('\n🔍 OpenAI API Key Diagnostics\n');
console.log('━'.repeat(50));

if (!apiKey) {
  console.log('❌ OPENAI_API_KEY not found in .env.local');
  process.exit(1);
}

console.log('✅ API Key found');
console.log(`📏 Length: ${apiKey.length} characters`);
console.log(`🔤 Starts with: ${apiKey.substring(0, 10)}...`);
console.log(`🔤 Ends with: ...${apiKey.substring(apiKey.length - 6)}`);
console.log(`🎯 Format: ${apiKey.startsWith('sk-proj-') ? '✅ Correct (sk-proj-)' : '❌ Wrong format'}`);

// Check for common issues
const issues = [];
if (apiKey.includes(' ')) issues.push('Contains spaces');
if (apiKey.includes('\n')) issues.push('Contains line breaks');
if (apiKey.includes('\r')) issues.push('Contains carriage returns');
if (apiKey.includes('\t')) issues.push('Contains tabs');

if (issues.length > 0) {
  console.log('\n⚠️  Issues found:');
  issues.forEach(issue => console.log(`   - ${issue}`));
} else {
  console.log('\n✅ No whitespace issues detected');
}

// Test the API key
console.log('\n🧪 Testing API connection...\n');

fetch('https://api.openai.com/v1/models', {
  headers: {
    'Authorization': `Bearer ${apiKey}`,
  },
})
  .then(async response => {
    if (response.ok) {
      console.log('✅ SUCCESS! API key is valid and working!');
      console.log('🎉 You can now use the application.\n');
    } else {
      const error = await response.json();
      console.log('❌ API key test FAILED');
      console.log(`📛 Status: ${response.status}`);
      console.log(`📛 Error: ${error.error?.message || 'Unknown error'}`);
      console.log('\n💡 Solution:');
      console.log('1. Go to: https://platform.openai.com/api-keys');
      console.log('2. Create a NEW API key');
      console.log('3. Copy the ENTIRE key (all characters)');
      console.log('4. Replace OPENAI_API_KEY in .env.local');
      console.log('5. Restart the server: npm run dev\n');
    }
  })
  .catch(error => {
    console.log('❌ Connection error:', error.message);
  });
