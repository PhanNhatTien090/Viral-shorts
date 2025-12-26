# ⚠️ OPENAI API KEY SETUP INSTRUCTIONS

## Your current API key is INVALID (401 Error)

### Quick Fix:

1. **Get a new API key:**

   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Give it a name (e.g., "Viral Short Architect")
   - Copy the ENTIRE key (you'll only see it once!)

2. **Update .env.local:**

   - Open `.env.local` in your editor
   - Find the line: `OPENAI_API_KEY=...`
   - Replace with your NEW key
   - Make sure there are NO spaces or line breaks
   - Save the file

3. **Restart the server:**

   ```bash
   npm run dev
   ```

4. **Test again** at http://localhost:3000

### Example of correct format:

```env
OPENAI_API_KEY=sk-proj-AbCdEfGh123456789...YourActualKeyHere
```

### Common mistakes:

❌ Extra spaces: `OPENAI_API_KEY= sk-proj-...`
❌ Line breaks in the middle of the key
❌ Using an expired or revoked key
❌ Missing the `sk-proj-` prefix

### Need help?

- Check your OpenAI account has credits: https://platform.openai.com/usage
- Make sure your key has the right permissions
- The key should be for the "default" project or your specific project

---

After updating the key, run: `node test-openai-key.js` to verify it works!
