export const example = `
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
        Relationships: [];
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
        Relationships: [];
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
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"])
  ? (PublicSchema["Tables"])[PublicTableNameOrOptions] extends {
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
`;
