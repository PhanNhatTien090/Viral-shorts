# Cost Optimization Guide - Caching + Free AI Model

## ✅ Implementation Complete

**Dual Cost Optimization Strategy:**

1. 🔄 **Smart Caching** - Save repeated queries to database
2. 🆓 **Free AI Model** - Google Gemini 2.5 Flash instead of OpenAI

**Expected Savings:** 95-99% cost reduction!

---

## 🚀 Strategy 1: Free AI Model

### Switched from OpenAI → Google Gemini 2.5 Flash

**Before:**

```typescript
import { createOpenAI } from "@ai-sdk/openai";
const openai = createOpenAI({ apiKey: "..." });
model: openai("gpt-4o-mini"); // Costs money per request
```

**After:**

```typescript
import { createGoogleGenerativeAI } from "@ai-sdk/google";
const google = createGoogleGenerativeAI({ apiKey: "..." });
model: google("gemini-1.5-flash-latest"); // FREE tier!
```

### Gemini 1.5 Flash Benefits

- ✅ **Free tier:** 15 RPM (requests per minute)
- ✅ **Fast:** ~1-3 second response time
- ✅ **Quality:** Comparable to GPT-4o-mini
- ✅ **Token limit:** 1M context window
- ✅ **Structured output:** Full support for Zod schemas

---

## 🔄 Strategy 2: Smart Caching

## 🔄 Strategy 2: Smart Caching

### How Caching Works

### 1. **Cache Key Normalization**

```typescript
const cacheKey = `${topic.toLowerCase().trim()}-${vibe}-${platform}`;
```

Example: `"Cách Nấu Phở"` → `"cách nấu phở-humorous-tiktok"`

### 2. **Database Lookup (STEP B)**

```typescript
const cached = await db
  .select()
  .from(cachedResults)
  .where(eq(cachedResults.cacheKey, cacheKey))
  .limit(1);
```

- If found → Return cached data (instant response)
- If not found → Call Gemini API

### 3. **Streaming Cached Data**

```typescript
function createCachedStream(cachedData: ScriptResult) {
  // Progressive field emission: hook → script → cta → visualPrompt
  // Format: "0:{json}\n" (AI SDK compatible)
}
```

- Creates ReadableStream matching Vercel AI SDK format
- Progressive rendering (80ms delay per field)
- Compatible with `experimental_useObject`

### 4. **Save New Results (STEP D)**

```typescript
onFinish: async ({ object }) => {
  await db.insert(cachedResults).values({
    cacheKey,
    data: object,
  });
};
```

- Saves after Gemini completes generation
- Non-blocking (errors won't break response)
- Future requests use cached version

---

## 🧪 Testing Instructions

### Test 1: First Request (Cache MISS + Gemini Call)

1. Open http://localhost:3000
2. Fill form:
   - **Topic:** `cách nấu phở`
   - **Vibe:** `humorous`
   - **Platform:** `tiktok`
3. Click "Sáng tạo ngay"
4. **Expected Terminal Logs:**
   ```
   📥 API received: { topic: 'cách nấu phở', vibe: 'humorous', platform: 'tiktok' }
   🔍 Cache key: cách nấu phở-humorous-tiktok
   ❌ CACHE MISS - Calling Gemini API
   🚀 Calling Gemini 1.5 Flash...
   ✨ Generation completed (2500ms)
   💾 Saved to cache: cách nấu phở-humorous-tiktok
   ```
5. **Expected Headers:**
   - `X-Cache-Status: MISS`
   - `X-Model: gemini-1.5-flash-latest`
6. **Cost:** ✅ FREE (Gemini free tier)

### Test 2: Second Request (Cache HIT)

1. **Use EXACT same inputs:**
   - **Topic:** `cách nấu phở`
   - **Vibe:** `humorous`
   - **Platform:** `tiktok`
2. Click "Sáng tạo ngay" again
3. **Expected Terminal Logs:**
   ```
   📥 API received: { topic: 'cách nấu phở', vibe: 'humorous', platform: 'tiktok' }
   🔍 Cache key: cách nấu phở-humorous-tiktok
   ✅ CACHE HIT - Returning cached result (45ms)
   ```
4. **Expected Headers:**
   - `X-Cache-Status: HIT`
   - `X-Response-Time: 45ms` (instant!)
5. **Cost:** ✅ FREE (no API call)

### Test 3: Different Inputs (New Cache Entry)

| Input Variation          | Cache Key                       | Result             |
| ------------------------ | ------------------------------- | ------------------ |
| `Cách Nấu Phở` (capital) | `cách nấu phở-humorous-tiktok`  | ✅ Same cache      |
| `cách nấu phở` (spaces)  | `cách nấu phở-humorous-tiktok`  | ✅ Same cache      |
| Different vibe           | `cách nấu phở-drama-tiktok`     | ❌ New cache entry |
| Different platform       | `cách nấu phở-humorous-youtube` | ❌ New cache entry |

---

## 💾 Database Verification

### Using Drizzle Studio

```bash
npm run db:studio
```

1. Open http://localhost:4983
2. Navigate to `cached_results` table
3. You should see entries with:
   - `cache_key`: normalized string
   - `data`: JSON object with `{ hook, script, cta, visualPrompt }`
   - `created_at`: timestamp

### Using SQL Query

```sql
SELECT
  cache_key,
  data->>'hook' as hook_preview,
  created_at
FROM cached_results
ORDER BY created_at DESC
LIMIT 5;
```

---

## 💰 Cost Savings Breakdown

### Scenario: 100 Users Ask "cách nấu phở"

**Without Optimization (OpenAI GPT-4o-mini):**

- 100 requests × $0.15 per 1M input tokens
- Average cost: ~$0.015 per request
- **Total: $1.50** 💸

**With Free Model Only (Gemini):**

- 100 requests × $0.00 (free tier)
- **Total: $0.00** ✅
- **Savings: 100%**

**With Caching + Free Model:**

- First request: $0.00 (Gemini free tier)
- Next 99 requests: $0.00 (cached)
- **Total: $0.00** ✅
- **Bonus:** Instant response (45ms vs 2500ms)

### Real-World Savings

**Monthly Volume:** 10,000 requests

- 50% cache hit rate (conservative estimate)
- 5,000 unique queries + 5,000 cached

**Cost with OpenAI:**

- 10,000 × $0.015 = **$150/month** 💸

**Cost with Gemini + Caching:**

- **$0/month** (within free tier limits) ✅
- Free tier: 15 RPM = 21,600 requests/day
- **Savings: $1,800/year!** 🎉

---

## 🔍 Monitoring Cache Performance

### Check Terminal Logs

```bash
# Cache HIT (free)
✅ SECONDHAND ANSWER - Using cached result

# Cache MISS (costs money)
❌ Cache miss - Calling OpenAI API
```

### Response Headers

- `X-Cache-Status: HIT` → Free (database)
- `X-Cache-Status: MISS` → Paid (OpenAI)

---

## 🛠️ Cache Management

### Clear Specific Cache

```sql
DELETE FROM cached_results
WHERE cache_key = 'cách nấu phở-humorous-tiktok';
```

### Clear All Cache

```sql
TRUNCATE TABLE cached_results;
```

### Clear Old Cache (30+ days)

```sql
DELETE FROM cached_results
WHERE created_at < NOW() - INTERVAL '30 days';
```

---

## 🚨 Troubleshooting

### Cache Not Working?

1. **Check database connection:**
   ```bash
   npm run db:push
   ```
2. **Verify table exists:**
   ```bash
   npm run db:studio
   ```
3. **Check logs for DB errors:**
   ```
   Database error during cache check: ...
   ```

### Cache Returning Old Data?

- Cache is permanent until manually cleared
- Consider adding cache expiration logic if needed

### Case Sensitivity Issues?

- The code uses `.toLowerCase().trim()` for normalization
- "PHỞ" and "phở" will match the same cache

---

## 📈 Expected Behavior

### ✅ Success Indicators

- First request takes 3-8 seconds (OpenAI processing)
- Second identical request takes <100ms (database lookup)
- Terminal shows "SECONDHAND ANSWER" on cache hit
- Network tab shows `X-Cache-Status: HIT`

### ❌ Warning Signs

- Every request shows "Cache miss" → Check database connection
- Cached data not loading → Check stream format
- Database errors → Verify schema migration

---

## 🎯 Production Considerations

1. **Cache Expiration:** Consider adding TTL (Time To Live)

   ```typescript
   WHERE created_at > NOW() - INTERVAL '7 days'
   ```

2. **Cache Invalidation:** Add admin endpoint to clear cache

   ```typescript
   DELETE FROM cached_results WHERE cache_key LIKE '${searchTerm}%'
   ```

3. **Analytics:** Track cache hit rate

   ```sql
   SELECT
     COUNT(*) FILTER (WHERE X-Cache-Status = 'HIT') as hits,
     COUNT(*) FILTER (WHERE X-Cache-Status = 'MISS') as misses
   FROM request_logs;
   ```

4. **Cache Warming:** Pre-generate popular topics
   ```typescript
   const popularTopics = ["kiếm tiền online", "giảm cân", "nấu ăn"];
   // Pre-cache these on server startup
   ```

---

**Status:** ✅ Caching mechanism is LIVE  
**Test URL:** http://localhost:3000  
**Database:** Supabase PostgreSQL (pooler mode)  
**Expected Savings:** 80-95% API cost reduction
