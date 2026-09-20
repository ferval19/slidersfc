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
  youtube_url: string | null;
  bio: string | null;
  created_at: string;
};

export type Game = {
  id: number;
  slug: string;
  name: string;
  release_year: number | null;
  /** Si el juego deja elegir cómo se comporta la CPU. FC27 sí, FC26 no. */
  has_cpu_behaviour: boolean;
};

/**
 * Cómo se comporta la CPU. Sólo en `custom` significan algo los sliders de la
 * pestaña de controles de la CPU; en los otros dos los ajusta el juego solo.
 */
export type CpuBehaviour = 'custom' | 'tactical' | 'dynamic';

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
  cpu_behaviour: CpuBehaviour;
  /**
   * Las condiciones en las que se probó. Todo opcional.
   *
   * `difficulty` se queda en `string` y no en la unión estrecha a propósito:
   * si algún día la base trae un valor que la aplicación no conoce, la ficha
   * se limita a no ponerle etiqueta en vez de romperse. La unión buena, con
   * sus etiquetas, vive en `src/lib/set-conditions.ts`.
   */
  difficulty: string | null;
  /** «8» o «7-8». Texto porque mucha gente juega con un rango. */
  half_length: string | null;
  camera: string | null;
  camera_height: number | null;
  camera_zoom: number | null;
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

/** Una entrada del historial: la versión que estrena, y por qué. */
export type SetVersion = {
  slider_set_id: string;
  version: number;
  note: string | null;
  created_at: string;
};

/** Un valor que cambió al pasar de una versión a la siguiente. */
export type SetChange = {
  slider_set_id: string;
  version: number;
  slider_definition_id: number;
  from_value: number;
  to_value: number;
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
          'created_at' | 'display_name' | 'avatar_url' | 'twitter_handle' | 'youtube_url' | 'bio'
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
        Insert: Insert<Game, 'id' | 'release_year' | 'has_cpu_behaviour'>;
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
          | 'cpu_behaviour'
          | 'difficulty'
          | 'half_length'
          | 'camera'
          | 'camera_height'
          | 'camera_zoom'
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
      slider_set_versions: {
        Row: SetVersion;
        Insert: Insert<SetVersion, 'note' | 'created_at'>;
        Update: Partial<SetVersion>;
        Relationships: [
          {
            foreignKeyName: 'slider_set_versions_slider_set_id_fkey';
            columns: ['slider_set_id'];
            isOneToOne: false;
            referencedRelation: 'slider_sets';
            referencedColumns: ['id'];
          },
        ];
      };
      slider_set_changes: {
        Row: SetChange;
        Insert: Insert<SetChange, never>;
        Update: Partial<SetChange>;
        Relationships: [
          {
            foreignKeyName: 'slider_set_changes_slider_definition_id_fkey';
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
