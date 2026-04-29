export type Rol = 'admin' | 'agente';

export type EstadoLead = 'nuevo' | 'contactado' | 'visita' | 'cerrado';

export interface Perfil {
  id: string;
  email: string;
  agencia_id: string | null;
  rol: Rol;
  nombre: string;
  avatar_url: string | null;
  slug_publico: string | null;
  telefono: string | null;
  minibio?: string | null;
  created_at: string;
}

export interface Agencia {
  id: string;
  nombre: string;
  licencia: string;
  created_at: string;
}

export interface Lead {
  id: string;
  agencia_id: string;
  nombre: string;
  telefono: string;
  email: string;
  estado: EstadoLead;
  notas: string;
  origen: string;
  presupuesto: number;
  asignado_a: string | null;
  created_at: string;
}

export interface Propiedad {
  id: string;
  agencia_id: string;
  titulo: string;
  direccion: string;
  ciudad: string;
  codigo_postal: string;
  precio: number;
  m2: number;
  habitaciones: number;
  banos: number;
  tipo: string;
  descripcion: string;
  fotos: string[];
  estado: string;
  created_at: string;
}

export interface Venta {
  id: string;
  agencia_id: string;
  propiedad_id: string | null;
  lead_id: string | null;
  importe: number;
  fecha_cierre: string;
  agente_id: string | null;
  created_at: string;
}
