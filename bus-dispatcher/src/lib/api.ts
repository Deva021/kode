import { supabase } from './supabase';

export interface Route {
  id: number;
  origin: string;
  destination: string;
  price: number;
  created_at: string;
}

export interface Schedule {
  id: number;
  route_id: number;
  departure_time: string;
  bus_plate_number: string;
  total_seats: number;
  booked_seats: number;
  created_at: string;
  route?: Route;
}

export interface ScheduleWithRoute extends Schedule {
  route: Route;
  unbooked_seats: number;
}

/**
 * Fetch all unique destinations from routes
 */
export async function getUniqueDestinations(): Promise<string[]> {
  const { data, error } = await supabase
    .from('routes')
    .select('destination')
    .order('destination');

  if (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }

  // Get unique destinations
  const uniqueDestinations = [...new Set(data.map(r => r.destination))];
  return uniqueDestinations;
}

/**
 * Fetch the next upcoming schedule for each unique destination
 * @param searchQuery - Optional search/filter query for destination
 */
export async function getGroupedSchedules(searchQuery?: string): Promise<ScheduleWithRoute[]> {
  try {
    // Build the query
    let query = supabase
      .from('schedules')
      .select(`
        *,
        route:routes(*)
      `)
      .gte('departure_time', new Date().toISOString())
      .order('departure_time', { ascending: true });

    // If there's a search query, filter by destination
    if (searchQuery) {
      query = query.ilike('route.destination', `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching schedules:', error);
      return [];
    }

    if (!data) return [];

    // Group by destination and pick the first (earliest) for each
    const groupedMap = new Map<string, ScheduleWithRoute>();

    for (const schedule of data) {
      if (!schedule.route) continue;

      const destination = schedule.route.destination;

      if (!groupedMap.has(destination)) {
        groupedMap.set(destination, {
          ...schedule,
          route: schedule.route,
          unbooked_seats: schedule.total_seats - schedule.booked_seats,
        });
      }
    }

    return Array.from(groupedMap.values());
  } catch (err) {
    console.error('Unexpected error:', err);
    return [];
  }
}

/**
 * Search destinations by query string
 */
export async function searchDestinations(query: string): Promise<string[]> {
  if (!query || query.trim() === '') {
    return getUniqueDestinations();
  }

  const { data, error } = await supabase
    .from('routes')
    .select('destination')
    .ilike('destination', `%${query}%`)
    .order('destination');

  if (error) {
    console.error('Error searching destinations:', error);
    return [];
  }

  const uniqueDestinations = [...new Set(data.map(r => r.destination))];
  return uniqueDestinations;
}
