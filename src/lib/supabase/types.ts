/**
 * Database TypeScript types for AVProposal.ai
 * Generated from supabase/migrations/001_initial_schema.sql
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          clerk_user_id: string;
          name: string | null;
          company_name: string | null;
          role: string;
          default_language: string;
          timezone: string;
          currency: string;
          is_onboarded: boolean;
          onboarding_data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_user_id: string;
          name?: string | null;
          company_name?: string | null;
          role?: string;
          default_language?: string;
          timezone?: string;
          currency?: string;
          is_onboarded?: boolean;
          onboarding_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_user_id?: string;
          name?: string | null;
          company_name?: string | null;
          role?: string;
          default_language?: string;
          timezone?: string;
          currency?: string;
          is_onboarded?: boolean;
          onboarding_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      proposal_templates: {
        Row: {
          id: string;
          owner_profile_id: string;
          name: string;
          description: string | null;
          sections_config: Json;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_profile_id: string;
          name: string;
          description?: string | null;
          sections_config?: Json;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_profile_id?: string;
          name?: string;
          description?: string | null;
          sections_config?: Json;
          is_default?: boolean;
          created_at?: string;
        };
      };
      proposals: {
        Row: {
          id: string;
          owner_profile_id: string;
          client_name: string | null;
          client_company: string | null;
          project_type: string | null;
          budget_range: string | null;
          location: string;
          raw_brief: string | null;
          generated_content: Json | null;
          language: string;
          status: "draft" | "sent";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_profile_id: string;
          client_name?: string | null;
          client_company?: string | null;
          project_type?: string | null;
          budget_range?: string | null;
          location?: string;
          raw_brief?: string | null;
          generated_content?: Json | null;
          language?: string;
          status?: "draft" | "sent";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_profile_id?: string;
          client_name?: string | null;
          client_company?: string | null;
          project_type?: string | null;
          budget_range?: string | null;
          location?: string;
          raw_brief?: string | null;
          generated_content?: Json | null;
          language?: string;
          status?: "draft" | "sent";
          created_at?: string;
          updated_at?: string;
        };
      };
      billing_plans: {
        Row: {
          id: string;
          stripe_price_id: string | null;
          name: string;
          monthly_price_cents: number;
          max_generations_per_month: number;
          has_pdf_export: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          stripe_price_id?: string | null;
          name: string;
          monthly_price_cents?: number;
          max_generations_per_month?: number;
          has_pdf_export?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          stripe_price_id?: string | null;
          name?: string;
          monthly_price_cents?: number;
          max_generations_per_month?: number;
          has_pdf_export?: boolean;
          created_at?: string;
        };
      };
      user_subscriptions: {
        Row: {
          id: string;
          profile_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          plan_id: string;
          status: "active" | "canceled" | "past_due" | "trialing";
          current_period_start: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan_id: string;
          status?: "active" | "canceled" | "past_due" | "trialing";
          current_period_start?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan_id?: string;
          status?: "active" | "canceled" | "past_due" | "trialing";
          current_period_start?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      usage_logs: {
        Row: {
          id: string;
          profile_id: string;
          proposal_id: string | null;
          event_type: "generation" | "regeneration" | "export";
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          proposal_id?: string | null;
          event_type: "generation" | "regeneration" | "export";
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          proposal_id?: string | null;
          event_type?: "generation" | "regeneration" | "export";
          created_at?: string;
        };
      };
    };
  };
}

// Convenience type aliases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type Proposal = Database["public"]["Tables"]["proposals"]["Row"];
export type ProposalInsert = Database["public"]["Tables"]["proposals"]["Insert"];
export type ProposalTemplate = Database["public"]["Tables"]["proposal_templates"]["Row"];
export type BillingPlan = Database["public"]["Tables"]["billing_plans"]["Row"];
export type UserSubscription = Database["public"]["Tables"]["user_subscriptions"]["Row"];
export type UsageLog = Database["public"]["Tables"]["usage_logs"]["Row"];
