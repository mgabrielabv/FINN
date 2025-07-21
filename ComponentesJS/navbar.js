import { cargarCategorias } from './categorias.js';
import { renderTransacciones } from './transacciones.js';
import { renderPresupuesto } from './presupuesto.js';
 
export async function mostrarVista(vista) {
  const main = document.getElementById('vista-principal');
  main.classList.remove('transacciones-vista');
  if (vista === 'categorias') {
    main.innerHTML = '<h2>Categorías</h2><div id="lista-categorias"></div>';
    await cargarCategorias();
  } else if (vista === 'transacciones') {
    // Si el HTML de transacciones está en index.html, solo limpia y muestra
    main.style.display = '';
    await renderTransacciones();
  } else if (vista === 'presupuesto') {
    await renderPresupuesto();
  } else {
    main.innerHTML = `<h2>Dashboard</h2>
      <p>Bienvenido a tu gestor de finanzas personales.</p>
      <p>Usa el menú para navegar entre categorías y transacciones.</p>`;
  }
}
