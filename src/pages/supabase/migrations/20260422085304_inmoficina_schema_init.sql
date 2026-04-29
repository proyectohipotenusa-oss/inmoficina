CREATE TABLE IF NOT EXISTS agencias (
  id text PRIMARY KEY,
  nombre text NOT NULL DEFAULT '',
  licencia text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE agencias ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS perfiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL DEFAULT '',
  agencia_id text REFERENCES agencias(id) ON DELETE SET NULL,
  rol text NOT NULL DEFAULT 'agente',
  nombre text NOT NULL DEFAULT '',
  avatar_url text DEFAULT '',
  slug_publico text UNIQUE,
  telefono text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agencia_id text NOT NULL REFERENCES agencias(id) ON DELETE CASCADE,
  nombre text NOT NULL DEFAULT '',
  telefono text DEFAULT '',
  email text DEFAULT '',
  estado text NOT NULL DEFAULT 'nuevo',
  notas text DEFAULT '',
  origen text DEFAULT '',
  presupuesto numeric DEFAULT 0,
  asignado_a uuid REFERENCES perfiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS propiedades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agencia_id text NOT NULL REFERENCES agencias(id) ON DELETE CASCADE,
  titulo text NOT NULL DEFAULT '',
  direccion text DEFAULT '',
  ciudad text DEFAULT '',
  codigo_postal text DEFAULT '',
  precio numeric DEFAULT 0,
  m2 numeric DEFAULT 0,
  habitaciones integer DEFAULT 0,
  banos integer DEFAULT 0,
  tipo text DEFAULT 'piso',
  descripcion text DEFAULT '',
  fotos text[] DEFAULT '{}',
  estado text NOT NULL DEFAULT 'disponible',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE propiedades ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS ventas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agencia_id text NOT NULL REFERENCES agencias(id) ON DELETE CASCADE,
  propiedad_id uuid REFERENCES propiedades(id) ON DELETE SET NULL,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  importe numeric NOT NULL DEFAULT 0,
  fecha_cierre timestamptz DEFAULT now(),
  agente_id uuid REFERENCES perfiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS valoraciones_ia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agencia_id text NOT NULL REFERENCES agencias(id) ON DELETE CASCADE,
  cp text NOT NULL DEFAULT '',
  m2 numeric DEFAULT 0,
  tipo text DEFAULT 'piso',
  precio_estimado numeric DEFAULT 0,
  precio_min numeric DEFAULT 0,
  precio_max numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE valoraciones_ia ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION current_agencia_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT agencia_id FROM perfiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION current_rol()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT rol FROM perfiles WHERE id = auth.uid();
$$;

CREATE POLICY "perfiles_select_self"
  ON perfiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "perfiles_select_agencia"
  ON perfiles FOR SELECT TO authenticated
  USING (agencia_id IS NOT NULL AND agencia_id = current_agencia_id());

CREATE POLICY "perfiles_select_admin"
  ON perfiles FOR SELECT TO authenticated
  USING (current_rol() = 'admin');

CREATE POLICY "perfiles_update_self"
  ON perfiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "agencias_select_own"
  ON agencias FOR SELECT TO authenticated
  USING (id = current_agencia_id() OR current_rol() = 'admin');

CREATE POLICY "agencias_insert_admin"
  ON agencias FOR INSERT TO authenticated
  WITH CHECK (current_rol() = 'admin');

CREATE POLICY "agencias_update_admin"
  ON agencias FOR UPDATE TO authenticated
  USING (current_rol() = 'admin')
  WITH CHECK (current_rol() = 'admin');

CREATE POLICY "agencias_delete_admin"
  ON agencias FOR DELETE TO authenticated
  USING (current_rol() = 'admin');

CREATE POLICY "leads_select" ON leads FOR SELECT TO authenticated
  USING (agencia_id = current_agencia_id());
CREATE POLICY "leads_insert" ON leads FOR INSERT TO authenticated
  WITH CHECK (agencia_id = current_agencia_id());
CREATE POLICY "leads_update" ON leads FOR UPDATE TO authenticated
  USING (agencia_id = current_agencia_id())
  WITH CHECK (agencia_id = current_agencia_id());
CREATE POLICY "leads_delete" ON leads FOR DELETE TO authenticated
  USING (agencia_id = current_agencia_id());

CREATE POLICY "propiedades_select" ON propiedades FOR SELECT TO authenticated
  USING (agencia_id = current_agencia_id());
CREATE POLICY "propiedades_insert" ON propiedades FOR INSERT TO authenticated
  WITH CHECK (agencia_id = current_agencia_id());
CREATE POLICY "propiedades_update" ON propiedades FOR UPDATE TO authenticated
  USING (agencia_id = current_agencia_id())
  WITH CHECK (agencia_id = current_agencia_id());
CREATE POLICY "propiedades_delete" ON propiedades FOR DELETE TO authenticated
  USING (agencia_id = current_agencia_id());

CREATE POLICY "ventas_select" ON ventas FOR SELECT TO authenticated
  USING (agencia_id = current_agencia_id());
CREATE POLICY "ventas_insert" ON ventas FOR INSERT TO authenticated
  WITH CHECK (agencia_id = current_agencia_id());
CREATE POLICY "ventas_update" ON ventas FOR UPDATE TO authenticated
  USING (agencia_id = current_agencia_id())
  WITH CHECK (agencia_id = current_agencia_id());
CREATE POLICY "ventas_delete" ON ventas FOR DELETE TO authenticated
  USING (agencia_id = current_agencia_id());

CREATE POLICY "valoraciones_select" ON valoraciones_ia FOR SELECT TO authenticated
  USING (agencia_id = current_agencia_id());
CREATE POLICY "valoraciones_insert" ON valoraciones_ia FOR INSERT TO authenticated
  WITH CHECK (agencia_id = current_agencia_id());

CREATE INDEX IF NOT EXISTS idx_perfiles_agencia ON perfiles(agencia_id);
CREATE INDEX IF NOT EXISTS idx_leads_agencia ON leads(agencia_id);
CREATE INDEX IF NOT EXISTS idx_leads_estado ON leads(estado);
CREATE INDEX IF NOT EXISTS idx_propiedades_agencia ON propiedades(agencia_id);
CREATE INDEX IF NOT EXISTS idx_ventas_agencia ON ventas(agencia_id);
CREATE INDEX IF NOT EXISTS idx_valoraciones_agencia ON valoraciones_ia(agencia_id);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO perfiles (id, email, nombre, rol)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(COALESCE(NEW.email, ''), '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'rol', 'agente')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();