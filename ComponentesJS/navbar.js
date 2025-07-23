import { cargarCategorias } from './categorias.js';
import { cargarCategoriasTransaccion, cargarCategoriasFiltro, cargarTransacciones, eliminarTransaccion, editarTransaccion } from './transacciones.js';
import { abrirDB, generarId } from './indexedDB.js';
import { renderPresupuesto } from './presupuesto.js';
import { renderDashboard } from './dashboard.js';
 
export async function mostrarVista(vista) {
  const main = document.getElementById('vista-principal');
  main.classList.remove('transacciones-vista');
  if (vista === 'categorias') {
    main.innerHTML = '<h2>Categorías</h2><div id="lista-categorias"></div>';
    await cargarCategorias();
  } else if (vista === 'transacciones') {
    await import('./transacciones.js').then(mod => mod.renderTransacciones());
  } else if (vista === 'presupuesto') {
    await renderPresupuesto();
  } else {
    await renderDashboard();
  }
}