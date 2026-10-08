/**
 * Wraps a Prisma query so ISR prerendering never fails when the database is
 * unreachable at build time — the page renders with fallback data instead,
 * and the next revalidation cycle retries the database.
 */
export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const msg = err instanceof Error ? err.message.split('\n')[0] : String(err);
    console.error(`[db] query failed, using fallback (${msg.slice(0, 140)})`);
    return fallback;
  }
}
