import {
  TokenADA,
  TokenBNB,
  TokenBTC,
  TokenDOGE,
  TokenETH,
  TokenLTC,
  TokenMATIC,
  TokenSOL,
  TokenTRX,
  TokenUSDC,
  TokenUSDT,
  TokenXRP,
} from "@web3icons/react";
import { cn } from "@/lib/cn";

/**
 * Cryptocurrency mark, keyed by ticker symbol.
 *
 *   <CryptoIcon symbol="BTC" size="lg" />
 *
 * Artwork comes from `@web3icons/react` (MIT). That package ships ~1,800
 * tokens; importing them all would dominate the bundle, so this registry is
 * deliberately curated. **To add a currency**: import its `Token<SYMBOL>`
 * component above and add one line to `registry` below.
 *
 * NOTE: this component has not been checked against the Figma crypto icon
 * board — that frame was never available to read. Confirm the sizes and
 * treatment with design before relying on it in production.
 */

const registry = {
  BTC: TokenBTC,
  ETH: TokenETH,
  USDT: TokenUSDT,
  USDC: TokenUSDC,
  BNB: TokenBNB,
  SOL: TokenSOL,
  XRP: TokenXRP,
  ADA: TokenADA,
  DOGE: TokenDOGE,
  TRX: TokenTRX,
  LTC: TokenLTC,
  MATIC: TokenMATIC,
} as const;

export const CRYPTO_SYMBOLS = Object.keys(registry) as CryptoSymbol[];
export type CryptoSymbol = keyof typeof registry;

export const CRYPTO_ICON_SIZES = ["sm", "md", "lg", "xl"] as const;
export type CryptoIconSize = (typeof CRYPTO_ICON_SIZES)[number];

const pixels: Record<CryptoIconSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
};

type CryptoIconProps = {
  symbol: CryptoSymbol;
  size?: CryptoIconSize;
  /** `branded` uses the coin's own colours; `mono` inherits `currentColor`. */
  variant?: "branded" | "mono";
  className?: string;
};

export function CryptoIcon({
  symbol,
  size = "md",
  variant = "branded",
  className,
}: CryptoIconProps) {
  const Glyph = registry[symbol];
  const dimension = pixels[size];

  return (
    <Glyph
      size={dimension}
      variant={variant}
      aria-label={symbol}
      className={cn("shrink-0", className)}
    />
  );
}
