import { abrirDB } from './indexedDB.js';

export async function cargarCategoriasTransaccion() {
  const db = await abrirDB();
  const tx = db.transaction("categorias", "readonly");
  const store = tx.objectStore("categorias");
  const req = store.getAll();
  req.onsuccess = function() {
    const select = document.getElementById('categoria-transaccion');
    if (!select) return;
    select.innerHTML = '';
    req.result.forEach(cat => {
      select.innerHTML += `<option value="${cat.id}">${cat.nombre}</option>`;
    });
  };
}

export async function cargarCategorias() {
  const db = await abrirDB();
  const tx = db.transaction("categorias", "readonly");
  const store = tx.objectStore("categorias");
  const req = store.getAll();
  req.onsuccess = function() {
    const lista = document.getElementById('lista-categorias');
    if (!lista) return;
    lista.innerHTML = '';
    req.result.forEach(cat => {
      const div = document.createElement('div');
      div.className = 'categoria-card';
      div.innerHTML = `<span>${cat.nombre}</span>
        <button>Eliminar</button>`;
      const btnEliminar = div.querySelector('button');
      btnEliminar.addEventListener('click', async () => {
        await eliminarCategoria(cat.id);
      });
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
