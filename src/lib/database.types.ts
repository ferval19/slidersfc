// Tipos de la base de datos.
//
// Escritos a mano a partir de supabase/migrations/*. Cuando instales la CLI de
// Supabase puedes regenerarlos con:
//   supabase gen types typescript --project-id <ref> > src/lib/database.types.ts

export type SliderScope = 'user' | 'cpu' | 'cpu_opponent' | 'cpu_teammate';

/** Nombres de usuario liberados, para que los enlaces viejos sigan yendo al sitio. */
export type UsernameHistory = {
  username: string;
  profile_id: string;
  released_at: string;
};

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  twitter_handle: string | null;
  bio: string | null;
  created_at: string;
};

export type Game = {
  id: number;
  slug: string;
  name: string;
  release_year: number | null;
};

export type SliderDefinition = {
  id: number;
  game_id: number;
  category: string;
  applies_to: SliderScope;
  name: string;
  slug: string;
  min_value: number;
  max_value: number;
  default_value: number;
  sort_order: number;
};

export type SliderSet = {
  id: string;
  owner_id: string;
  game_id: number;
  title: string;
  /** Lo pone un trigger al insertar y no cambia aunque cambie el título. */
  slug: string;
  description: string | null;
  version: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type SliderSetValue = {
  id: string;
  slider_set_id: string;
  slider_definition_id: number;
  value: number;
};

export type SliderComment = {
  id: string;
  slider_set_id: string;
  slider_definition_id: number | null;
  author_id: string;
  body: string;
  set_version: number;
  created_at: string;
};

type Insert<T, Optional extends keyof T> = Omit<T, Optional> & Partial<Pick<T, Optional>>;

/**
 * Las claves foráneas se declaran aquí porque postgrest-js las usa para tipar
 * los selects embebidos (`games ( ... )`, `profiles ( ... )`, `slider_comments ( count )`).
 */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Insert<
          Profile,
          'created_at' | 'display_name' | 'avatar_url' | 'twitter_handle' | 'bio'
        >;
        Update: Partial<Profile>;
        Relationships: [];
      };
      username_history: {
        Row: UsernameHistory;
        Insert: Insert<UsernameHistory, 'released_at'>;
        Update: Partial<UsernameHistory>;
        Relationships: [
          {
            foreignKeyName: 'username_history_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      games: {
        Row: Game;
        Insert: Insert<Game, 'id' | 'release_year'>;
        Update: Partial<Game>;
        Relationships: [];
      };
      slider_definitions: {
        Row: SliderDefinition;
        Insert: Insert<
          SliderDefinition,
          'id' | 'min_value' | 'max_value' | 'default_value' | 'sort_order'
        >;
        Update: Partial<SliderDefinition>;
        Relationships: [
          {
            foreignKeyName: 'slider_definitions_game_id_fkey';
            columns: ['game_id'];
            isOneToOne: false;
            referencedRelation: 'games';
            referencedColumns: ['id'];
          },
        ];
      };
      slider_sets: {
        Row: SliderSet;
        Insert: Insert<
          SliderSet,
          | 'id'
          | 'slug'
          | 'description'
          | 'version'
          | 'is_published'
          | 'created_at'
          | 'updated_at'
        >;
        Update: Partial<SliderSet>;
        Relationships: [
          {
            foreignKeyName: 'slider_sets_game_id_fkey';
            columns: ['game_id'];
            isOneToOne: false;
            referencedRelation: 'games';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'slider_sets_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      slider_set_values: {
        Row: SliderSetValue;
        Insert: Insert<SliderSetValue, 'id'>;
        Update: Partial<SliderSetValue>;
        Relationships: [
          {
            foreignKeyName: 'slider_set_values_slider_set_id_fkey';
            columns: ['slider_set_id'];
            isOneToOne: false;
            referencedRelation: 'slider_sets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'slider_set_values_slider_definition_id_fkey';
            columns: ['slider_definition_id'];
            isOneToOne: false;
            referencedRelation: 'slider_definitions';
            referencedColumns: ['id'];
          },
        ];
      };
      slider_comments: {
        Row: SliderComment;
        Insert: Insert<
          SliderComment,
          'id' | 'slider_definition_id' | 'set_version' | 'created_at'
        >;
        Update: Partial<SliderComment>;
        Relationships: [
          {
            foreignKeyName: 'slider_comments_slider_set_id_fkey';
            columns: ['slider_set_id'];
            isOneToOne: false;
            referencedRelation: 'slider_sets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'slider_comments_slider_definition_id_fkey';
            columns: ['slider_definition_id'];
            isOneToOne: false;
            referencedRelation: 'slider_definitions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'slider_comments_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<never, never>;
    Functions: {
      can_read_set: { Args: { target_set_id: string }; Returns: boolean };
      owns_set: { Args: { target_set_id: string }; Returns: boolean };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
