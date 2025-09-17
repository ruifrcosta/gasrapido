export interface Playbook {
  id: string;
  title: string;
  description: string;
  category: 'cell_failure' | 'price_spike' | 'system_failure' | 'other';
  steps: PlaybookStep[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface PlaybookStep {
  id: string;
  playbook_id: string;
  step_number: number;
  title: string;
  description: string;
  action_required: boolean;
  responsible_role: string;
  estimated_time_minutes: number;
  dependencies: string[];
}

export interface Incident {
  id: string;
  playbook_id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  reported_by: string;
  assigned_to: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  resolution_notes?: string;
}

export class OperationalPlaybooksService {
  private supabase: any;

  constructor(supabase: any) {
    this.supabase = supabase;
  }

  /**
   * Get all active playbooks
   */
  async getActivePlaybooks(): Promise<{ playbooks: Playbook[]; error?: any }> {
    try {
      const { data, error } = await this.supabase
        .from('operational_playbooks')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { playbooks: data as Playbook[], error: null };
    } catch (error) {
      console.error('Error fetching active playbooks:', error);
      return { playbooks: [], error };
    }
  }

  /**
   * Get playbooks by category
   */
  async getPlaybooksByCategory(category: Playbook['category']): Promise<{ playbooks: Playbook[]; error?: any }> {
    try {
      const { data, error } = await this.supabase
        .from('operational_playbooks')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (error) throw error;

      return { playbooks: data as Playbook[], error: null };
    } catch (error) {
      console.error('Error fetching playbooks by category:', error);
      return { playbooks: [], error };
    }
  }

  /**
   * Get playbook by ID with steps
   */
  async getPlaybookWithSteps(playbookId: string): Promise<{ playbook: Playbook | null; error?: any }> {
    try {
      // First get the playbook
      const { data: playbookData, error: playbookError } = await this.supabase
        .from('operational_playbooks')
        .select('*')
        .eq('id', playbookId)
        .single();

      if (playbookError) throw playbookError;
      if (!playbookData) return { playbook: null, error: null };

      // Then get the steps
      const { data: stepsData, error: stepsError } = await this.supabase
        .from('playbook_steps')
        .select('*')
        .eq('playbook_id', playbookId)
        .order('step_number', { ascending: true });

      if (stepsError) throw stepsError;

      const playbook: Playbook = {
        ...playbookData,
        steps: stepsData as PlaybookStep[]
      };

      return { playbook, error: null };
    } catch (error) {
      console.error('Error fetching playbook with steps:', error);
      return { playbook: null, error };
    }
  }

  /**
   * Create a new incident
   */
  async createIncident(incident: Omit<Incident, 'id' | 'created_at' | 'updated_at'>): Promise<{ incident: Incident | null; error?: any }> {
    try {
      const { data, error } = await this.supabase
        .from('operational_incidents')
        .insert({
          ...incident,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return { incident: data as Incident, error: null };
    } catch (error) {
      console.error('Error creating incident:', error);
      return { incident: null, error };
    }
  }

  /**
   * Update incident status
   */
  async updateIncidentStatus(incidentId: string, status: Incident['status'], resolutionNotes?: string): Promise<{ success: boolean; error?: any }> {
    try {
      const updates: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'resolved' || status === 'closed') {
        updates.resolved_at = new Date().toISOString();
        if (resolutionNotes) {
          updates.resolution_notes = resolutionNotes;
        }
      }

      const { error } = await this.supabase
        .from('operational_incidents')
        .update(updates)
        .eq('id', incidentId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error updating incident status:', error);
      return { success: false, error };
    }
  }

  /**
   * Get incidents by status
   */
  async getIncidentsByStatus(status: Incident['status']): Promise<{ incidents: Incident[]; error?: any }> {
    try {
      const { data, error } = await this.supabase
        .from('operational_incidents')
        .select('*')
        .eq('status', status)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { incidents: data as Incident[], error: null };
    } catch (error) {
      console.error('Error fetching incidents by status:', error);
      return { incidents: [], error };
    }
  }

  /**
   * Get all incidents for a user
   */
  async getUserIncidents(userId: string): Promise<{ incidents: Incident[]; error?: any }> {
    try {
      const { data, error } = await this.supabase
        .from('operational_incidents')
        .select('*')
        .or(`reported_by.eq.${userId},assigned_to.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { incidents: data as Incident[], error: null };
    } catch (error) {
      console.error('Error fetching user incidents:', error);
      return { incidents: [], error };
    }
  }

  /**
   * Assign incident to user
   */
  async assignIncident(incidentId: string, userId: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await this.supabase
        .from('operational_incidents')
        .update({
          assigned_to: userId,
          updated_at: new Date().toISOString()
        })
        .eq('id', incidentId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error assigning incident:', error);
      return { success: false, error };
    }
  }

  /**
   * Get playbook recommendations based on incident description
   */
  async getPlaybookRecommendations(incidentDescription: string): Promise<{ playbooks: Playbook[]; error?: any }> {
    try {
      // This is a simplified implementation
      // In a real system, this would use ML or more sophisticated matching
      const { playbooks, error } = await this.getActivePlaybooks();
      
      if (error) throw error;

      // Simple keyword matching for demonstration
      const keywords = incidentDescription.toLowerCase().split(' ');
      const recommendedPlaybooks = playbooks.filter(playbook => {
        const titleMatch = keywords.some(keyword => 
          playbook.title.toLowerCase().includes(keyword)
        );
        const descriptionMatch = keywords.some(keyword => 
          playbook.description.toLowerCase().includes(keyword)
        );
        return titleMatch || descriptionMatch;
      });

      return { playbooks: recommendedPlaybooks, error: null };
    } catch (error) {
      console.error('Error getting playbook recommendations:', error);
      return { playbooks: [], error };
    }
  }
}