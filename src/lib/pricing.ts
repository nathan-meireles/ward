import type { PricingCalc } from './supabase/types'

export interface PricingInputs {
  cog_eur: number | null
  freight_eur: number
  sale_price_eur: number | null
  coupon_pct: number          // 0–1 (ex: 0.10 = 10%)
  iof_rate: number            // default 0.035
  checkout_fee_rate: number   // default 0.005
  gateway_fee_rate: number    // default 0.0599
  marketing_allocation_pct: number // default 0.25
  other_taxes_rate: number    // default 0
}

export const DEFAULT_PRICING_CONFIG = {
  iof_rate: 0.035,
  checkout_fee_rate: 0.005,
  gateway_fee_rate: 0.0599,
  marketing_allocation_pct: 0.25,
  other_taxes_rate: 0,
}

/**
 * Replicates the Precificação sheet logic from the Excel spreadsheet.
 *
 * Formula chain:
 *   totalCost     = COG + freight + (COG+freight) * iof_rate
 *   discountAmt   = salePrice * coupon_pct
 *   iofAmount     = (COG + freight) * iof_rate
 *   checkoutFee   = salePrice * checkout_fee_rate
 *   gatewayFee    = salePrice * gateway_fee_rate
 *   otherTaxes    = salePrice * other_taxes_rate
 *   marketingBudget = salePrice * marketing_allocation_pct
 *   netProfit     = salePrice - discountAmt - (COG + freight) - iofAmount
 *                   - checkoutFee - gatewayFee - otherTaxes - marketingBudget
 *   cpaIdeal      = marketingBudget  (max spend per acquisition to preserve margin)
 *   cpaMax        = marketingBudget + netProfit  (absolute breakeven)
 *   roasMin       = salePrice / cpaIdeal
 */
export function calcPricing(inputs: PricingInputs): PricingCalc | null {
  const {
    cog_eur,
    freight_eur,
    sale_price_eur,
    coupon_pct,
    iof_rate,
    checkout_fee_rate,
    gateway_fee_rate,
    marketing_allocation_pct,
    other_taxes_rate,
  } = inputs

  if (!cog_eur || !sale_price_eur) return null

  const cog = cog_eur
  const freight = freight_eur ?? 0
  const salePrice = sale_price_eur
  const coupon = coupon_pct ?? 0

  const baseCost = cog + freight
  const iofAmount = baseCost * iof_rate
  const totalCost = baseCost + iofAmount

  const discountAmt = salePrice * coupon
  const effectiveSale = salePrice - discountAmt

  const checkoutFee = salePrice * checkout_fee_rate
  const gatewayFee = salePrice * gateway_fee_rate
  const otherTaxes = salePrice * other_taxes_rate
  const marketingBudget = salePrice * marketing_allocation_pct

  const netProfit =
    effectiveSale - totalCost - checkoutFee - gatewayFee - otherTaxes - marketingBudget

  const profitMarginPct = salePrice > 0 ? netProfit / salePrice : 0
  const markup = totalCost > 0 ? salePrice / totalCost : 0
  const cpaIdeal = marketingBudget
  const cpaMax = marketingBudget + netProfit
  const roasMin = cpaIdeal > 0 ? salePrice / cpaIdeal : 0

  return {
    totalCost,
    iofAmount,
    checkoutFee,
    gatewayFee,
    otherTaxes,
    marketingBudget,
    netProfit,
    profitMarginPct,
    markup,
    cpaIdeal,
    cpaMax,
    roasMin,
  }
}

/** Projeção de lucro a diferentes volumes de venda */
export const VOLUME_BREAKPOINTS = [50, 100, 500, 1_000, 5_000, 10_000] as const

export function calcVolumeProjections(
  calc: PricingCalc
): Array<{ units: number; profit: number }> {
  return VOLUME_BREAKPOINTS.map((units) => ({
    units,
    profit: calc.netProfit * units,
  }))
}

/** Formatação de moeda EUR */
export function fmtEur(value: number | null | undefined, decimals = 2): string {
  if (value == null) return '—'
  return `€${value.toFixed(decimals)}`
}

export function fmtPct(value: number | null | undefined): string {
  if (value == null) return '—'
  return `${(value * 100).toFixed(1)}%`
}
