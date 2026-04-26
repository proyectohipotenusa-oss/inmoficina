import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function genPassword(len = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#";
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < len; i++) out += chars[bytes[i] % chars.length];
  return out;
}

function normalizeSlug(raw: string) {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return json({ error: "Falta token de autenticación" }, 401);
    }
    const token = authHeader.slice("Bearer ".length);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return json({ error: `No autenticado: ${userErr?.message || "token inválido"}` }, 401);
    }

    const { data: perfil, error: perfilErr } = await admin
      .from("perfiles")
      .select("rol")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (perfilErr) return json({ error: perfilErr.message }, 500);
    if (!perfil || perfil.rol !== "admin") {
      return json({ error: "Permiso denegado" }, 403);
    }

    if (req.method === "GET") {
      const { data, error } = await admin
        .from("agencias")
        .select("id, nombre, licencia, created_at")
        .order("created_at", { ascending: false });
      if (error) return json({ error: error.message }, 500);
      return json({ agencias: data });
    }

    if (req.method !== "POST") {
      return json({ error: "Método no permitido" }, 405);
    }

    const body = await req.json().catch(() => ({}));
    const nombre = String(body?.nombre || "").trim();
    const slugRaw = String(body?.id || body?.slug || "").trim();
    const licencia = String(body?.licencia || "").trim();

    if (!nombre) return json({ error: "El nombre es obligatorio" }, 400);
    if (!slugRaw) return json({ error: "El slug/id es obligatorio" }, 400);

    const slug = normalizeSlug(slugRaw);
    if (!slug) return json({ error: "Slug inválido" }, 400);

    const { data: existing } = await admin
      .from("agencias")
      .select("id")
      .eq("id", slug)
      .maybeSingle();
    if (existing) {
      return json({ error: `Ya existe una agencia con id "${slug}"` }, 409);
    }

    const { error: insErr } = await admin
      .from("agencias")
      .insert({ id: slug, nombre, licencia });
    if (insErr) return json({ error: insErr.message }, 500);

    const users: Array<{ email: string; password: string; user_id: string }> = [];

    for (let i = 1; i <= 3; i++) {
      const email = `${slug}-${i}@inmoficina.es`;
      const password = genPassword(12);

      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          nombre: `${nombre} · Agente ${i}`,
          rol: "agente",
        },
      });

      if (createErr || !created?.user) {
        await admin.from("agencias").delete().eq("id", slug);
        return json(
          { error: `Error creando usuario ${email}: ${createErr?.message || "desconocido"}` },
          500,
        );
      }

      const uid = created.user.id;

      const { error: upErr } = await admin
        .from("perfiles")
        .upsert(
          {
            id: uid,
            email,
            agencia_id: slug,
            rol: "agente",
            nombre: `${nombre} · Agente ${i}`,
          },
          { onConflict: "id" },
        );

      if (upErr) {
        return json({ error: `Error creando perfil para ${email}: ${upErr.message}` }, 500);
      }

      users.push({ email, password, user_id: uid });
    }

    return json({
      ok: true,
      agencia: { id: slug, nombre, licencia },
      usuarios: users,
    });
  } catch (e) {
    return json({ error: (e as Error).message || "Error interno" }, 500);
  }
});
