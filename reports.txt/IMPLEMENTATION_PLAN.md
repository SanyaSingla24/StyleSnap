# Implementation Plan - Category-Aware Failover Routing

This plan covers updating the backend routing algorithm to filter eligible Hugging Face Spaces by the requested garment category (`upper_body`, `lower_body`, or `dresses`). This ensures full-body outfits (like dresses) are only sent to models that support full-body try-on (like `Leffa`), preventing them from being improperly treated as tops by `upper_body`-only models.

---

## Proposed Changes

### 🌐 Backend Server

#### [MODIFY] [server.js](file:///d:/style-snap/server.js)

1. **Category Compatibility Tagging**:
   - Define a `supportedCategories` list for each Space in the `SPACES` pool.
   - Filter the spaces pool at the start of each prediction to only include spaces that support the requested category (e.g. `yisol/IDM-VTON` only supports `upper_body`).

2. **Sequential Token Cycling per Space**:
   - Instead of immediately jumping to the next Space when a rate limit is hit, the backend will now cycle through **all available tokens** on the best matching Space (e.g. `franciszzj/Leffa`) first.
   - If all tokens fail on that Space, only then will it fall back to subsequent eligible Spaces.

3. **Multi-Client Cache**:
   - Replace the single global `gradioClient` variable with a `gradioClientsCache` Map.
   - Cache clients by a key combining the Space ID and the specific Token used, ensuring clean client re-use without cross-token state leakage.

---

## Verification Plan

### Manual Verification
1. Upload a full-body dress outfit in the UI, select **Full Body (Suits, Dresses, Kurta Gowns)**, and generate.
2. Confirm from server logs that only `leffa` spaces (which support `dresses`) are listed as eligible, and `idm_vton` spaces are filtered out.
3. Confirm that if `token index 0` fails on the Leffa space, it immediately retries the same Leffa space with `token index 1` (rather than failing over to an IDM-VTON space).
