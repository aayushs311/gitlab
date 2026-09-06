import type { Buckets, SortableKey } from '../buckets.ts';

export interface Categorizer {
  rebucket(buckets: Buckets<SortableKey>): Buckets<SortableKey>;
}
