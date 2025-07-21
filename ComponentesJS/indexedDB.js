export function abrirDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("FinanzasDB", 2); // Debe ser versión 2 o mayor
    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("categorias")) {
        db.createObjectStore("categorias", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("transacciones")) {
        db.createObjectStore("transacciones", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("presupuestos")) {
        db.createObjectStore("presupuestos", { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Error al abrir IndexedDB");
  });
}

export function generarId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 5);
}