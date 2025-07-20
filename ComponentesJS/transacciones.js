import { abrirDB, generarId } from './indexedDB.js';
import { cargarCategoriasTransaccion } from './categorias.js';
export { cargarCategoriasTransaccion } from './categorias.js';
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

// Renderiza el formulario y lista de transacciones
export async function renderTransacciones() {
  const main = document.getElementById('vista-principal');
  main.innerHTML = `
  <h2>Transacciones</h2>
  <div>
    <input type="text" id="buscar-transaccion" class="btn-buscar" placeholder="Buscar descripción o categoría">
    <select id="filtrar-tipo" class="btn-filtrar">
      <option value="">Todos</option>
      <option value="Ingreso">Ingreso</option>
      <option value="Egreso">Egreso</option>
    </select>
    <select id="filtrar-categoria" class="btn-filtrar"></select>
    <button id="btn-filtrar" class="btn-filtrar">Filtrar</button>
  </div>
  <div id="lista-transacciones"></div>
  <form id="form-transaccion">
    <select id="tipo-transaccion">
      <option value="Ingreso">Ingreso</option>
      <option value="Egreso">Egreso</option>
    </select>
    <input type="number" id="monto-transaccion" placeholder="Monto" min="1" required>
    <input type="text" id="fecha-transaccion" placeholder="dd/mm/yyyy" maxlength="10" required autocomplete="off">
    <select id="categoria-transaccion"></select>
    <input type="text" id="desc-transaccion" placeholder="Descripción (opcional)">
    <button type="submit">Registrar</button>
  </form>
  <style>
    .btn-filtrar, .btn-buscar {
      background: #222;
      color: #fff;
      border: 1.4px solid #444;
      border-radius: 8px;
      padding: 0.7em 1em;
      font-size: 1em;
      font-family: inherit;
      margin-right: 8px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .btn-filtrar:focus, .btn-buscar:focus {
      border-color: #2997ff;
      box-shadow: 0 0 0 2px rgba(41,151,255,0.3);
      outline: none;
    }
    #btn-filtrar {
      background: #2997ff;
      color: #fff;
      border: none;
      font-weight: 600;
      border-radius: 8px;
      padding: 0.6em 1.6em;
      cursor: pointer;
      transition: background 0.2s;
    }
    #btn-filtrar:hover {
      background: #007aff;
    }
    .btn-buscar {
      width: 180px;
    }
    /* Botones de editar/eliminar en transacciones */
    .transaccion-card button.editar-transaccion {
      background: #2997ff;
      border: none;
      color: #fff;
      border-radius: 8px;
      padding: 0.4em 1.2em;
      font-weight: 600;
      cursor: pointer;
      margin-right: 8px;
      transition: background 0.2s;
    }
    .transaccion-card button.editar-transaccion:hover {
      background: #007aff;
    }
    .transaccion-card button.eliminar-transaccion {
      background: #e74c3c;
      border: none;
      color: #fff;
      border-radius: 8px;
      padding: 0.4em 1.2em;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .transaccion-card button.eliminar-transaccion:hover {
      background: #c0392b;
    }
  </style>
`;

  await cargarCategoriasTransaccion();
  await cargarCategoriasFiltro();
  cargarTransacciones();

  // Máscara para fecha dd/mm/yyyy
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
    // Convertir fecha dd/mm/yyyy a yyyy-mm-dd para guardar
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

  document.getElementById('btn-filtrar').onclick = () => cargarTransacciones();
  document.getElementById('buscar-transaccion').oninput = () => cargarTransacciones();
  document.getElementById('filtrar-tipo').onchange = () => cargarTransacciones();
  document.getElementById('filtrar-categoria').onchange = () => cargarTransacciones();
}

// Convierte fecha dd/mm/yyyy a yyyy-mm-dd
function convertFechaToISO(fechaStr) {
  if (!fechaStr) return '';
  const [d, m, y] = fechaStr.split('/');
  return `${y}-${m}-${d}`;
}

// Formatea fecha yyyy-mm-dd a dd/mm/yyyy
function formatFecha(fechaStr) {
  if (!fechaStr) return '';
  if (fechaStr.includes('/')) return fechaStr;
  const [y, m, d] = fechaStr.split('-');
  return `${d}/${m}/${y}`;
}

// Obtiene y muestra las transacciones filtradas/buscadas
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

    // Obtener categorías para mostrar nombre
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
          // Mostrar fecha en formato dd/mm/yyyy
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

// Eliminar transacción
export async function eliminarTransaccion(id) {
  if (!confirm("¿Eliminar esta transacción?")) return;
  const db = await abrirDB();
  const tx = db.transaction("transacciones", "readwrite");
  tx.objectStore("transacciones").delete(id);
  tx.oncomplete = cargarTransacciones;
}

// Editar transacción (abre formulario con datos para editar)
export async function editarTransaccion(tx) {
  // Puedes mostrar un modal o reutilizar el formulario principal
  // Ejemplo básico: rellena el formulario principal con los datos
  document.getElementById('tipo-transaccion').value = tx.tipo;
  document.getElementById('monto-transaccion').value = tx.monto;
  // Si la fecha está en dd/mm/yyyy, úsala tal cual, si está en yyyy-mm-dd, conviértela
  document.getElementById('fecha-transaccion').value = formatFecha(tx.fecha);
  document.getElementById('categoria-transaccion').value = tx.categoriaId;
  document.getElementById('desc-transaccion').value = tx.descripcion;
  // Cambia el submit para actualizar
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
