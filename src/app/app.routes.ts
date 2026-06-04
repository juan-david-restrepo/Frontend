import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { agenteGuard } from './guards/agente-guard';

// Rutas públicas ligeras — carga eager
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Recuperar } from './components/recuperar/recuperar';
import { VerificarCorreo } from './components/verificar-correo/verificar-correo';
import { Registro } from './components/registro/registro';
import { Footer } from './shared/footer/footer';
import { PicoPlaca } from './components/pico-placa/pico-placa';
import { Normas } from './components/normas/normas';
import { NoticiasComponent } from './components/noticias/noticias';
import { SobreNosotros } from './components/sobre-nosotros/sobre-nosotros';
import { ServiciosFooter } from './components/servicios-footer/servicios-footer';
import { PreguntasFrecuentes } from './components/preguntas-frecuentes/preguntas-frecuentes';
import { TerminosServicio } from './components/terminos-servicio/terminos-servicio';
import { PoliticaPrivacidad } from './components/politica-privacidad/politica-privacidad';
import { AvisoPrivacidad } from './components/aviso-privacidad/aviso-privacidad';
import { PuntosAtencion } from './components/puntos-atencion/puntos-atencion';

export const routes: Routes = [
  // ── Públicas ──────────────────────────────────────────────
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'recuperar', component: Recuperar },
  { path: 'verificar-correo', component: VerificarCorreo },
  { path: 'registro', component: Registro },
  { path: 'footer', component: Footer },
  { path: 'pico-placa', component: PicoPlaca },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'normas', component: Normas },
  { path: 'sobre-nosotros', component: SobreNosotros },
  { path: 'servicios-footer', component: ServiciosFooter },
  { path: 'preguntas-frecuentes', component: PreguntasFrecuentes },
  { path: 'terminos-servicio', component: TerminosServicio },
  { path: 'politica-privacidad', component: PoliticaPrivacidad },
  { path: 'aviso-privacidad', component: AvisoPrivacidad },
  { path: 'puntos-atencion', component: PuntosAtencion },

  // ── Requieren login (lazy) ────────────────────────────────
  {
    path: 'subir-reporte',
    loadComponent: () => import('./components/subir-reporte/subir-reporte').then(m => m.SubirReporteComponent),
    canActivate: [authGuard]
  },
  {
    path: 'parking',
    loadComponent: () => import('./components/parking/parking').then(m => m.Parking),
    canActivate: [authGuard]
  },
  {
    path: 'soporte',
    loadComponent: () => import('./components/soporte/soporte').then(m => m.Soporte),
    canActivate: [authGuard]
  },
  {
    path: 'perfil',
    loadComponent: () => import('./components/perfil/perfil').then(m => m.Perfil),
    canActivate: [authGuard]
  },
  {
    path: 'mis-reportes',
    loadComponent: () => import('./components/mis-reportes/mis-reportes').then(m => m.MisReportes),
    canActivate: [authGuard]
  },
  {
    path: 'mensajes',
    loadComponent: () => import('./components/mensajes/mensajes').then(m => m.Mensajes),
    canActivate: [authGuard]
  },
  {
    path: 'consulta-multas',
    loadComponent: () => import('./components/consulta-multas/consulta-multas').then(m => m.ConsultaMultas),
    canActivate: [authGuard]
  },
  {
    path: 'senales',
    loadComponent: () => import('./components/senales/senales').then(m => m.SenalesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reportes-publicos',
    loadComponent: () => import('./reportes-publicos/reportes-publicos').then(m => m.ReportesPublicos),
  },
  {
    path: 'voice-chat-bot',
    loadComponent: () => import('./shared/voice-chat-bot/voice-chat-bot').then(m => m.VoiceChatBotComponent),
    canActivate: [authGuard]
  },

  // ── Agente (lazy) ─────────────────────────────────────────
  {
    path: 'agente',
    loadComponent: () => import('./components/agente/agente').then(m => m.Agente),
    canActivate: [agenteGuard]
  },
  {
    path: 'tareas',
    loadComponent: () => import('./components/agente/tareas/tareas').then(m => m.Tareas),
    canActivate: [agenteGuard]
  },
  {
    path: 'historial',
    loadComponent: () => import('./components/agente/historial/historial').then(m => m.Historial),
    canActivate: [agenteGuard]
  },
  {
    path: 'reportes',
    loadComponent: () => import('./components/agente/reportes/reportes').then(m => m.Reportes),
    canActivate: [agenteGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/agente/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [agenteGuard]
  },
  {
    path: 'perfil-agente',
    loadComponent: () => import('./components/agente/perfil-agente/perfil-agente').then(m => m.PerfilAgente),
    canActivate: [agenteGuard]
  },

  // ── Admin (lazy) ──────────────────────────────────────────
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin').then(m => m.Admin),
    canActivate: [adminGuard]
  },
  {
    path: 'gestion-agentes',
    loadComponent: () => import('./components/admin/gestion-agentes/gestion-agentes').then(m => m.GestionAgentes),
    canActivate: [adminGuard]
  },
  {
    path: 'gestion-soporte',
    loadComponent: () => import('./components/admin/gestion-soporte/gestion-soporte').then(m => m.GestionSoporte),
    canActivate: [adminGuard]
  },
  {
    path: 'config-admin',
    loadComponent: () => import('./components/admin/config-admin/config-admin').then(m => m.ConfigAdminComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'mapa-reportes',
    loadComponent: () => import('./components/admin/mapa-reportes/mapa-reportes').then(m => m.MapaReportesComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'sidebar-admin',
    loadComponent: () => import('./components/admin/sidebar-admin/sidebar-admin').then(m => m.SidebarAdmin),
    canActivate: [adminGuard]
  },
];
