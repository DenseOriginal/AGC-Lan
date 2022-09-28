interface Window {
  user: User;
}

interface User {
  first_name: string;
  last_name: string;
  email: string;
  is_email_verified: boolean;
  username: string;
  last_login: Date;
  created_at: Date;
  class: string;
  phone: string;
  banned: boolean;
  notes: string[];
  picture_url: string;
  discord_id: string;
  setup_finished: true;
  accent_color: string;
  role: "USER" | "STAFF" | "ADMIN" | "SUPERADMIN";
}