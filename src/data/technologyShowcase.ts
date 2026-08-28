export type TechnologyCategory = 'Front-end' | 'Backend' | 'Mobile' | 'Cloud & DevOps' | 'Data & AI' | 'Design' | 'Video & Motion';

export interface TechnologyShowcaseItem {
  name: string;
  category: TechnologyCategory;
  glyph: string;
  color: string;
}

export const technologyTabs = ['All', 'Front-end', 'Backend', 'Mobile', 'Cloud & DevOps', 'Data & AI', 'Design', 'Video & Motion'] as const;

export const technologyShowcase: TechnologyShowcaseItem[] = [
  { name: 'React', category: 'Front-end', glyph: 'R', color: '#61DAFB' },
  { name: 'Vue.js', category: 'Front-end', glyph: 'V', color: '#41B883' },
  { name: 'Angular', category: 'Front-end', glyph: 'A', color: '#DD0031' },
  { name: 'Next.js', category: 'Front-end', glyph: 'N', color: '#FFFFFF' },
  { name: 'Astro', category: 'Front-end', glyph: 'A*', color: '#FF5D01' },
  { name: 'TypeScript', category: 'Front-end', glyph: 'TS', color: '#3178C6' },
  { name: 'Tailwind CSS', category: 'Front-end', glyph: 'TW', color: '#38BDF8' },
  { name: 'HTML5', category: 'Front-end', glyph: '5', color: '#E34F26' },
  { name: 'CSS3', category: 'Front-end', glyph: '3', color: '#1572B6' },
  { name: 'SASS', category: 'Front-end', glyph: 'S', color: '#CC6699' },
  { name: 'JavaScript', category: 'Front-end', glyph: 'JS', color: '#F7DF1E' },
  { name: 'Node.js', category: 'Backend', glyph: 'Nd', color: '#5FA04E' },
  { name: 'Python', category: 'Backend', glyph: 'Py', color: '#3776AB' },
  { name: 'PHP', category: 'Backend', glyph: 'PHP', color: '#777BB4' },
  { name: 'Laravel', category: 'Backend', glyph: 'Lv', color: '#FF2D20' },
  { name: 'Django', category: 'Backend', glyph: 'Dj', color: '#44B78B' },
  { name: 'Express.js', category: 'Backend', glyph: 'Ex', color: '#F2F2F2' },
  { name: 'Java', category: 'Backend', glyph: 'Jv', color: '#F89820' },
  { name: 'Spring Boot', category: 'Backend', glyph: 'SB', color: '#6DB33F' },
  { name: 'Go', category: 'Backend', glyph: 'Go', color: '#00ADD8' },
  { name: 'Rust', category: 'Backend', glyph: 'Rs', color: '#CE422B' },
  { name: 'React Native', category: 'Mobile', glyph: 'RN', color: '#61DAFB' },
  { name: 'Flutter', category: 'Mobile', glyph: 'Fl', color: '#02569B' },
  { name: 'Swift', category: 'Mobile', glyph: 'Sw', color: '#F05138' },
  { name: 'Kotlin', category: 'Mobile', glyph: 'Kt', color: '#A97BFF' },
  { name: 'AWS', category: 'Cloud & DevOps', glyph: 'AWS', color: '#FF9900' },
  { name: 'Azure', category: 'Cloud & DevOps', glyph: 'Az', color: '#0078D4' },
  { name: 'Docker', category: 'Cloud & DevOps', glyph: 'Dc', color: '#2496ED' },
  { name: 'Kubernetes', category: 'Cloud & DevOps', glyph: 'K8s', color: '#326CE5' },
  { name: 'PostgreSQL', category: 'Data & AI', glyph: 'Pg', color: '#4169E1' },
  { name: 'Supabase', category: 'Data & AI', glyph: 'Su', color: '#3ECF8E' },
  { name: 'OpenAI', category: 'Data & AI', glyph: 'AI', color: '#10A37F' },
  { name: 'TensorFlow', category: 'Data & AI', glyph: 'Tf', color: '#FF6F00' },
  { name: 'Figma', category: 'Design', glyph: 'Fg', color: '#A259FF' },
  { name: 'Adobe XD', category: 'Design', glyph: 'Xd', color: '#FF61F6' },
  { name: 'Photoshop', category: 'Design', glyph: 'Ps', color: '#31A8FF' },
  { name: 'Illustrator', category: 'Design', glyph: 'Ai', color: '#FF9A00' },
  { name: 'After Effects', category: 'Video & Motion', glyph: 'Ae', color: '#9999FF' },
  { name: 'Premiere Pro', category: 'Video & Motion', glyph: 'Pr', color: '#9999FF' },
  { name: 'GSAP', category: 'Video & Motion', glyph: 'Gs', color: '#88CE02' },
  { name: 'Framer Motion', category: 'Video & Motion', glyph: 'Fm', color: '#FF4ECD' }
];
