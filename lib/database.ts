import { sql } from '@vercel/postgres';
import { Device, Origami } from './types';

export async function createDevice(deviceToken: string, deviceName?: string): Promise<Device> {
  const result = await sql`
    INSERT INTO devices (device_token, device_name, created_at, last_used)
    VALUES (${deviceToken}, ${deviceName || 'My iPad'}, NOW(), NOW())
    RETURNING id, device_token as "deviceToken", device_name as "deviceName", created_at as "createdAt", last_used as "lastUsed"
  `;
  return result.rows[0] as Device;
}

export async function verifyDevice(deviceToken: string): Promise<Device | null> {
  const result = await sql`
    SELECT id, device_token as "deviceToken", device_name as "deviceName", created_at as "createdAt", last_used as "lastUsed"
    FROM devices
    WHERE device_token = ${deviceToken}
  `;

  if (result.rows.length === 0) {
    return null;
  }

  // Update last used
  await sql`
    UPDATE devices
    SET last_used = NOW()
    WHERE device_token = ${deviceToken}
  `;

  return result.rows[0] as Device;
}

export async function getCachedOrigami(query: string): Promise<Origami | null> {
  try {
    const result = await sql`
      SELECT id, query, name, difficulty, category, steps, source_url as "sourceUrl", thumbnail_url as "thumbnailUrl"
      FROM origami_cache
      WHERE LOWER(query) = LOWER(${query})
    `;

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as Origami;
  } catch (error) {
    console.error('Error fetching cached origami:', error);
    return null;
  }
}

export async function cacheOrigami(query: string, origami: Origami): Promise<void> {
  try {
    await sql`
      INSERT INTO origami_cache (query, name, difficulty, category, steps, source_url, thumbnail_url, cached_at)
      VALUES (
        ${query},
        ${origami.name},
        ${origami.difficulty},
        ${origami.category},
        ${JSON.stringify(origami.steps)},
        ${origami.sourceUrl || null},
        ${origami.thumbnailUrl || null},
        NOW()
      )
      ON CONFLICT (query) DO UPDATE
      SET
        name = EXCLUDED.name,
        difficulty = EXCLUDED.difficulty,
        category = EXCLUDED.category,
        steps = EXCLUDED.steps,
        source_url = EXCLUDED.source_url,
        thumbnail_url = EXCLUDED.thumbnail_url,
        cached_at = NOW()
    `;
  } catch (error) {
    console.error('Error caching origami:', error);
  }
}
