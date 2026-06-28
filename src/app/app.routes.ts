import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { agenteGuard } from './guards/agente-guard';
export const routes: Routes = [
  // ── Públicas ──────────────────────────────────────────────
  { path: '', loadComponent: () => import('./components/home/home').then(m => m.Home) },
  { path: 'home', loadComponent: () => import('./components/home/home').then(m => m.Home) },
  { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login) },
  { path: 'recuperar', loadComponent: () => import('./components/recuperar/recuperar').then(m => m.Recuperar) },
  { path: 'verificar-correo', loadComponent: () => import('./components/verificar-correo/verificar-correo').then(m => m.VerificarCorreo) },
  { path: 'registro', loadComponent: () => import('./components/registro/registro').then(m => m.Registro) },
  { path: 'footer', loadComponent: () => import('./shared/footer/footer').then(m => m.Footer) },
  { path: 'pico-placa', loadComponent: () => import('./components/pico-placa/pico-placa').then(m => m.PicoPlaca) },
  { path: 'noticias', loadComponent: () => import('./components/noticias/noticias').then(m => m.NoticiasComponent) },
  { path: 'normas', loadComponent: () => import('./components/normas/normas').then(m => m.Normas) },
  { path: 'sobre-nosotros', loadComponent: () => import('./components/sobre-nosotros/sobre-nosotros').then(m => m.SobreNosotros) },
  { path: 'servicios-footer', loadComponent: () => import('./components/servicios-footer/servicios-footer').then(m => m.ServiciosFooter) },
  { path: 'preguntas-frecuentes', loadComponent: () => import('./components/preguntas-frecuentes/preguntas-frecuentes').then(m => m.PreguntasFrecuentes) },
  { path: 'password', loadComponent: () => import('./password/password').then(m => m.Password) },
  { path: 'terminos-servicio', loadComponent: () => import('./components/terminos-servicio/terminos-servicio').then(m => m.TerminosServicio) },
  { path: 'politica-privacidad', loadComponent: () => import('./components/politica-privacidad/politica-privacidad').then(m => m.PoliticaPrivacidad) },
  { path: 'aviso-privacidad', loadComponent: () => import('./components/aviso-privacidad/aviso-privacidad').then(m => m.AvisoPrivacidad) },
  { path: 'puntos-atencion', loadComponent: () => import('./components/puntos-atencion/puntos-atencion').then(m => m.PuntosAtencion) },

  // ── Requieren login (lazy) ────────────────────────────────
  {
    path: 'subir-reporte',
    loadComponent: () => import('./components/subir-reporte/subir-reporte').then(m => m.SubirReporteComponent),
    canActivate: [authGuard]
  },


  {
    path: 'pico-placa',
    loadComponent: () => import('./components/pico-placa/pico-placa').then(m => m.PicoPlaca),
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
