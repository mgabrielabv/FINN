
// filepath: /Users/luismi/Documents/Uru/6to_trimestre/LCW/FINN/ComponentesJS/app.js
import { mostrarVista } from './navbar.js';
import { cargarCategorias } from './categorias.js';
import { cargarCategoriasTransaccion, cargarTransacciones } from './transacciones.js';
import { abrirDB, generarId } from './indexedDB.js';

document.addEventListener('DOMContentLoaded', () => {
  mostrarVista('dashboard');
  const btnCategorias = document.getElementById('nav-categorias');
  const btnTransacciones = document.getElementById('nav-transacciones');
  const btnDashboard = document.getElementById('nav-dashboard');
  if (btnCategorias) btnCategorias.onclick = () => mostrarVista('categorias');
  if (btnTransacciones) btnTransacciones.onclick = () => mostrarVista('transacciones');
  if (btnDashboard) btnDashboard.onclick = () => mostrarVista('dashboard');
});

