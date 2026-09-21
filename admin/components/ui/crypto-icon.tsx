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
