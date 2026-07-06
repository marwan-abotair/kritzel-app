type RateLimitOptions = {
    key: string;
    limit: number;
    windowMs: number;
    action: string;
};

const attempts = new Map<string, number[]>();

export function assertRateLimit(options: RateLimitOptions) {
    const now = Date.now();
    const windowStart = now - options.windowMs;

    const previousAttempts = attempts.get(options.key) ?? [];
    const recentAttempts = previousAttempts.filter(timestamp => timestamp > windowStart);

    if (recentAttempts.length >= options.limit) {
        throw new Error(`Rate limit exceeded for ${options.action}`);
    }

    recentAttempts.push(now);
    attempts.set(options.key, recentAttempts);
}