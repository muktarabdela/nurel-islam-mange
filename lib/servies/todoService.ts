import { supabase } from '@/lib/supabase';
import { TodoModel } from '@/models/Todo';

const TABLE_NAME = 'todos';

export const todoService = {
  async create(payload: Omit<TodoModel, 'id' | 'created_at' | 'updated_at'>): Promise<TodoModel> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({
        ...payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getAll(): Promise<TodoModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getById(id: string): Promise<TodoModel | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(error.message);

    return data;
  },

  async update(id: string, updates: Partial<Omit<TodoModel, 'id' | 'created_at'>>): Promise<TodoModel> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async toggleComplete(id: string): Promise<TodoModel> {
    // First get the current todo to check its completion status
    const currentTodo = await this.getById(id);
    if (!currentTodo) throw new Error('Todo not found');

    return this.update(id, { completed: !currentTodo.completed });
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async search(query: string): Promise<TodoModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getCompleted(): Promise<TodoModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('completed', true)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getPending(): Promise<TodoModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('completed', false)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }
};
