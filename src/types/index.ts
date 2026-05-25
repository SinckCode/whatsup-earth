// ─── User ───────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  name: string;
  country: string;
  role: 'user' | 'admin';
  avatar?: string;
  bio?: string;
  isVerified?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  defaultCategory: string;
  defaultView: 'map' | 'timeline' | 'stats';
  defaultTimeRange: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ─── Events ─────────────────────────────────────────────

export interface EonetEvent {
  eonetId: string;
  title: string;
  description?: string;
  category: string;
  status: 'open' | 'closed';
  coordinates?: number[];
  magnitude?: number;
  startDate?: string;
  endDate?: string;
  source?: string;
  country?: string;
  region?: string;
}

export interface Category {
  slug: string;
  name: string;
  eonetId: string;
  description?: string;
  icon?: string;
  color: string;
  isActive: boolean;
}

// ─── Favorites ──────────────────────────────────────────

export interface Favorite {
  _id: string;
  userId: number;
  eventId: string;
  title: string;
  category: string;
  link?: string;
  coordinates?: number[];
  firstDate?: string;
  lastDate?: string;
  note?: string;
  severity?: number;
  magnitude?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Saved Views ────────────────────────────────────────

export interface SavedViewFilters {
  categories: string[];
  countries: string[];
  dateRange: {
    type: string;
    value: number;
  };
  severity: {
    min: number | null;
    max: number | null;
  };
}

export interface SavedView {
  _id: string;
  userId: number;
  name: string;
  description?: string;
  filters: SavedViewFilters;
  isPublic: boolean;
  tags: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Alerts ─────────────────────────────────────────────

export interface Alert {
  id: number;
  userId: number;
  categorySlug: string;
  regions: string[];
  countries: string[];
  severityMin: number;
  isActive: boolean;
  notifyByEmail: boolean;
  lastTriggeredAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Regions ────────────────────────────────────────────

export interface Region {
  id: number;
  userId: number;
  name: string;
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
  isDefault: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Notifications (nueva) ──────────────────────────────

export interface Notification {
  id: number;
  userId: number;
  type: 'alert_triggered' | 'event_update' | 'system';
  title: string;
  message: string;
  eventId?: string;
  alertId?: number;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Comments (nueva) ───────────────────────────────────

export interface Comment {
  _id: string;
  userId: number;
  userName: string;
  eventId: string;
  content: string;
  parentId?: string | null;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

// ─── Event Stats (nueva) ────────────────────────────────

export interface EventStats {
  eventId: string;
  viewCount: number;
  favoriteCount: number;
  commentCount: number;
  lastViewedAt?: string;
}

// ─── Activity Log ───────────────────────────────────────

export interface ActivityLog {
  id: number;
  userId: number;
  action: string;
  meta: Record<string, unknown>;
  ip?: string;
  createdAt: string;
}

// ─── API Pagination ─────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}
