// Cargar categorías en el formulario de transacciones
export async function cargarCategoriasTransaccion() {
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
export async function cargarTransacciones() {
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

