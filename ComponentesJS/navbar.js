import { cargarCategorias } from './categorias.js';
import { cargarCategoriasTransaccion, cargarCategoriasFiltro, cargarTransacciones, eliminarTransaccion, editarTransaccion } from './transacciones.js';
import { abrirDB, generarId } from './indexedDB.js';
 
export async function mostrarVista(vista) {
  const main = document.getElementById('vista-principal');
  if (vista === 'categorias') {
    main.innerHTML = '<h2>Categorías</h2><div id="lista-categorias"></div>' +
      `<form id="form-categoria">
        <input type="text" id="nombre-categoria" placeholder="Nombre categoría" required>
        <button type="submit">Agregar</button>
      </form>`;
    await cargarCategorias();
    const formCat = document.getElementById('form-categoria');
    formCat.onsubmit = async function(e) {
      e.preventDefault();
      const nombre = document.getElementById('nombre-categoria').value.trim();
      if (!nombre) return;
      const db = await abrirDB();
      const tx = db.transaction("categorias", "readwrite");
      tx.objectStore("categorias").add({ id: generarId(), nombre });
      tx.oncomplete = async () => {
        await cargarCategorias();
        formCat.reset();
      };
      tx.onerror = () => alert("Error al guardar la categoría. Intenta de nuevo.");
    };
  } else if (vista === 'transacciones') {
    main.innerHTML = `
      <h2>Transacciones</h2>
      <div>
        <input type="text" id="buscar-transaccion" placeholder="Buscar descripción o categoría">
        <select id="filtrar-tipo">
          <option value="">Todos</option>
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>
        </select>
        <select id="filtrar-categoria"></select>
        <button id="btn-filtrar">Filtrar</button>
      </div>
      <div id="lista-transacciones"></div>
      <form id="form-transaccion">
        <select id="tipo-transaccion">
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>
        </select>
        <input type="number" id="monto-transaccion" placeholder="Monto" min="1" required>
        <input type="date" id="fecha-transaccion" required>
        <select id="categoria-transaccion"></select>
        <input type="text" id="desc-transaccion" placeholder="Descripción (opcional)">
        <button type="submit">Registrar</button>
      </form>
    `;
    await cargarCategoriasTransaccion();
    await cargarCategoriasFiltro();
    cargarTransacciones();
    const formTx = document.getElementById('form-transaccion');
    formTx.onsubmit = async function(e) {
      e.preventDefault();
      const tipo = document.getElementById('tipo-transaccion').value;
      const monto = Number(document.getElementById('monto-transaccion').value);
      const fecha = document.getElementById('fecha-transaccion').value;
      const categoriaId = document.getElementById('categoria-transaccion').value;
      const descripcion = document.getElementById('desc-transaccion').value;
      if (!categoriaId) return alert("Selecciona una categoría");
      const db = await abrirDB();
      const tx = db.transaction("transacciones", "readwrite");
      tx.objectStore("transacciones").add({
        id: generarId(), tipo, monto, fecha, categoriaId, descripcion
      });
      tx.oncomplete = async () => {
        await cargarTransacciones();
        formTx.reset();
      };
      tx.onerror = () => alert("Error al guardar la transacción. Intenta de nuevo.");
    };
    document.getElementById('btn-filtrar').onclick = () => cargarTransacciones();
    document.getElementById('buscar-transaccion').oninput = () => cargarTransacciones();
    document.getElementById('filtrar-tipo').onchange = () => cargarTransacciones();
    document.getElementById('filtrar-categoria').onchange = () => cargarTransacciones();
  } else {
    main.innerHTML = `<h2>Dashboard</h2>
      <p>Bienvenido a tu gestor de finanzas personales.</p>
      <p>Usa el menú para navegar entre categorías y transacciones.</p>`;
  }
}
