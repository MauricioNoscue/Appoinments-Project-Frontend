 export type Stat = {
  icon: string;
  label: 'Mis citas' | 'Familia' | 'Novedades';
  value: number;
  color?: string;
};

export type NewsItem = {
  title: string;
  date: string;
  text: string;
  status: 'pendiente' | 'confirmada';
};

 export type TipoCita = {
  id: number;
  label: string;
  color: string;
  icon?: string; // respaldo si no hay imagen
  img?: string; // ruta a /assets/... cuando venga imageName o catálogo
};

// ====================
// Catálogo nombres → imagen
// ====================
export function norm(s: string): string {
  return (s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .toLowerCase()
    .trim();
}

export const TIPO_CITA_CATALOGO: Array<{ name: string; img: string }> = [
  {
    name: 'consulta General',
    img: '/assets/icons/IconsTypeCitation/CExterna.png',
  },
  {
    name: 'odontologia',
    img: '/assets/icons/IconsTypeCitation/odontologia.png',
  },

  { name: 'pediatria', img: '/assets/icons/IconsTypeCitation/pediatria.png' },
  { name: 'consulta externa', img: '/assets/icons/IconsTypeCitation/psicologia.png' },
  { name: 'vacunacion', img: '/assets/icons/IconsTypeCitation/vacunacion.svg' },
  { name: 'psicologia', img: '/assets/icons/IconsTypeCitation/psicologia.svg' },
  {
    name: 'fisioterapia',
    img: '/assets/icons/IconsTypeCitation/fisioterapia.svg',
  },
  { name: 'optometria', img: '/assets/icons/IconsTypeCitation/optometria.svg' },
];

export const TIPO_CITA_MAP = new Map(
  TIPO_CITA_CATALOGO.map((x) => [norm(x.name), x.img])
);