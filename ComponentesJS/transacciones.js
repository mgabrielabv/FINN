import { abrirDB, generarId } from './indexedDB.js';
import { cargarCategoriasTransaccion } from './categorias.js';
export { cargarCategoriasTransaccion } from './categorias.js';

window._transFiltroTipo = window._transFiltroTipo || '';
window._transFiltroCategoria = window._transFiltroCategoria || '';
window._transFiltroBuscar = window._transFiltroBuscar || '';

export async function cargarCategoriasFiltro() {
  const db = await abrirDB();
  const tx = db.transaction("categorias", "readonly");
  const store = tx.objectStore("categorias");
  const req = store.getAll();
  req.onsuccess = function() {
    const select = document.getElementById('filtrar-categoria');
    if (!select) return;
    select.innerHTML = '<option value="">Todas</option>';
    req.result.forEach(cat => {
      select.innerHTML += `<option value="${cat.id}">${cat.nombre}</option>`;
    });
  };
}

export async function renderTransacciones() {
  const main = document.getElementById('vista-principal');
  main.classList.add('transacciones-vista');
  main.innerHTML = `
    <div class="transacciones-contenedor">
      <h2 style="margin-top:0;">Transacciones</h2>
      <form id="form-transaccion" class="transacciones-form">
        <div class="transacciones-form-row">
          <select id="tipo-transaccion">
            <option value="Ingreso">Ingreso</option>
            <option value="Egreso">Egreso</option>
          </select>
          <input type="number" id="monto-transaccion" placeholder="Monto" min="1" required>
          <input type="text" id="fecha-transaccion" placeholder="dd/mm/yyyy" maxlength="10" required autocomplete="off">
          <select id="categoria-transaccion"></select>
          <input type="text" id="desc-transaccion" placeholder="Descripción (opcional)">
          <button type="submit">Registrar</button>
        </div>
      </form>
      <div class="transacciones-filtros-row" style="margin-top:32px;">
        <input type="text" id="buscar-transaccion" class="btn-buscar" placeholder="Buscar descripción o categoría">
        <label for="filtrar-tipo" style="color:#bbb; font-size:1em;">Tipo</label>
        <select id="filtrar-tipo" class="btn-filtrar">
          <option value="">Todos</option>
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>
        </select>
        <label for="filtrar-categoria" style="color:#bbb; font-size:1em;">Categoría</label>
        <select id="filtrar-categoria" class="btn-filtrar"></select>
        <button id="btn-generar-aleatorias" class="btn-filtrar" type="button">Generar aleatoriamente</button>
      </div>
      <div class="transacciones-lista-contenedor">
        <div id="lista-transacciones" class="transacciones-lista"></div>
      </div>
    </div>
  `;
  await cargarCategoriasTransaccion();
  await cargarCategoriasFiltro();
  cargarTransacciones();

  const fechaInput = document.getElementById('fecha-transaccion');
  fechaInput.addEventListener('input', function(e) {
    let v = fechaInput.value.replace(/\D/g, '');
    if (v.length > 2) v = v.slice(0,2) + '/' + v.slice(2);
    if (v.length > 5) v = v.slice(0,5) + '/' + v.slice(5,9);
    fechaInput.value = v.slice(0,10);
  });

  const formTx = document.getElementById('form-transaccion');
  formTx.onsubmit = async function(e) {
    e.preventDefault();
    const tipo = document.getElementById('tipo-transaccion').value;
    const monto = Number(document.getElementById('monto-transaccion').value);
    const fechaRaw = document.getElementById('fecha-transaccion').value;
    const fecha = fechaRaw ? convertFechaToISO(fechaRaw) : '';
    const categoriaId = document.getElementById('categoria-transaccion').value;
    const descripcion = document.getElementById('desc-transaccion').value;
    if (!categoriaId) return alert("Selecciona una categoría");
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fechaRaw)) return alert("Fecha inválida. Usa dd/mm/yyyy");
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

  document.getElementById('filtrar-tipo').value = window._transFiltroTipo;
  document.getElementById('filtrar-categoria').value = window._transFiltroCategoria;
  document.getElementById('buscar-transaccion').value = window._transFiltroBuscar;

  document.getElementById('filtrar-tipo').onchange = function() {
    window._transFiltroTipo = this.value;
    cargarTransacciones();
  };
  document.getElementById('filtrar-categoria').onchange = function() {
    window._transFiltroCategoria = this.value;
    cargarTransacciones();
  };
  document.getElementById('buscar-transaccion').oninput = function() {
    window._transFiltroBuscar = this.value;
    cargarTransacciones();
  };

  document.getElementById('btn-generar-aleatorias').onclick = async () => {
    await generarTransaccionesAleatorias();
    await cargarTransacciones();
  };
}

async function generarTransaccionesAleatorias() {
  const db = await abrirDB();
  const txCat = db.transaction("categorias", "readonly");
  const storeCat = txCat.objectStore("categorias");
  const reqCat = storeCat.getAll();

  reqCat.onsuccess = function() {
    const categorias = reqCat.result;
    if (!categorias.length) return;

    const tipos = ["Ingreso", "Egreso"];
    const descripciones = [
      "Pago mensual", "Compra supermercado", "Transporte", "Cine", "Salario", "Regalo", "Factura", "Farmacia", "Colegio", "Otros"
    ];

    const tx = db.transaction("transacciones", "readwrite");
    const store = tx.objectStore("transacciones");

    for (let i = 0; i < 10; i++) {
      const tipo = tipos[Math.floor(Math.random() * tipos.length)];
      const monto = Math.floor(Math.random() * 5000) + 10;
      const fecha = generarFechaAleatoria();
      const categoriaId = categorias[Math.floor(Math.random() * categorias.length)].id;
      const descripcion = descripciones[Math.floor(Math.random() * descripciones.length)];
      store.add({
        id: generarId(),
        tipo,
        monto,
        fecha,
        categoriaId,
        descripcion
      });
    }
  };
}

function generarFechaAleatoria() {
  const start = new Date();
  start.setMonth(start.getMonth() - 2);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${y}-${m}-${d}`;
}

function convertFechaToISO(fechaStr) {
  if (!fechaStr) return '';
  const [d, m, y] = fechaStr.split('/');
  return `${y}-${m}-${d}`;
}

function formatFecha(fechaStr) {
  if (!fechaStr) return '';
  if (fechaStr.includes('/')) return fechaStr;
  const [y, m, d] = fechaStr.split('-');
  return `${d}/${m}/${y}`;
}

export async function cargarTransacciones() {
  const db = await abrirDB();
  const tx = db.transaction("transacciones", "readonly");
  const store = tx.objectStore("transacciones");
  const req = store.getAll();
  req.onsuccess = async function() {
    const lista = document.getElementById('lista-transacciones');
    lista.innerHTML = '';
    const filtroTipo = document.getElementById('filtrar-tipo').value;
    const filtroCategoria = document.getElementById('filtrar-categoria').value;
    const buscar = document.getElementById('buscar-transaccion').value.toLowerCase();

    const dbCat = await abrirDB();
    const txCat = dbCat.transaction("categorias", "readonly");
    const storeCat = txCat.objectStore("categorias");
    const reqCat = storeCat.getAll();
    reqCat.onsuccess = function() {
      req.result
        .filter(tx => {
          const cat = reqCat.result.find(c => c.id === tx.categoriaId);
          const texto = (tx.descripcion + ' ' + (cat ? cat.nombre : '')).toLowerCase();
          const tipoMatch = filtroTipo ? tx.tipo === filtroTipo : true;
          const categoriaMatch = filtroCategoria ? tx.categoriaId === filtroCategoria : true;
          const buscarMatch = buscar ? texto.includes(buscar) : true;
          return tipoMatch && categoriaMatch && buscarMatch;
        })
        .forEach(tx => {
          const cat = reqCat.result.find(c => c.id === tx.categoriaId);
          const fechaFormateada = formatFecha(tx.fecha);
          const div = document.createElement('div');
          div.className = 'transaccion-card';
          div.innerHTML = `
            <span>
              ${tx.tipo} - $${tx.monto} - ${cat ? cat.nombre : 'Sin categoría'} - ${fechaFormateada}
            </span>
            <span>${tx.descripcion}</span>
            <div>
              <button class="editar-transaccion">Editar</button>
              <button class="eliminar-transaccion">Eliminar</button>
            </div>
          `;
          div.querySelector('.eliminar-transaccion').addEventListener('click', () => eliminarTransaccion(tx.id));
          div.querySelector('.editar-transaccion').addEventListener('click', () => editarTransaccion(tx));
          lista.appendChild(div);
        });
    };
  };
}

export async function eliminarTransaccion(id) {
  if (!confirm("¿Eliminar esta transacción?")) return;
  const db = await abrirDB();
  const tx = db.transaction("transacciones", "readwrite");
  tx.objectStore("transacciones").delete(id);
  tx.oncomplete = cargarTransacciones;
}

export async function editarTransaccion(tx) {
  document.getElementById('tipo-transaccion').value = tx.tipo;
  document.getElementById('monto-transaccion').value = tx.monto;
  document.getElementById('fecha-transaccion').value = formatFecha(tx.fecha);
  document.getElementById('categoria-transaccion').value = tx.categoriaId;
  document.getElementById('desc-transaccion').value = tx.descripcion;
  const form = document.getElementById('form-transaccion');
  const originalSubmit = form.onsubmit;
  form.onsubmit = async function(e) {
    e.preventDefault();
    const tipo = document.getElementById('tipo-transaccion').value;
    const monto = Number(document.getElementById('monto-transaccion').value);
    const fechaRaw = document.getElementById('fecha-transaccion').value;
    const fecha = fechaRaw ? convertFechaToISO(fechaRaw) : '';
    const categoriaId = document.getElementById('categoria-transaccion').value;
    const descripcion = document.getElementById('desc-transaccion').value;
    if (!categoriaId) return alert("Selecciona una categoría");
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fechaRaw)) return alert("Fecha inválida. Usa dd/mm/yyyy");
    const db = await abrirDB();
    const txUpdate = db.transaction("transacciones", "readwrite");
    txUpdate.objectStore("transacciones").put({
      id: tx.id, tipo, monto, fecha, categoriaId, descripcion
    });
    txUpdate.oncomplete = cargarTransacciones;
    form.onsubmit = originalSubmit;
    form.reset();
  };
}
