import { cargarCategorias } from './categorias.js';
import { cargarCategoriasTransaccion, cargarTransacciones } from './transacciones.js';
import { abrirDB, generarId } from './indexedDB.js';
 
export async function mostrarVista(vista) {
  const main = document.getElementById('vista-principal');
  if (vista === 'categorias') {
    main.innerHTML = '<h2>Categorías</h2><div id="lista-categorias"></div>' +
      `<form id="form-categoria">
        <input type="text" id="nombre-categoria" placeholder="Nombre categoría" required>
        <button type="submit">Agregar</button>
      </form>`;
    cargarCategorias();
    document.getElementById('form-categoria').onsubmit = async function(e) {
      e.preventDefault();
      const nombre = document.getElementById('nombre-categoria').value.trim();
      if (!nombre) return;
      const db = await abrirDB();
      const tx = db.transaction("categorias", "readwrite");
      tx.objectStore("categorias").add({ id: generarId(), nombre });
      tx.oncomplete = cargarCategorias;
      this.reset();
    };
  } else if (vista === 'transacciones') {
    main.innerHTML = '<h2>Transacciones</h2><div id="lista-transacciones"></div>' +
      `<form id="form-transaccion">
        <select id="tipo-transaccion">
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>
        </select>
        <input type="number" id="monto-transaccion" placeholder="Monto" min="1" required>
        <input type="date" id="fecha-transaccion" required>
        <select id="categoria-transaccion"></select>
        <input type="text" id="desc-transaccion" placeholder="Descripción (opcional)">
        <button type="submit">Registrar</button>
      </form>`;
    await cargarCategoriasTransaccion();
    cargarTransacciones();
    document.getElementById('form-transaccion').onsubmit = async function(e) {
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
      tx.oncomplete = cargarTransacciones;
      this.reset();
    };
  } else {
    main.innerHTML = `<h2>Dashboard</h2>
      <p>Bienvenido a tu gestor de finanzas personales.</p>
      <p>Usa el menú para navegar entre categorías y transacciones.</p>`;
  }
}
