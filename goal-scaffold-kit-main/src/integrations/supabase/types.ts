export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          description: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          description: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          description?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_presence: {
        Row: {
          last_seen_at: string
          status: Database["public"]["Enums"]["presence_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          last_seen_at?: string
          status?: Database["public"]["Enums"]["presence_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          last_seen_at?: string
          status?: Database["public"]["Enums"]["presence_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_presence_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_reply_drafts: {
        Row: {
          agent_id: string
          created_at: string
          draft_content: string
          edited: boolean
          id: string
          knowledge_article_ids: string[]
          model_identifier: string | null
          sent_message_id: string | null
          ticket_id: string
          used: boolean
          used_at: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string
          draft_content: string
          edited?: boolean
          id?: string
          knowledge_article_ids?: string[]
          model_identifier?: string | null
          sent_message_id?: string | null
          ticket_id: string
          used?: boolean
          used_at?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string
          draft_content?: string
          edited?: boolean
          id?: string
          knowledge_article_ids?: string[]
          model_identifier?: string | null
          sent_message_id?: string | null
          ticket_id?: string
          used?: boolean
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_reply_drafts_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_reply_drafts_sent_message_id_fkey"
            columns: ["sent_message_id"]
            isOneToOne: false
            referencedRelation: "ticket_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_reply_drafts_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          audience: string
          body: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          audience?: string
          body: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          audience?: string
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_otps: {
        Row: {
          attempts: number
          code_hash: string
          created_at: string
          email: string
          expires_at: string
          id: string
          purpose: string
          salt: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          attempts?: number
          code_hash: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          purpose: string
          salt: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          attempts?: number
          code_hash?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          purpose?: string
          salt?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auth_otps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_ai_logs: {
        Row: {
          conversation_id: string | null
          created_at: string
          detail: string | null
          duration_ms: number | null
          event: string
          http_status: number | null
          id: string
          level: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          detail?: string | null
          duration_ms?: number | null
          event: string
          http_status?: number | null
          id?: string
          level?: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          detail?: string | null
          duration_ms?: number | null
          event?: string
          http_status?: number | null
          id?: string
          level?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_ai_logs_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_config: {
        Row: {
          ai_enabled: boolean
          id: number
          last_error: string | null
          last_error_at: string | null
          last_success_at: string | null
          n8n_webhook_url: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          ai_enabled?: boolean
          id?: number
          last_error?: string | null
          last_error_at?: string | null
          last_success_at?: string | null
          n8n_webhook_url?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          ai_enabled?: boolean
          id?: number
          last_error?: string | null
          last_error_at?: string | null
          last_success_at?: string | null
          n8n_webhook_url?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_config_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          agent_name: string | null
          assigned_agent_id: string | null
          closed_at: string | null
          closed_by: string | null
          created_at: string
          customer_email: string
          customer_id: string
          customer_last_read_at: string
          customer_name: string
          id: string
          last_message: string | null
          last_message_at: string
          mode: Database["public"]["Enums"]["chat_mode"]
          staff_last_read_at: string
          status: Database["public"]["Enums"]["chat_status"]
          ticket_id: string | null
          updated_at: string
        }
        Insert: {
          agent_name?: string | null
          assigned_agent_id?: string | null
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          customer_email?: string
          customer_id: string
          customer_last_read_at?: string
          customer_name?: string
          id?: string
          last_message?: string | null
          last_message_at?: string
          mode?: Database["public"]["Enums"]["chat_mode"]
          staff_last_read_at?: string
          status?: Database["public"]["Enums"]["chat_status"]
          ticket_id?: string | null
          updated_at?: string
        }
        Update: {
          agent_name?: string | null
          assigned_agent_id?: string | null
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          customer_email?: string
          customer_id?: string
          customer_last_read_at?: string
          customer_name?: string
          id?: string
          last_message?: string | null
          last_message_at?: string
          mode?: Database["public"]["Enums"]["chat_mode"]
          staff_last_read_at?: string
          status?: Database["public"]["Enums"]["chat_status"]
          ticket_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_closed_by_fkey"
            columns: ["closed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          attachment_name: string | null
          attachment_type: string | null
          attachment_url: string | null
          client_id: string | null
          conversation_id: string
          created_at: string
          id: string
          is_ai: boolean
          message: string
          sender_id: string | null
          sender_name: string
          sender_type: Database["public"]["Enums"]["chat_sender"]
        }
        Insert: {
          attachment_name?: string | null
          attachment_type?: string | null
          attachment_url?: string | null
          client_id?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          is_ai?: boolean
          message?: string
          sender_id?: string | null
          sender_name?: string
          sender_type: Database["public"]["Enums"]["chat_sender"]
        }
        Update: {
          attachment_name?: string | null
          attachment_type?: string | null
          attachment_url?: string | null
          client_id?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          is_ai?: boolean
          message?: string
          sender_id?: string | null
          sender_name?: string
          sender_type?: Database["public"]["Enums"]["chat_sender"]
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          is_published: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          is_published?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          is_published?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      kb_articles: {
        Row: {
          body: string
          category_id: string | null
          created_at: string
          created_by: string | null
          id: string
          is_published: boolean
          search_vector: unknown
          subcategory_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean
          search_vector?: unknown
          subcategory_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean
          search_vector?: unknown
          subcategory_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kb_articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "kb_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kb_articles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kb_articles_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "kb_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      kb_subcategories: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kb_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "kb_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      mail_messages: {
        Row: {
          attachments: Json
          body: string
          created_at: string
          created_by: string | null
          delivery_status: string
          direction: string
          from_address: string
          id: string
          links: string[]
          thread_id: string
          to_address: string
        }
        Insert: {
          attachments?: Json
          body?: string
          created_at?: string
          created_by?: string | null
          delivery_status?: string
          direction: string
          from_address: string
          id?: string
          links?: string[]
          thread_id: string
          to_address: string
        }
        Update: {
          attachments?: Json
          body?: string
          created_at?: string
          created_by?: string | null
          delivery_status?: string
          direction?: string
          from_address?: string
          id?: string
          links?: string[]
          thread_id?: string
          to_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "mail_messages_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mail_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "mail_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      mail_threads: {
        Row: {
          created_at: string
          created_by: string | null
          first_reply_at: string | null
          first_sent_at: string | null
          from_address: string
          id: string
          last_message_at: string
          subject: string
          to_address: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          first_reply_at?: string | null
          first_sent_at?: string | null
          from_address: string
          id?: string
          last_message_at?: string
          subject: string
          to_address: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          first_reply_at?: string | null
          first_sent_at?: string | null
          from_address?: string
          id?: string
          last_message_at?: string
          subject?: string
          to_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "mail_threads_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          chat_id: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          read_at: string | null
          ticket_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          chat_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          read_at?: string | null
          ticket_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          chat_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          read_at?: string | null
          ticket_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      password_reset_codes: {
        Row: {
          attempts: number
          code: string
          created_at: string
          expires_at: string
          id: string
          used_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          attempts?: number
          code: string
          created_at?: string
          expires_at?: string
          id?: string
          used_at?: string | null
          user_id: string
          username: string
        }
        Update: {
          attempts?: number
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          used_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "password_reset_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          description: string
          key: string
        }
        Insert: {
          description?: string
          key: string
        }
        Update: {
          description?: string
          key?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active_session_id: string | null
          avatar_url: string | null
          company_email: string | null
          company_email_verified_at: string | null
          company_name: string | null
          company_website: string | null
          created_at: string
          department_id: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean
          last_login_at: string | null
          must_change_password: boolean
          password_changed_at: string | null
          phone: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          active_session_id?: string | null
          avatar_url?: string | null
          company_email?: string | null
          company_email_verified_at?: string | null
          company_name?: string | null
          company_website?: string | null
          created_at?: string
          department_id?: string | null
          email?: string
          full_name?: string
          id: string
          is_active?: boolean
          last_login_at?: string | null
          must_change_password?: boolean
          password_changed_at?: string | null
          phone?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          active_session_id?: string | null
          avatar_url?: string | null
          company_email?: string | null
          company_email_verified_at?: string | null
          company_name?: string | null
          company_website?: string | null
          created_at?: string
          department_id?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          must_change_password?: boolean
          password_changed_at?: string | null
          phone?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_key: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          permission_key: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          permission_key?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_key_fkey"
            columns: ["permission_key"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["key"]
          },
        ]
      }
      settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      ticket_activity: {
        Row: {
          action: string
          created_at: string
          description: string
          id: string
          is_internal: boolean
          metadata: Json
          ticket_id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          description: string
          id?: string
          is_internal?: boolean
          metadata?: Json
          ticket_id: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          description?: string
          id?: string
          is_internal?: boolean
          metadata?: Json
          ticket_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_activity_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_attachments: {
        Row: {
          checksum_sha256: string | null
          created_at: string
          detected_type: string | null
          file_size: number
          file_type: string
          id: string
          message_id: string | null
          original_filename: string
          storage_path: string
          ticket_id: string
          uploaded_by: string | null
        }
        Insert: {
          checksum_sha256?: string | null
          created_at?: string
          detected_type?: string | null
          file_size: number
          file_type: string
          id?: string
          message_id?: string | null
          original_filename: string
          storage_path: string
          ticket_id: string
          uploaded_by?: string | null
        }
        Update: {
          checksum_sha256?: string | null
          created_at?: string
          detected_type?: string | null
          file_size?: number
          file_type?: string
          id?: string
          message_id?: string | null
          original_filename?: string
          storage_path?: string
          ticket_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "ticket_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_attachments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_cc_emails: {
        Row: {
          added_by: string | null
          created_at: string
          email: string
          id: string
          ticket_id: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          email: string
          id?: string
          ticket_id: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          email?: string
          id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_cc_emails_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_cc_emails_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_custom_fields: {
        Row: {
          created_at: string
          field_type: string
          id: string
          is_active: boolean
          is_required: boolean
          label: string
          options: string[]
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          field_type?: string
          id?: string
          is_active?: boolean
          is_required?: boolean
          label: string
          options?: string[]
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          field_type?: string
          id?: string
          is_active?: boolean
          is_required?: boolean
          label?: string
          options?: string[]
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          message_type: Database["public"]["Enums"]["message_type"]
          sender_id: string | null
          ticket_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          message_type: Database["public"]["Enums"]["message_type"]
          sender_id?: string | null
          ticket_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          message_type?: Database["public"]["Enums"]["message_type"]
          sender_id?: string | null
          ticket_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_agent_id: string | null
          category_id: string | null
          closed_at: string | null
          created_at: string
          custom_fields: Json
          customer_email: string
          customer_id: string
          customer_name: string
          customer_phone: string | null
          department_id: string | null
          description: string
          first_response_at: string | null
          id: string
          last_activity_at: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          reopened_at: string | null
          resolution_due_at: string | null
          response_due_at: string | null
          sla_level: number | null
          solved_at: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          ticket_number: string
          updated_at: string
        }
        Insert: {
          assigned_agent_id?: string | null
          category_id?: string | null
          closed_at?: string | null
          created_at?: string
          custom_fields?: Json
          customer_email?: string
          customer_id: string
          customer_name?: string
          customer_phone?: string | null
          department_id?: string | null
          description: string
          first_response_at?: string | null
          id?: string
          last_activity_at?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          reopened_at?: string | null
          resolution_due_at?: string | null
          response_due_at?: string | null
          sla_level?: number | null
          solved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          ticket_number: string
          updated_at?: string
        }
        Update: {
          assigned_agent_id?: string | null
          category_id?: string | null
          closed_at?: string | null
          created_at?: string
          custom_fields?: Json
          customer_email?: string
          customer_id?: string
          customer_name?: string
          customer_phone?: string | null
          department_id?: string | null
          description?: string
          first_response_at?: string | null
          id?: string
          last_activity_at?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          reopened_at?: string | null
          resolution_due_at?: string | null
          response_due_at?: string | null
          sla_level?: number | null
          solved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          ticket_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_sla_level: {
        Args: {
          _level: number
          _t: Database["public"]["Tables"]["tickets"]["Row"]
        }
        Returns: {
          assigned_agent_id: string | null
          category_id: string | null
          closed_at: string | null
          created_at: string
          custom_fields: Json
          customer_email: string
          customer_id: string
          customer_name: string
          customer_phone: string | null
          department_id: string | null
          description: string
          first_response_at: string | null
          id: string
          last_activity_at: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          reopened_at: string | null
          resolution_due_at: string | null
          response_due_at: string | null
          sla_level: number | null
          solved_at: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          ticket_number: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "tickets"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      assign_chat: {
        Args: { _agent: string; _conv: string }
        Returns: undefined
      }
      can_access_chat: {
        Args: { _conv: string; _user_id: string }
        Returns: boolean
      }
      can_view_ticket: {
        Args: { _ticket_id: string; _user_id: string }
        Returns: boolean
      }
      chat_availability: { Args: never; Returns: Json }
      chat_escalate: {
        Args: { _conv: string; _source: string }
        Returns: undefined
      }
      chat_report_ai_error: {
        Args: { _conv: string; _detail: string }
        Returns: undefined
      }
      chat_system: {
        Args: { _conv: string; _text: string }
        Returns: undefined
      }
      chat_unread_counts: {
        Args: never
        Returns: {
          conversation_id: string
          unread: number
        }[]
      }
      classify_sla_level: { Args: { _text: string }; Returns: number }
      close_chat: { Args: { _conv: string }; Returns: undefined }
      create_ticket_from_chat: {
        Args: { _conv: string; _subject: string }
        Returns: Json
      }
      customer_list: {
        Args: { _limit?: number; _offset?: number; _q?: string }
        Returns: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          last_activity: string
          open: number
          phone: string
          solved: number
          total: number
          total_count: number
        }[]
      }
      dashboard_stats: { Args: { _days?: number }; Returns: Json }
      has_permission: {
        Args: { _perm: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_active_user: { Args: { _user_id: string }; Returns: boolean }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_agent_online: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      kb_search: {
        Args: { _limit?: number; _q: string }
        Returns: {
          category_name: string
          id: string
          rank: number
          snippet: string
          title: string
        }[]
      }
      mark_chat_read: { Args: { _conv: string }; Returns: undefined }
      my_department_id: { Args: never; Returns: string }
      my_permissions: { Args: never; Returns: string[] }
      notify: {
        Args: {
          _msg: string
          _ticket: string
          _title: string
          _type: string
          _user: string
        }
        Returns: undefined
      }
      notify_admins: {
        Args: {
          _except: string
          _msg: string
          _ticket: string
          _title: string
          _type: string
        }
        Returns: undefined
      }
      notify_chat: {
        Args: {
          _chat: string
          _msg: string
          _title: string
          _type: string
          _user: string
        }
        Returns: undefined
      }
      record_login: { Args: never; Returns: undefined }
      report_stats: {
        Args: { _bucket?: string; _from: string; _to: string }
        Returns: Json
      }
      request_human: { Args: { _conv: string }; Returns: undefined }
      search_tickets: {
        Args: {
          _agent?: string
          _category?: string
          _customer?: string
          _department?: string
          _from?: string
          _limit?: number
          _offset?: number
          _priority?: Database["public"]["Enums"]["ticket_priority"][]
          _q?: string
          _sort?: string
          _status?: Database["public"]["Enums"]["ticket_status"][]
          _to?: string
          _unassigned?: boolean
          _updated_from?: string
        }
        Returns: {
          agent_name: string
          assigned_agent_id: string
          category_id: string
          category_name: string
          created_at: string
          customer_email: string
          customer_id: string
          customer_name: string
          customer_phone: string
          department_id: string
          department_name: string
          id: string
          last_activity_at: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          ticket_number: string
          total_count: number
          updated_at: string
        }[]
      }
      set_chat_mode: {
        Args: { _conv: string; _mode: Database["public"]["Enums"]["chat_mode"] }
        Returns: undefined
      }
      setup_complete: { Args: { _user_id: string }; Returns: boolean }
      start_chat: { Args: never; Returns: Json }
      status_label: {
        Args: { s: Database["public"]["Enums"]["ticket_status"] }
        Returns: string
      }
      take_over_chat: { Args: { _conv: string }; Returns: undefined }
      unique_username: { Args: { _base: string }; Returns: string }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "agent" | "customer"
      chat_mode: "human" | "ai" | "hybrid"
      chat_sender: "customer" | "agent" | "ai" | "system"
      chat_status:
        | "active"
        | "waiting_for_agent"
        | "waiting_for_customer"
        | "closed"
      message_type:
        | "customer_reply"
        | "agent_reply"
        | "internal_note"
        | "system_event"
      presence_status: "online" | "away" | "offline"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      ticket_status:
        | "unanswered"
        | "answered"
        | "awaiting_user_reply"
        | "in_progress"
        | "solved"
        | "closed"
        | "reopened"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "admin", "agent", "customer"],
      chat_mode: ["human", "ai", "hybrid"],
      chat_sender: ["customer", "agent", "ai", "system"],
      chat_status: [
        "active",
        "waiting_for_agent",
        "waiting_for_customer",
        "closed",
      ],
      message_type: [
        "customer_reply",
        "agent_reply",
        "internal_note",
        "system_event",
      ],
      presence_status: ["online", "away", "offline"],
      ticket_priority: ["low", "medium", "high", "urgent"],
      ticket_status: [
        "unanswered",
        "answered",
        "awaiting_user_reply",
        "in_progress",
        "solved",
        "closed",
        "reopened",
      ],
    },
  },
} as const
