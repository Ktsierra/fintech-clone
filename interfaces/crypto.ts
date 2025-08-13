export interface CryptoPlatform {
  id: string | number
  name: string
  slug: string
  symbol: string
  token_address: string
}

export interface CryptoUrls {
  website?: string[]
  twitter?: string[]
  message_board?: string[]
  chat?: string[]
  facebook?: string[]
  explorer?: string[]
  reddit?: string[]
  technical_doc?: string[]
  source_code?: string[]
  announcement?: string[]
}

export interface CryptoQuoteData {
  price: number
  volume_24h: number
  volume_change_24h: number
  percent_change_1h: number
  percent_change_24h: number
  percent_change_7d: number
  percent_change_30d: number
  percent_change_60d: number
  percent_change_90d: number
  market_cap: number
  market_cap_dominance: number
  fully_diluted_market_cap: number
  tvl: number | null
  last_updated: string
}

// Base interface with common properties
export interface CryptoBase {
  id: number
  name: string
  symbol: string
  slug: string
  date_added: string
  tags: string[]
  max_supply?: number | null
  infinite_supply: boolean
  platform: CryptoPlatform | null
  self_reported_circulating_supply: number | null
  self_reported_market_cap: number | null
  last_updated?: string
}

type CryptoQuote = {
  USD: CryptoQuoteData
} & Partial<Record<Exclude<Coin, 'USD'>, CryptoQuoteData>>

// For listings API data
export interface CryptoListingData extends CryptoBase {
  max_supply: number | null
  last_updated: string
  num_market_pairs: number
  circulating_supply: number
  total_supply: number
  cmc_rank: number
  tvl_ratio: null
  quote: CryptoQuote
}

// For info API data
export interface CryptoInfoData extends CryptoBase {
  category: 'coin' | 'token'
  description: string
  logo: string
  subreddit: string
  notice: string
  'tag-names': string[]
  'tag-groups': string[]
  urls: CryptoUrls
  twitter_username: string
  is_hidden: number
  date_launched: string | null
  contract_address: string[]
  self_reported_tags: string[] | null
}

type Coin = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'CHF' | 'CNY' | 'HKD' | 'NZD'

// Union type for both data types
export type CryptoCurrency = CryptoListingData | CryptoInfoData

// For listings API (returns array directly)
export type CoinMarketCapListingsResponse = CryptoListingData[]

// For info API (returns object with string keys directly)
export type CoinMarketCapInfoResponse = Record<string, CryptoInfoData>

// Union type for both response types
export type CoinMarketCapResponse = CoinMarketCapListingsResponse | CoinMarketCapInfoResponse
