/**
 * Data ingestion scaffolding for ICONIQ Scout.
 * Each function is a placeholder for a future scraping or API integration.
 * All functions return a normalized deal object matching the Supabase schema.
 */

/**
 * Fetch fundraise announcements from TechCrunch.
 * Approach: RSS feed at https://techcrunch.com/tag/fundraising/feed/ or
 * scrape /funding tag pages. Parse article titles for company, amount, round.
 * Use OpenAI/Claude to extract structured data from article text.
 */
export async function fetchTechCrunch() {
  // TODO: fetch https://techcrunch.com/tag/fundraising/feed/
  // parse RSS items, extract company name, amount, stage, lead investor
  // normalize to deal schema
  return []
}

/**
 * Fetch deals from Axios Pro Rata newsletter.
 * Approach: Subscribe to Pro Rata email list, forward to a parsing endpoint,
 * or monitor https://www.axios.com/pro/pro-rata for deal announcements.
 * Axios uses structured deal tables in the newsletter — parse via regex or LLM.
 */
export async function fetchAxiosProRata() {
  // TODO: fetch Axios Pro Rata newsletter archive or RSS
  // parse deal tables from newsletter HTML
  // normalize to deal schema
  return []
}

/**
 * Fetch fundraise summaries from StrictlyVC newsletter.
 * Approach: Monitor https://strictlyvc.com or subscribe to the daily email.
 * StrictlyVC provides concise funding roundups — parse via regex or LLM extraction.
 */
export async function fetchStrictlyVC() {
  // TODO: fetch StrictlyVC newsletter or web archive
  // extract company, amount, round, investors from deal blurbs
  // normalize to deal schema
  return []
}

/**
 * Fetch posts from top VC firm blogs announcing new investments.
 * Sources: a16z.com/news, sequoiacap.com/news, lightspeedvp.com/news,
 * bvp.com/news, generalcatalyst.com, bain.com/insights.
 * Approach: RSS feeds or web scraping. Filter posts containing "portfolio" or
 * "investment" keywords. Use Claude API to extract deal details from post body.
 */
export async function fetchVCBlogs() {
  const sources = [
    { firm: 'Andreessen Horowitz', url: 'https://a16z.com/feed/' },
    { firm: 'Sequoia Capital', url: 'https://www.sequoiacap.com/feed/' },
    { firm: 'Lightspeed', url: 'https://lsvp.com/feed/' },
    { firm: 'Bessemer', url: 'https://www.bvp.com/rss.xml' },
    { firm: 'General Catalyst', url: 'https://www.generalcatalyst.com/feed/' },
  ]
  // TODO: for each source, fetch RSS feed
  // filter items that announce a new investment
  // use Claude API to extract structured deal data
  // normalize to deal schema
  void sources
  return []
}

/**
 * Normalize raw scraped data to the Supabase deals schema.
 * @param {object} raw - raw data from any source
 * @returns {object} - normalized deal object
 */
export function normalizeDeal(raw) {
  return {
    id: raw.id || crypto.randomUUID(),
    company: raw.company || '',
    sector: raw.sector || '',
    stage: raw.stage || '',
    amount_m: raw.amount_m || null,
    lead_investor: raw.lead_investor || '',
    lead_tier: raw.lead_tier || 'Tier 2',
    date: raw.date || new Date().toISOString().split('T')[0],
    founders: raw.founders || [],
    headcount: raw.headcount || null,
    headcount_growth: raw.headcount_growth || '',
    arr: raw.arr || '',
    description: raw.description || '',
    signals: raw.signals || [],
    iconiq_synergy: raw.iconiq_synergy || [],
    competitors: raw.competitors || [],
    tracked: false,
    passed: false,
    notes: '',
  }
}
