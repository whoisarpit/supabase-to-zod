export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
          owner_id: number;
          status: Database["public"]["Enums"]["project_status"];
          settings: Json;
          metadata: Json | null;
          is_archived: boolean;
          team_id: number;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          owner_id: number;
          status?: Database["public"]["Enums"]["project_status"];
          settings?: Json;
          metadata?: Json | null;
          is_archived?: boolean;
          team_id: number;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          owner_id?: number;
          status?: Database["public"]["Enums"]["project_status"];
          settings?: Json;
          metadata?: Json | null;
          is_archived?: boolean;
          team_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "projects_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "projects_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          }
        ];
      };
      tasks: {
        Row: {
          id: number;
          title: string;
          description: string | null;
          created_at: string;
          updated_at: string;
          due_date: string | null;
          assignee_id: number | null;
          project_id: number;
          priority: Database["public"]["Enums"]["priority_level"];
          status: Database["public"]["Enums"]["task_status"];
          labels: string[];
          metadata: Json | null;
        };
        Insert: {
          id?: number;
          title: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          due_date?: string | null;
          assignee_id?: number | null;
          project_id: number;
          priority?: Database["public"]["Enums"]["priority_level"];
          status?: Database["public"]["Enums"]["task_status"];
          labels?: string[];
          metadata?: Json | null;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          due_date?: string | null;
          assignee_id?: number | null;
          project_id?: number;
          priority?: Database["public"]["Enums"]["priority_level"];
          status?: Database["public"]["Enums"]["task_status"];
          labels?: string[];
          metadata?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_assignee_id_fkey";
            columns: ["assignee_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      teams: {
        Row: {
          id: number;
          name: string;
          created_at: string;
          updated_at: string;
          organization_id: number;
          settings: Json;
        };
        Insert: {
          id?: number;
          name: string;
          created_at?: string;
          updated_at?: string;
          organization_id: number;
          settings?: Json;
        };
        Update: {
          id?: number;
          name?: string;
          created_at?: string;
          updated_at?: string;
          organization_id?: number;
          settings?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "teams_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          }
        ];
      };
      organizations: {
        Row: {
          id: number;
          name: string;
          created_at: string;
          subscription_tier: Database["public"]["Enums"]["subscription_tier"];
          settings: Json;
          billing_email: string;
          subscription_status: Database["public"]["Enums"]["subscription_status"];
        };
        Insert: {
          id?: number;
          name: string;
          created_at?: string;
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"];
          settings?: Json;
          billing_email: string;
          subscription_status?: Database["public"]["Enums"]["subscription_status"];
        };
        Update: {
          id?: number;
          name?: string;
          created_at?: string;
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"];
          settings?: Json;
          billing_email?: string;
          subscription_status?: Database["public"]["Enums"]["subscription_status"];
        };
        Relationships: [];
      };
      users: {
        Row: {
          id: number;
          email: string;
          full_name: string | null;
          created_at: string;
          last_login: string | null;
          avatar_url: string | null;
          role: Database["public"]["Enums"]["user_role"];
          preferences: Json;
        };
        Insert: {
          id?: number;
          email: string;
          full_name?: string | null;
          created_at?: string;
          last_login?: string | null;
          avatar_url?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          preferences?: Json;
        };
        Update: {
          id?: number;
          email?: string;
          full_name?: string | null;
          created_at?: string;
          last_login?: string | null;
          avatar_url?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          preferences?: Json;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_tasks: {
        Args: {
          user_id: number;
        };
        Returns: {
          task_id: number;
          title: string;
          due_date: string;
          project_name: string;
          status: Database["public"]["Enums"]["task_status"];
        }[];
      };
      get_team_stats: {
        Args: {
          team_id: number;
        };
        Returns: {
          total_projects: number;
          active_tasks: number;
          completed_tasks: number;
          team_members: number;
        }[];
      };
    };
    Enums: {
      project_status:
        | "planning"
        | "active"
        | "on_hold"
        | "completed"
        | "cancelled";
      task_status: "todo" | "in_progress" | "review" | "completed";
      priority_level: "low" | "medium" | "high" | "urgent";
      user_role: "admin" | "member" | "guest";
      subscription_tier: "free" | "pro" | "enterprise";
      subscription_status: "active" | "past_due" | "cancelled" | "trial";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
