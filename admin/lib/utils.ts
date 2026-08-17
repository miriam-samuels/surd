import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateString?: string | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
    })
}

export const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    })
    const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).toLowerCase()

    return `${formattedDate} at ${formattedTime}`
}


export const calculateDaysRemaining = (endDateString?: string | null) => {
    if (!endDateString) return 0
    const end = new Date(endDateString)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
}

export function formatNumberWithCommas(value: string | number | undefined | null): string {
    if (value === undefined || value === null || value === "") return "";
    const str = String(value).replace(/,/g, "");
    if (isNaN(Number(str))) return str;
    
    const parts = str.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

/**
 * Formats a 0–1 float as a percentage string (e.g. 0.67 → "67%").
 * Returns "—" for null/undefined values.
 */
export function formatScore(value: number | null | undefined): string {
    if (value == null) return '—'
    return `${Math.round(value * 100)}%`
}

/**
 * Formats a percentage-point delta (e.g. 0.32 → "+32pp vs last quarter").
 * Returns null when there's no previous quarter data.
 */
export function formatDelta(
    delta: number | null | undefined
): { text: string; isPositive: boolean } | null {
    if (delta == null) return null
    const pp = Math.round(delta * 100)
    return {
        text: `${pp >= 0 ? '+' : ''}${pp}pp vs last quarter`,
        isPositive: pp >= 0,
    }
}

/**
 * Formats two ISO date strings as a human-readable range.
 * e.g. "2024-10-01" + "2024-10-07" → "October 1, 2024 – October 7, 2024"
 */
export function formatDateRange(start: string, end: string): string {
    const fmt = (d: Date) =>
        d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    return `${fmt(new Date(start))} – ${fmt(new Date(end))}`
}


export function snakeToSpaced(str?: string | null): string {
    if (!str) return ""
    return str
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase())
}
