export const TIER_DEFINITIONS = {
  'Tier 1': {
    label: 'Tier 1 — Elite Venture',
    color: 'amber',
    description: 'Top global venture firms. Highest market signal. A Tier 1 lead is a meaningful quality filter — these firms see thousands of deals and are highly selective. Their brand accelerates hiring, follow-on rounds, and customer trust.',
    examples: ['Sequoia Capital', 'Andreessen Horowitz (a16z)', 'Benchmark', 'Accel', 'Greylock', 'Kleiner Perkins', 'Index Ventures', 'Lightspeed', 'General Catalyst', 'Founders Fund', 'Thrive Capital', 'Khosla Ventures', 'NEA', 'Spark Capital', 'Union Square Ventures'],
  },
  'Tier 2': {
    label: 'Tier 2 — Strong Venture',
    color: 'blue',
    description: 'Established venture firms with strong sector expertise and real brand value. Great portfolio networks, proven follow-on ability. Signal is meaningful but not as universally recognized as Tier 1.',
    examples: ['IVP', 'Battery Ventures', 'Bessemer Venture Partners', 'Insight Partners', 'TCV', 'GGV Capital', 'Norwest Venture Partners', 'Redpoint Ventures', 'Felicis Ventures', 'Lux Capital', 'Craft Ventures', 'Emergence Capital', 'Sapphire Ventures', 'Ribbit Capital', 'First Round Capital', 'True Ventures'],
  },
  'Tier 3': {
    label: 'Tier 3 — Sector-Focused',
    color: 'green',
    description: 'Specialized or regional funds with deep domain expertise. Strong signal within specific verticals (fintech, health, dev tools). Lower general market signal but often have proprietary deal access in their niche.',
    examples: ['CRV', 'Matrix Partners', 'Menlo Ventures', 'Boldstart Ventures', 'Haystack', 'Unusual Ventures', 'Base10 Partners', 'Point Nine Capital', 'Atomico', 'Crane Ventures', 'Notion Capital', 'Slow Ventures', 'Version One', 'Morado Ventures'],
  },
  'Crossover': {
    label: 'Crossover — Hedge Funds',
    color: 'purple',
    description: 'Hedge funds and multi-strategy investors that enter at late-stage private rounds. Very high check sizes, price-insensitive, often move fast. Lower operational value-add. Presence signals a company is on the IPO path.',
    examples: ['Tiger Global Management', 'Coatue Management', 'D1 Capital Partners', 'Altimeter Capital', 'Whale Rock Capital', 'Viking Global', 'Lone Pine Capital', 'Durable Capital Partners', 'Dragoneer Investment Group', 'Abdiel Capital', 'Alkeon Capital', 'Steadfast Capital', 'Sands Capital'],
  },
  'Growth Equity': {
    label: 'Growth Equity',
    color: 'sky',
    description: 'Dedicated growth equity and PE firms investing Series C+. Strong at operational value-add, board governance, IPO prep. ICONIQ Growth is in this category. Top-tier (GA, Silver Lake, Warburg) carry real signal.',
    examples: ['General Atlantic', 'Silver Lake', 'Warburg Pincus', 'ICONIQ Growth', 'Advent International', 'Vista Equity Partners', 'Francisco Partners', 'KKR Growth', 'Permira', 'Apax Partners', 'Summit Partners', 'TA Associates', 'PSP Investments', 'Premji Invest'],
  },
  'Mega-Fund': {
    label: 'SoftBank / Mega-Fund',
    color: 'orange',
    description: 'Large sovereign and institutional vehicles. Very high check sizes, complex governance dynamics. Market signal is mixed — SoftBank participation in particular has historically been a controversial quality signal.',
    examples: ['SoftBank Vision Fund', 'DST Global', 'Mubadala Investment Company', 'Temasek', 'GIC', 'CPPIB', 'GIC', 'ADIA', 'PIF (Saudi Arabia)'],
  },
  'CVC': {
    label: 'Corporate VC',
    color: 'pink',
    description: 'Corporate venture arms. Strategic value via partnership and distribution channels. Watch for misaligned incentives (CVCs can block acqui-hires or exits). Best when paired with a Tier 1/2 financial lead.',
    examples: ['Google Ventures (GV)', 'Salesforce Ventures', 'Microsoft M12', 'Intel Capital', 'Qualcomm Ventures', 'Nvidia NVentures', 'Cisco Investments', 'Goldman Sachs Growth', 'Comcast Ventures', 'Samsung NEXT', 'Workday Ventures'],
  },
}

export const ALL_TIERS = Object.keys(TIER_DEFINITIONS)

export const STAGE_DEFINITIONS = {
  'Pre-Seed': {
    description: 'First institutional check, typically $500K–$3M. Idea / early prototype stage. Team and vision are the primary underwriting criteria.',
    arr_range: 'Pre-revenue to <$500K ARR',
  },
  'Seed': {
    description: 'Product in market, early customer validation. $1M–$5M round. Focus on finding product-market fit and early revenue proof points.',
    arr_range: '$0–$2M ARR typically',
  },
  'Series A': {
    description: 'PMF achieved, scaling GTM. $5M–$25M round. Investors want to see repeatable sales motion, NDR >100%, and clear expansion path.',
    arr_range: '$1M–$10M ARR typically',
  },
  'Series B': {
    description: 'Scaling GTM and team. $20M–$80M round. Metrics maturity expected: strong NDR, CAC payback <24 months, clear path to Rule of 40.',
    arr_range: '$5M–$30M ARR typically',
  },
  'Series C': {
    description: 'Category leadership or geographic expansion. $50M–$200M round. Company should have durable competitive advantage and clear market leadership.',
    arr_range: '$20M–$100M ARR typically',
  },
  'Series D': {
    description: 'Scaling toward market dominance or pre-IPO. $100M–$400M round. Revenue quality, EBITDA path, and IPO readiness become focal points.',
    arr_range: '$50M–$300M ARR typically',
  },
  'Series E': {
    description: 'Late-stage growth, often pre-IPO positioning. $150M–$500M round. Focus shifts to margin profile and public market comparables.',
    arr_range: '$100M–$500M ARR typically',
  },
  'Series F': {
    description: 'Very late private stage. Companies at this stage are typically preparing for an IPO or have extended their private runway for strategic reasons.',
    arr_range: '$200M+ ARR typically',
  },
  'Series F+': {
    description: 'Beyond Series F — mega-rounds for large, established private companies. Often crossover or hybrid debt/equity structures.',
    arr_range: '$500M+ ARR typically',
  },
  'Pre-IPO': {
    description: 'Late-stage bridge or structured secondary before a planned public offering. High visibility, limited upside vs. early private, but lower execution risk.',
    arr_range: '$500M–$1B+ ARR often',
  },
  'Growth': {
    description: 'Non-series-labeled growth round, often from growth equity or PE firms. Could be any stage — look to the investors and metrics for context.',
    arr_range: 'Varies widely',
  },
}

export const ALL_STAGES = Object.keys(STAGE_DEFINITIONS)
