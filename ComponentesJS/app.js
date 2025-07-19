
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
  const nav = document.querySelector('.topbar nav');
  const main = document.getElementById('vista-principal');
  if (document.querySelector('.topbar')) document.querySelector('.topbar').style.display = '';
  if (main) main.style.display = '';
  // Animación slide-in
  if (main) {
    main.classList.remove('slide-in');
    // Forzar reflow para reiniciar animación
    void main.offsetWidth;
    main.classList.add('slide-in');
    main.addEventListener('animationend', () => {
      main.classList.remove('slide-in');
    }, { once: true });
  }
  await mostrarVistaNavbar(vista);
}

window.mostrarVista = mostrarVista;


function asignarNavDelegation() {
  const nav = document.querySelector('.topbar nav');
  if (nav && !nav._delegationSet) {
    nav.addEventListener('click', navDelegationHandler);
    nav._delegationSet = true;
  }
}

window.asignarNavDelegation = asignarNavDelegation;

const observer = new MutationObserver(() => {
  const nav = document.querySelector('.topbar nav');
  if (nav && !nav._delegationSet) {
    asignarNavDelegation();
  }
});
observer.observe(document.body, { childList: true, subtree: true });
mostrarVista('dashboard');
vistaActual = 'dashboard';

