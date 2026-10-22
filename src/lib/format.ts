// src/lib/format.ts
const nairaFormatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
});

const nairaFormatterPrecise = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

/** ₦12,500 (whole naira unless the amount has kobo) */
export const formatNaira = (value: number | string | null | undefined) => {
    const amount = Number(value) || 0;
    return Number.isInteger(amount) ? nairaFormatter.format(amount) : nairaFormatterPrecise.format(amount);
};

export const formatDate = (value: string | number | Date | null | undefined, options?: Intl.DateTimeFormatOptions) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-NG', options ?? { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatDateTime = (value: string | number | Date | null | undefined) =>
    formatDate(value, { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });

export const timeAgo = (value: string | number | Date | null | undefined) => {
    if (!value) return '';
    const seconds = Math.round((Date.now() - new Date(value).getTime()) / 1000);
    if (Number.isNaN(seconds)) return '';
    const units: [number, Intl.RelativeTimeFormatUnit][] = [
        [60, 'second'],
        [60, 'minute'],
        [24, 'hour'],
        [7, 'day'],
        [4.345, 'week'],
        [12, 'month'],
        [Number.POSITIVE_INFINITY, 'year'],
    ];
    let amount = seconds;
    for (const [step, unit] of units) {
        if (Math.abs(amount) < step) {
            return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-Math.round(amount), unit);
        }
        amount /= step;
    }
    return '';
};

export const initials = (first?: string, last?: string, fallback?: string) => {
    const value = `${(first || '').trim().charAt(0)}${(last || '').trim().charAt(0)}`.toUpperCase();
    return value || (fallback || '?').trim().charAt(0).toUpperCase();
};

export const fullName = (user?: { firstName?: string; lastName?: string; name?: string; email?: string } | null) =>
    user ? ([user.firstName, user.lastName].filter(Boolean).join(' ') || user.name || user.email || 'Customer') : '';
