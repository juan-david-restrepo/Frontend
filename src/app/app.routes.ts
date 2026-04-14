import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { agenteGuard } from './guards/agente-guard';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Recuperar } from './components/recuperar/recuperar';
import { VerificarCorreo } from './components/verificar-correo/verificar-correo';
import { Registro } from './components/registro/registro';
import { SubirReporteComponent } from './components/subir-reporte/subir-reporte';
import { Parking } from './components/parking/parking';
import { Agente } from './components/agente/agente';
import { Footer } from './shared/footer/footer';
import { Soporte } from './components/soporte/soporte';
import { PicoPlaca } from './components/pico-placa/pico-placa';
import { Normas } from './components/normas/normas';
import { NoticiasComponent } from './components/noticias/noticias';
import { Perfil } from './components/perfil/perfil';
import { Tareas } from './components/agente/tareas/tareas';
import { Historial } from './components/agente/historial/historial';
import { Reportes } from './components/agente/reportes/reportes';
import { Dashboard } from './components/agente/dashboard/dashboard';
import { PerfilAgente } from './components/agente/perfil-agente/perfil-agente';
import { ConfigAdminComponent } from './components/admin/config-admin/config-admin';
import { GestionAgentes } from './components/admin/gestion-agentes/gestion-agentes';
import { MapaReportesComponent } from './components/admin/mapa-reportes/mapa-reportes';
import { GestionSoporte } from './components/admin/gestion-soporte/gestion-soporte';
import { SidebarAdmin } from './components/admin/sidebar-admin/sidebar-admin';
import { Admin } from './components/admin/admin';
import { PuntosAtencion } from './components/puntos-atencion/puntos-atencion';
import { SobreNosotros } from './components/sobre-nosotros/sobre-nosotros';
import { ServiciosFooter } from './components/servicios-footer/servicios-footer';
import { PreguntasFrecuentes } from './components/preguntas-frecuentes/preguntas-frecuentes';
import { MisReportes } from './components/mis-reportes/mis-reportes';
import { ReportesPublicos } from './reportes-publicos/reportes-publicos';
import { Mensajes } from './components/mensajes/mensajes';
import { VoiceChatBotComponent } from './shared/voice-chat-bot/voice-chat-bot';
import { ConsultaMultas } from './components/consulta-multas/consulta-multas';
import { TerminosServicio } from './components/terminos-servicio/terminos-servicio';
import { PoliticaPrivacidad } from './components/politica-privacidad/politica-privacidad';
import { AvisoPrivacidad } from './components/aviso-privacidad/aviso-privacidad';
import { SenalesComponent } from './components/senales/senales';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'recuperar', component: Recuperar },
  { path: 'verificar-correo', component: VerificarCorreo  },
  { path: 'registro', component: Registro },
  { path: 'subir-reporte', component: SubirReporteComponent, canActivate: [authGuard] },
  { path: 'parking', component: Parking, canActivate: [authGuard] },
  { path: 'footer', component: Footer },
  { path: 'soporte', component: Soporte },
  { path: 'pico-placa', component: PicoPlaca },
  {path: 'noticias', component: NoticiasComponent},
  {path: 'normas', component: Normas },
  {path: 'perfil', component: Perfil, canActivate: [authGuard]  },
  {path: 'agente', component: Agente, canActivate: [agenteGuard] },
  {path: 'tareas', component: Tareas, canActivate: [agenteGuard] },
  {path: 'historial', component: Historial, canActivate: [agenteGuard] },
  {path: 'reportes', component: Reportes, canActivate: [agenteGuard] },
  {path: 'dashboard', component: Dashboard, canActivate: [agenteGuard] },
  {path: 'perfil-agente', component: PerfilAgente, canActivate: [agenteGuard] },
  {path: 'gestion-agentes', component: GestionAgentes, canActivate: [adminGuard] }, 
  {path: 'gestion-soporte', component: GestionSoporte, canActivate: [adminGuard] },
  {path: 'sidebar-admin', component: SidebarAdmin },
  {path: 'config-admin', component: ConfigAdminComponent, canActivate : [adminGuard] },
  {path: 'mapa-reportes', component: MapaReportesComponent},
  { path: 'admin', component: Admin, canActivate: [adminGuard] },
  {path: 'senales', component: SenalesComponent },
  { path: 'sobre-nosotros', component: SobreNosotros },
  { path: 'servicios-footer', component: ServiciosFooter },
  { path: 'preguntas-frecuentes', component: PreguntasFrecuentes },
    { path: 'mis-reportes', component: MisReportes, canActivate: [authGuard] },
  {path: 'reportes-publicos', component: ReportesPublicos},
  { path: 'mensajes', component: Mensajes, canActivate: [authGuard] },
  {path: 'voice-chat-bot', component: VoiceChatBotComponent },
  {path: 'puntos-atencion', component: PuntosAtencion },
  {path: 'consulta-multas', component: ConsultaMultas,  canActivate: [authGuard] },
  {path: 'terminos-servicio', component: TerminosServicio },
  {path: 'politica-privacidad', component: PoliticaPrivacidad },
  {path: 'aviso-privacidad', component: AvisoPrivacidad },
  {path: 'puntos-atencion', component: PuntosAtencion }
];
