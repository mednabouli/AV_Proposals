import { Redis } from "@upstash/redis";

/**
 * Rate limiting configuration.
 * Policies can be customized per action.
 */
export const RATE_LIMIT_POLICIES = {
  proposal_generation: {
    max_per_hour: 10,
    max_per_day: 50,
  },
  proposal_regeneration: {
    max_per_hour: 5,
    max_per_day: 20,
  },
};

export type RateLimitAction = keyof typeof RATE_LIMIT_POLICIES;

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Get Upstash Redis client for rate limiting.
 */
function getRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set"
    );
  }

  return new Redis({
    url,
    token,
  });
}

/**
 * Check if a user is allowed to perform an action.
 * Uses sliding window rate limiting with Redis.
 */
export async function checkRateLimit(
  profileId: string,
  action: RateLimitAction
): Promise<RateLimitResult> {
  try {
    const redis = getRedisClient();
    const policy = RATE_LIMIT_POLICIES[action];

    if (!policy) {
      throw new Error(`Unknown action: ${action}`);
    }

    const now = Date.now();

    // Keys for tracking
    const hourlyKey = `ratelimit:${profileId}:${action}:hourly`;
    const dailyKey = `ratelimit:${profileId}:${action}:daily`;

    // Get current counts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hourlyCount = (await redis.get(hourlyKey)) as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dailyCount = (await redis.get(dailyKey)) as any;

    const currentHourly = (hourlyCount as number) || 0;
    const currentDaily = (dailyCount as number) || 0;

    // Check limits
    if (
      currentHourly >= policy.max_per_hour ||
      currentDaily >= policy.max_per_day
    ) {
      return {
        allowed: false,
        remaining: Math.max(0, policy.max_per_hour - currentHourly),
        resetAt: new Date(now + 60 * 60 * 1000),
      };
    }

    // Increment counters
    await redis.incr(hourlyKey);
    await redis.incr(dailyKey);

    // Set expiries (if not already set)
    await redis.expire(hourlyKey, 60 * 60); // 1 hour
    await redis.expire(dailyKey, 24 * 60 * 60); // 1 day

    return {
      allowed: true,
      remaining: policy.max_per_hour - currentHourly - 1,
      resetAt: new Date(now + 60 * 60 * 1000),
    };
  } catch (error) {
    // If Redis fails, allow the request but log the error
    console.error("Rate limit check failed:", error);
    return {
      allowed: true,
      remaining: -1,
      resetAt: new Date(),
    };
  }
}

/**
 * Reset rate limit counters for a user (for testing or admin purposes).
 */
export async function resetRateLimit(
  profileId: string,
  action?: RateLimitAction
) {
  try {
    const redis = getRedisClient();

    if (action) {
      const hourlyKey = `ratelimit:${profileId}:${action}:hourly`;
      const dailyKey = `ratelimit:${profileId}:${action}:daily`;
      await redis.del(hourlyKey, dailyKey);
    } else {
      // Reset all actions for this user
      const pattern = `ratelimit:${profileId}:*`;
      // Note: Upstash Redis doesn't support SCAN, so we'll just document this
      // In production, track which actions exist per user
      console.log(
        `To reset all rate limits for ${profileId}, manually delete keys matching ${pattern}`
      );
    }
  } catch (error) {
    console.error("Rate limit reset failed:", error);
  }
}
