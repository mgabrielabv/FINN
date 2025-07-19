
// filepath: /Users/luismi/Documents/Uru/6to_trimestre/LCW/FINN/ComponentesJS/app.js
import { mostrarVista as mostrarVistaNavbar } from './navbar.js';
import { cargarCategorias } from './categorias.js';
import { cargarCategoriasTransaccion, cargarTransacciones } from './transacciones.js';
import { abrirDB, generarId } from './indexedDB.js';


let vistaActual = 'dashboard';

async function navDelegationHandler(e) {
  if (e.target && e.target.id === 'nav-categorias' && vistaActual !== 'categorias') {
    vistaActual = 'categorias';
    await mostrarVista('categorias');
  } else if (e.target && e.target.id === 'nav-transacciones' && vistaActual !== 'transacciones') {
    vistaActual = 'transacciones';
    await mostrarVista('transacciones');
  } else if (e.target && e.target.id === 'nav-dashboard' && vistaActual !== 'dashboard') {
    vistaActual = 'dashboard';
    await mostrarVista('dashboard');
  }
}




async function mostrarVista(vista) {
  const nav = document.querySelector('nav');
  const main = document.getElementById('vista-principal');
  if (nav) nav.style.display = '';
  if (main) main.style.display = '';
  await mostrarVistaNavbar(vista);
}

window.mostrarVista = mostrarVista;

function asignarNavDelegation() {
  const nav = document.querySelector('nav');
  if (nav && !nav._delegationSet) {
    nav.addEventListener('click', navDelegationHandler);
    nav._delegationSet = true;
  }
}

window.asignarNavDelegation = asignarNavDelegation;

const observer = new MutationObserver(() => {
  const nav = document.querySelector('nav');
  if (nav && !nav._delegationSet) {
    asignarNavDelegation();
  }
});
observer.observe(document.body, { childList: true, subtree: true });
mostrarVista('dashboard');
vistaActual = 'dashboard';

