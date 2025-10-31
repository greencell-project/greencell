// /js/auth.js — shared auth helpers for every protected page
(function () {
  const SUPA_URL = "https://zjxxmppahgpxoltdsfaq.supabase.co";
  const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqeHhtcHBhaGdweG9sdGRzZmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMDA4NjIsImV4cCI6MjA3NTY3Njg2Mn0.VjYwkdE8g809JugkFy9KbrOAvMGwtKUCK4fDh8V7WVo";
  const client = window.supabase = window.supabase?.createClient
    ? window.supabase.createClient(SUPA_URL, SUPA_KEY)
    : (window.supabase || {});

  async function requireSession() {
    try {
      const { data: { session } } = await client.auth.getSession();
      if (!session) {
        const back = encodeURIComponent(location.pathname.replace(/^\//, ''));
        location.replace('login.html?returnTo=' + back);
        return false;
      }
      hydrateProfile(session);
      return true;
    } catch (e) {
      console.warn('[auth] requireSession error', e);
      location.replace('login.html');
      return false;
    }
  }

  async function hydrateProfile(session) {
    try {
      // Load profile if available
      const uid = session.user.id;
      let fullName = session.user.user_metadata?.full_name || session.user.email;
      let role = 'student';
      let avatar = session.user.user_metadata?.avatar_url || '';

      const { data, error } = await client.from('profiles').select('*').eq('id', uid).maybeSingle();
      if (!error && data) {
        fullName = data.full_name || fullName;
        role = data.role || role;
        avatar = data.avatar_url || avatar;
      }

      const nameEl = document.querySelector('[data-user-name]');
      const roleEl = document.querySelector('[data-user-role]');
      const avatarEl = document.querySelector('[data-user-avatar]');
      if (nameEl) nameEl.textContent = fullName;
      if (roleEl) roleEl.textContent = role;
      if (avatarEl) {
        avatarEl.src = avatar || 'resources/student-1.jpg';
        avatarEl.alt = fullName;
      }
    } catch (e) {
      console.debug('[auth] hydrateProfile skipped:', e);
    }
  }

  async function signOut() {
    await client.auth.signOut();
    location.replace('login.html');
  }

  window.Auth = { client, requireSession, signOut };
})();
