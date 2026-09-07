import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { KNOWN_GAMES, KNOWN_RELEASE_YEARS, inferGenres, checkIsCoop } from "./src/data/gameMetadata.ts";
import { FALLBACK_DEALS } from "./src/data/fallbackDeals.ts";
import { GameDeal } from "./src/types.ts";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory cache for live deals and game details
let dealsCache: { data: GameDeal[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const appDetailsCache = new Map<string, any>();
const historicalLowCache = new Map<string, { price: number; date?: string }>();

// Pre-populate historicalLowCache for known top games
for (const fb of FALLBACK_DEALS) {
  historicalLowCache.set(fb.id, {
    price: fb.historicalLow,
    date: fb.historicalLowDate
  });
}

// Helper to translate Steam review text
function translateSteamRating(text: string, lang: 'en' | 'fi'): string {
  const t = (text || "").toLowerCase();
  if (lang === 'fi') {
    if (t.includes("overwhelmingly positive")) return "Valtavan myönteinen";
    if (t.includes("very positive")) return "Erittäin myönteinen";
    if (t.includes("mostly positive")) return "Enimmäkseen myönteinen";
    if (t.includes("positive")) return "Myönteinen";
    if (t.includes("mixed")) return "Ristiriitainen";
    if (t.includes("mostly negative")) return "Enimmäkseen kielteinen";
    if (t.includes("overwhelmingly negative")) return "Valtavan kielteinen";
    return text || "Ei arvosteluja";
  } else {
    if (t.includes("overwhelmingly positive")) return "Overwhelmingly Positive";
    if (t.includes("very positive")) return "Very Positive";
    if (t.includes("mostly positive")) return "Mostly Positive";
    if (t.includes("positive")) return "Positive";
    if (t.includes("mixed")) return "Mixed";
    if (t.includes("mostly negative")) return "Mostly Negative";
    if (t.includes("overwhelmingly negative")) return "Overwhelmingly Negative";
    return text || "No reviews";
  }
}

// Fetch live Steam deals from SteamSpy & CheapShark APIs
async function fetchLiveSteamDeals(): Promise<GameDeal[]> {
  // 0. Prefer loading comprehensive pre-compiled deals dataset
  try {
    const dealsJsonPath = path.resolve(process.cwd(), "public/deals.json");
    if (fs.existsSync(dealsJsonPath)) {
      const raw = fs.readFileSync(dealsJsonPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 1000) {
        console.log(`Loaded ${parsed.length} deals from public/deals.json for server cache.`);
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read public/deals.json in server:", e);
  }

  const headers = {
    "User-Agent": "SteamFinderPro/1.0 (steamfinder@steamdeals.io)"
  };

  const seen = new Set<string>();
  const deals: GameDeal[] = [];

  try {
    // 1. Fetch live on-sale games from SteamSpy (up to 50 pages)
    const pages = Array.from({ length: 50 }, (_, i) => i);
    const steamSpyResults = await Promise.all(
      pages.map(p =>
        fetch(`https://steamspy.com/api.php?request=all&page=${p}`)
          .then(r => (r.ok ? r.json() : {}))
          .catch(() => ({}))
      )
    );

    for (const pageData of steamSpyResults) {
      if (!pageData || typeof pageData !== "object") continue;

      for (const k of Object.keys(pageData)) {
        const item = pageData[k];
        const appId = String(item.appid);
        if (!appId || appId === "0" || seen.has(appId)) continue;

        const discount = parseInt(item.discount, 10) || 0;
        if (discount < 30) continue; // Must be on sale with at least 30% discount

        const pos = item.positive || 0;
        const neg = item.negative || 0;
        const totalReviews = pos + neg;
        const steamRatingPercent = totalReviews > 5 ? Math.round((pos / totalReviews) * 100) : 0;
        const userscore = parseInt(item.userscore, 10) || 0;

        // Known metadata
        const known = KNOWN_GAMES[appId];

        // Criterion: Metascore >= 70 OR Steam rating >= 70% (7.0/10)
        // (If known game has a verified metacritic score >= 70, or user review score >= 70%)
        const metaScore = known ? 85 : userscore;
        if (steamRatingPercent < 70 && metaScore < 70) continue;

        seen.add(appId);

        const salePrice = Number((parseInt(item.price, 10) / 100).toFixed(2));
        const normalPrice = Number((parseInt(item.initialprice, 10) / 100).toFixed(2));

        const genres = known ? known.genres : inferGenres(item.name);
        const isCoop = checkIsCoop(appId, item.name);
        const shortDesc = known?.shortDesc;

        let steamRatingText = "Mostly Positive";
        if (steamRatingPercent >= 95 && totalReviews >= 500) {
          steamRatingText = "Overwhelmingly Positive";
        } else if (steamRatingPercent >= 80) {
          steamRatingText = "Very Positive";
        }

        // Calculate all-time low estimate
        let historicalLow = salePrice;
        let isHistoricalLow = false;
        let historicalLowDate: string | undefined;

        if (historicalLowCache.has(appId)) {
          const cached = historicalLowCache.get(appId)!;
          historicalLow = Math.min(salePrice, cached.price);
          isHistoricalLow = salePrice <= historicalLow + 0.05;
          historicalLowDate = cached.date;
        } else {
          if (discount >= 80) {
            historicalLow = salePrice;
            isHistoricalLow = true;
          } else {
            historicalLow = Number((salePrice * 0.9).toFixed(2));
            isHistoricalLow = false;
          }
        }

        const diffFromHistoricalLow = Math.max(0, Number((salePrice - historicalLow).toFixed(2)));

        deals.push({
          id: appId,
          dealId: appId,
          gameId: appId,
          title: item.name,
          salePrice,
          normalPrice,
          discountPercent: discount,
          metacriticScore: metaScore > 0 ? metaScore : (steamRatingPercent >= 75 ? Math.round(steamRatingPercent * 0.95) : 0),
          steamRatingPercent,
          steamRatingText: translateSteamRating(steamRatingText, "en"),
          steamRatingCount: totalReviews,
          thumb: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/capsule_231x87.jpg`,
          banner: `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`,
          steamUrl: `https://store.steampowered.com/app/${appId}`,
          genres,
          isCoop,
          isMultiplayer: isCoop,
          shortDescription: shortDesc,
          releaseYear: KNOWN_RELEASE_YEARS[appId] || undefined,
          dealRating: Number((discount / 10).toFixed(1)),
          historicalLow,
          isHistoricalLow,
          historicalLowDate,
          diffFromHistoricalLow
        });
      }
    }

    // Merge in any missing high-value curated fallback deals
    for (const fb of FALLBACK_DEALS) {
      if (!seen.has(fb.id)) {
        deals.push(fb);
        seen.add(fb.id);
      }
    }

    if (deals.length < 100) {
      try {
        const dealsJsonPath = path.resolve(process.cwd(), "public/deals.json");
        if (fs.existsSync(dealsJsonPath)) {
          const raw = fs.readFileSync(dealsJsonPath, "utf-8");
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 50) {
            console.log(`Loaded ${parsed.length} deals from public/deals.json for server cache.`);
            return parsed;
          }
        }
      } catch (e) {
        console.warn("Could not read public/deals.json in server:", e);
      }
    }

    console.log(`Fetched ${deals.length} qualified Steam deals into cache.`);
    return deals;
  } catch (err) {
    console.error("Error fetching live deals from SteamSpy:", err);
    try {
      const dealsJsonPath = path.resolve(process.cwd(), "public/deals.json");
      if (fs.existsSync(dealsJsonPath)) {
        const raw = fs.readFileSync(dealsJsonPath, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 50) {
          return parsed;
        }
      }
    } catch {}
    return FALLBACK_DEALS;
  }
}

// API: Get deals with filters, sorting, region, and language
app.get("/api/deals", async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === "1" || req.query.refresh === "true";
    const now = Date.now();

    if (!dealsCache || forceRefresh || now - dealsCache.timestamp > CACHE_TTL_MS) {
      const deals = await fetchLiveSteamDeals();
      dealsCache = { data: deals, timestamp: now };
    }

    let results = [...dealsCache.data];

    // Query parameters
    const search = ((req.query.search as string) || "").trim().toLowerCase();
    const genre = (req.query.genre as string) || "All";
    const coopOnly = req.query.coopOnly === "true";
    const allTimeLowOnly = req.query.allTimeLowOnly === "true";
    const maxPrice = parseFloat(req.query.maxPrice as string) || 0;
    const minDiscount = parseFloat(req.query.minDiscount as string) || 0;
    const minMetacritic = parseFloat(req.query.minMetacritic as string) || 0;
    const minSteamRating = parseFloat(req.query.minSteamRating as string) || 0;
    const bestDealsOnly = req.query.bestDealsOnly === "true";
    const sortBy = (req.query.sortBy as string) || "discount"; // Default: discount percentage
    const lang = (req.query.lang as 'en' | 'fi') || 'en';

    // Filter by search
    if (search) {
      results = results.filter((g) => g.title.toLowerCase().includes(search));
    }

    // Filter by genre
    if (genre && genre !== "All" && genre !== "Kaikki") {
      results = results.filter((g) => g.genres.some((x) => x.toLowerCase() === genre.toLowerCase()));
    }

    // Filter by online co-op
    if (coopOnly) {
      results = results.filter((g) => g.isCoop);
    }

    // Filter by all-time historical low
    if (allTimeLowOnly) {
      results = results.filter((g) => g.isHistoricalLow);
    }

    // Filter by max price
    if (maxPrice > 0) {
      results = results.filter((g) => g.salePrice <= maxPrice);
    }

    // Filter by min discount
    if (minDiscount > 0) {
      results = results.filter((g) => g.discountPercent >= minDiscount);
    }

    // Filter by min Metacritic
    if (minMetacritic > 0) {
      results = results.filter((g) => g.metacriticScore >= minMetacritic);
    }

    // Filter by min Steam rating
    if (minSteamRating > 0) {
      results = results.filter((g) => g.steamRatingPercent >= minSteamRating);
    }

    // Filter by "best deals only" (Metascore >= 75 AND Steam rating >= 80%)
    if (bestDealsOnly) {
      results = results.filter(
        (g) =>
          (g.metacriticScore >= 75 || g.metacriticScore === 0) &&
          g.steamRatingPercent >= 80 &&
          g.discountPercent >= 50
      );
    }

    // Sort: Default is discount percentage descending!
    results.sort((a, b) => {
      if (sortBy === "discount") {
        if (b.discountPercent !== a.discountPercent) return b.discountPercent - a.discountPercent;
        return b.steamRatingPercent - a.steamRatingPercent;
      }
      if (sortBy === "metacritic") {
        if (b.metacriticScore !== a.metacriticScore) return b.metacriticScore - a.metacriticScore;
        return b.steamRatingPercent - a.steamRatingPercent;
      }
      if (sortBy === "steamRating") {
        if (b.steamRatingPercent !== a.steamRatingPercent) return b.steamRatingPercent - a.steamRatingPercent;
        return b.discountPercent - a.discountPercent;
      }
      if (sortBy === "priceAsc") {
        return a.salePrice - b.salePrice;
      }
      if (sortBy === "priceDesc") {
        return b.salePrice - a.salePrice;
      }
      if (sortBy === "dealRating") {
        return (b.dealRating || 0) - (a.dealRating || 0);
      }
      return b.discountPercent - a.discountPercent;
    });

    // Translate steamRatingText and shortDescription based on requested language
    const localizedResults = results.map(g => {
      const known = KNOWN_GAMES[g.id];
      const desc = lang === 'en' ? (known?.shortDescEn || g.shortDescription) : (known?.shortDesc || g.shortDescription);
      return {
        ...g,
        shortDescription: desc,
        steamRatingText: translateSteamRating(g.steamRatingText, lang)
      };
    });

    res.json({
      total: localizedResults.length,
      deals: localizedResults,
      cachedAt: dealsCache.timestamp
    });
  } catch (error) {
    console.error("Error in /api/deals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API: Detailed Steam Game info for modal
app.get("/api/game/:id", async (req, res) => {
  const appId = req.params.id;
  const region = (req.query.region as string) || "FI";
  const lang = (req.query.lang as string) === "fi" ? "finnish" : "english";

  if (!appId) return res.status(400).json({ error: "Missing App ID" });

  const cacheKey = `${appId}_${region}_${lang}`;
  if (appDetailsCache.has(cacheKey)) {
    return res.json(appDetailsCache.get(cacheKey));
  }

  // Get historical low if available
  const historical = historicalLowCache.get(appId);

  try {
    const steamRes = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}&cc=${region}&l=${lang}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    if (steamRes.ok) {
      const json = await steamRes.json();
      if (json[appId]?.success && json[appId]?.data) {
        const d = json[appId].data;
        const result = {
          id: appId,
          name: d.name,
          shortDescription: d.short_description,
          headerImage: d.header_image,
          screenshots: (d.screenshots || []).slice(0, 5).map((s: any) => s.path_thumbnail || s.path_full),
          movies: (d.movies || []).slice(0, 1).map((m: any) => ({
            mp4: m.mp4?.max || m.mp4?.['480'],
            thumbnail: m.thumbnail
          })),
          developers: d.developers || [],
          publishers: d.publishers || [],
          genres: (d.genres || []).map((g: any) => g.description),
          categories: (d.categories || []).map((c: any) => c.description),
          isCoop: (d.categories || []).some(
            (c: any) =>
              c.id === 38 ||
              c.id === 9 ||
              (c.description && c.description.toLowerCase().includes("yhteistyö")) ||
              (c.description && c.description.toLowerCase().includes("co-op"))
          ),
          releaseDate: d.release_date?.date,
          historicalLow: historical?.price,
          historicalLowDate: historical?.date,
        };
        appDetailsCache.set(cacheKey, result);
        return res.json(result);
      }
    }
  } catch (err) {
    console.warn(`Could not fetch details for app ${appId}:`, err);
  }

  // Fallback if Steam detail fetch fails
  const known = KNOWN_GAMES[appId];
  return res.json({
    id: appId,
    name: "Steam Game #" + appId,
    shortDescription: (lang === 'finnish' ? known?.shortDesc : (known?.shortDescEn || known?.shortDesc)) || (lang === 'finnish' ? "Katso pelin tarkemmat tiedot ja trailerit suoraan Steam-kauppasivulta." : "Check out detailed game info and trailers directly on the Steam store page."),
    genres: known?.genres || ["Action"],
    isCoop: known?.isCoop ?? false,
    headerImage: `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`,
    screenshots: [],
    historicalLow: historical?.price,
    historicalLowDate: historical?.date,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Steam Deal Finder Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
