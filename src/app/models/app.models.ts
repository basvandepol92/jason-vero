export interface AppSettings {
    show_schedule: boolean;
    show_map: boolean;
    show_feed: boolean;
    show_info: boolean;
    event_name?: string;
    event_date?: string; // ISO 8601
}

export interface NewsItem {
    id: number;
    status: string;
    date_created: string;
    title: string;
    content: string;
    image?: string; // UUID from Directus
    publish_date: string; // ISO 8601
    is_pinned?: boolean;
    subtitle?: string;
}

export interface ScheduleItem {
    id: number;
    status: string;
    title: string;
    start_time: string; // ISO 8601
    end_time: string; // ISO 8601
    location: string;
    description?: string;
    artist?: string;
    image?: string;
    day?: 'Friday' | 'Saturday' | 'Sunday' | string;
    icon_type?: 'music' | 'food' | 'activity' | 'speech' | 'party' | 'other';
}

export interface LocationItem {
    id: number;
    status: string;
    name: string;
    coord_x: number; // 0-100
    coord_y: number; // 0-100
    description?: string;
    image?: string;
    type: 'stage' | 'lodge' | 'toilets' | 'entrance' | 'other';
}

export interface InfoItem {
    id: number;
    status: string;
    title: string;
    content: string; // HTML or Markdown
    icon?: string;
    category: string;
    button_text?: string;
    button_url?: string;
    sort_order: number;
}
