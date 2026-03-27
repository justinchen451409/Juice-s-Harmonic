export const ICONIQ_PORTFOLIO = [
  '1Password', 'AcuityMD', 'Adyen', 'Age of Learning', 'Airbnb', 'Airtable',
  'Ajaib', 'Altruist', 'Anthropic', 'Apprentice', 'Articulate', 'Aurora Solar',
  'Automattic', 'Axonius', 'BambooHR', 'Benchling', 'BetterUp', 'Bill.com',
  'Blackline', 'Braintrust', 'Braze', 'Calendly', 'Canva', 'CaptivateIQ',
  'Causaly', 'Chime', 'Clara', 'Coast', 'Collibra', 'Coupa', 'CrowdStrike',
  'Databricks', 'Datadog', 'Dataiku', 'dbt', 'DeepL', 'Devoted Health',
  'Dialpad', 'DocuSign', 'Drata', 'DX', 'ElevenLabs', 'Enfusion', 'Figma',
  'Fivetran', 'FloQast', 'Glean', 'GitLab', 'GoodRx', 'Grotto', 'Groww',
  'Highspot', 'Hightouch', 'HighRadius', 'Lead Bank', 'Legora', 'Loom',
  'Lucid', 'Marqeta', 'Miro', 'Monte Carlo', 'Monzo', 'Moveworks', 'Netskope',
  'Nevis', 'NinjaOne', 'Notable', 'OpenAI', 'OpenEvidence', 'Oura', 'Outtake',
  'Pigment', 'Procore', 'Ramp', 'Rain', 'Restaurant365', 'Revolut', 'Rillet',
  'ServiceTitan', 'Sierra', 'Snowflake', 'Stripe', 'Swap', 'Wealthsimple', 'Writer',
]

export const ISP7_RECENT = [
  'Anthropic', 'Braintrust', 'Lead Bank', 'Nevis', 'OpenAI', 'OpenEvidence',
  'Oura', 'Outtake', 'Rain', 'Ramp', 'Revolut', 'Rillet', 'Sierra',
  'ST Labs', 'Stripe',
]

export function getSynergyMatches(synergyList) {
  if (!synergyList) return []
  return synergyList.map(name => ({
    name,
    inPortfolio: ICONIQ_PORTFOLIO.some(p => p.toLowerCase() === name.toLowerCase()),
    isp7: ISP7_RECENT.some(p => p.toLowerCase() === name.toLowerCase()),
  }))
}
