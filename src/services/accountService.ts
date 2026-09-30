import { supabase } from './supabaseClient';

export const accountService = {
  /**
   * Borra la cuenta (auth.users) del usuario logueado vía la función
   * `delete_own_account` (security definer — la anon key no puede tocar
   * auth.users directamente). En cascada borra profile/workouts/
   * personal_records/reminders. Irreversible.
   */
  async deleteOwnAccount(): Promise<void> {
    const { error } = await supabase.rpc('delete_own_account');
    if (error) throw new Error(error.message);
  },
};
