
document.addEventListener('DOMContentLoaded', () => {
  mostrarVista('dashboard');
  document.getElementById('nav-categorias').onclick = () => mostrarVista('categorias');
  document.getElementById('nav-transacciones').onclick = () => mostrarVista('transacciones');
  document.getElementById('nav-dashboard').onclick = () => mostrarVista('dashboard');
});
function abrirDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("FinanzasDB", 1);
    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("categorias")) {
        db.createObjectStore("categorias", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("transacciones")) {
        db.createObjectStore("transacciones", { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Error al abrir IndexedDB");
  });
}

function generarId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 5);
}

async function mostrarVista(vista) {
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


async function cargarCategorias() {
  const db = await abrirDB();
  const tx = db.transaction("categorias", "readonly");
  const store = tx.objectStore("categorias");
  const req = store.getAll();
  req.onsuccess = function() {
    const lista = document.getElementById('lista-categorias');
    lista.innerHTML = '';
    req.result.forEach(cat => {
      const div = document.createElement('div');
      div.className = 'categoria-card';
      div.innerHTML = `<span>${cat.nombre}</span>
        <button onclick="eliminarCategoria('${cat.id}')">Eliminar</button>`;
      lista.appendChild(div);
    });
  };
}

// Eliminar categoría y sus transacciones asociadas
async function eliminarCategoria(id) {
  if (!confirm("¿Eliminar la categoría y todas sus transacciones?")) return;
  const db = await abrirDB();
  // Eliminar transacciones asociadas
  const tx1 = db.transaction("transacciones", "readwrite");
  const storeTx = tx1.objectStore("transacciones");
  const req = storeTx.getAll();
  req.onsuccess = function() {
    req.result.forEach(tx => {
      if (tx.categoriaId === id) storeTx.delete(tx.id);
    });
  };
  // Eliminar categoría
  const tx2 = db.transaction("categorias", "readwrite");
  tx2.objectStore("categorias").delete(id);
  tx2.oncomplete = cargarCategorias;
}

// Cargar categorías en el formulario de transacciones
async function cargarCategoriasTransaccion() {
  const db = await abrirDB();
  const tx = db.transaction("categorias", "readonly");
  const store = tx.objectStore("categorias");
  const req = store.getAll();
  req.onsuccess = function() {
    const select = document.getElementById('categoria-transaccion');
    select.innerHTML = '';
    req.result.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.nombre;
      select.appendChild(opt);
    });
  };
}

// Cargar transacciones
async function cargarTransacciones() {
  const db = await abrirDB();
  const tx = db.transaction("transacciones", "readonly");
  const store = tx.objectStore("transacciones");
  const req = store.getAll();
  req.onsuccess = async function() {
    const lista = document.getElementById('lista-transacciones');
    lista.innerHTML = '';
    // Obtener categorías para mostrar nombre
    const dbCat = await abrirDB();
    const txCat = dbCat.transaction("categorias", "readonly");
    const storeCat = txCat.objectStore("categorias");
    const reqCat = storeCat.getAll();
    reqCat.onsuccess = function() {
      req.result.forEach(tx => {
        const cat = reqCat.result.find(c => c.id === tx.categoriaId);
        const div = document.createElement('div');
        div.className = 'transaccion-card';
        div.innerHTML = `<span>${tx.tipo} - $${tx.monto} - ${cat ? cat.nombre : 'Sin categoría'} - ${tx.fecha}</span>
          <span>${tx.descripcion}</span>`;
        lista.appendChild(div);
      });
    };
  };
}

