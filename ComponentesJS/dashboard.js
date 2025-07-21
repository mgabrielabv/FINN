export function renderDashboard() {
  const main = document.getElementById('vista-principal');
  if (!main) return;
  main.innerHTML = '';

  const dashboard = document.createElement('div');
  dashboard.id = 'dashboard';
  dashboard.style.display = 'flex';
  dashboard.style.flexDirection = 'column';
  dashboard.style.alignItems = 'center';
  dashboard.style.gap = '20px';
  dashboard.style.width = '100%';
  dashboard.style.maxWidth = '1800px';
  dashboard.style.margin = '650px auto 0 auto';
  dashboard.style.fontFamily = 'Arial, sans-serif';
  dashboard.style.minHeight = 'auto';
  dashboard.style.boxSizing = 'border-box';
  dashboard.style.overflow = 'visible';

  const titulo = document.createElement('h1');
  titulo.textContent = 'DASHBOARD';
  titulo.style.textAlign = 'center';
  titulo.style.color = '#fff';
  titulo.style.margin = '0 0 10px 0';
  titulo.style.fontSize = '2.2rem';
  dashboard.appendChild(titulo);

  const filtros = document.createElement('div');
  filtros.style.display = 'flex';
  filtros.style.justifyContent = 'center';
  filtros.style.gap = '15px';
  filtros.style.marginBottom = '10px';
  filtros.style.flexWrap = 'wrap';
  const mesSelect = document.createElement('select')
  mesSelect.id = 'mes-select';
  mesSelect.style.padding = '8px 12px';
  mesSelect.style.borderRadius = '4px';
  mesSelect.style.border = '1px solid #444';
  mesSelect.style.background = '#2c2f33';
  mesSelect.style.color = '#fff';
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  meses.forEach((mes, i) => {
    const option = document.createElement('option');
    option.value = i + 1;
    option.textContent = mes;
    if (i === new Date().getMonth()) option.selected = true;
    mesSelect.appendChild(option);
  });
  const anioSelect = document.createElement('select');
  anioSelect.id = 'anio-select';
  anioSelect.style.padding = '8px 12px';
  anioSelect.style.borderRadius = '4px';
  anioSelect.style.border = '1px solid #444';
  anioSelect.style.background = '#2c2f33';
  anioSelect.style.color = '#fff';
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 2; i <= currentYear + 2; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    if (i === currentYear) option.selected = true;
    anioSelect.appendChild(option);
  }
  filtros.appendChild(createFilterControl('Mes:', mesSelect));
  filtros.appendChild(createFilterControl('Año:', anioSelect));
  dashboard.appendChild(filtros);

  const kpis = document.createElement('div');
  kpis.style.display = 'flex';
  kpis.style.flexDirection = 'row';
  kpis.style.justifyContent = 'center';
  kpis.style.alignItems = 'stretch';
  kpis.style.gap = '18px';
  kpis.style.marginBottom = '15px';
  const kpiData = [
    { id: 'ingresos', title: 'INGRESOS', color: '#4CAF50' },
    { id: 'gastos', title: 'GASTOS', color: '#F44336' },
    { id: 'balance', title: 'BALANCE', color: '#2196F3' },
    { id: 'presupuesto', title: 'PRESUPUESTO', color: '#9C27B0' }
  ];
  kpiData.forEach(kpi => {
    const card = document.createElement('div');
    card.id = `${kpi.id}-kpi`;
    card.style.background = '#2c2f33';
    card.style.padding = '12px';
    card.style.borderRadius = '8px';
    card.style.textAlign = 'center';
    card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    const title = document.createElement('div');
    title.textContent = kpi.title;
    title.style.color = kpi.color;
    title.style.fontSize = '0.9rem';
    title.style.marginBottom = '5px';
    title.style.fontWeight = 'bold';
    const value = document.createElement('div');
    value.className = 'kpi-valor';
    value.textContent = '0.00 €';
    value.style.fontSize = '1.2rem';
    value.style.fontWeight = 'bold';
    value.style.color = '#fff';
    card.appendChild(title);
    card.appendChild(value);
    kpis.appendChild(card);
  });
  dashboard.appendChild(kpis);

  const graficosContainer = document.createElement('div');
  graficosContainer.style.display = 'flex';
  graficosContainer.style.flexDirection = 'column';
  graficosContainer.style.alignItems = 'center';
  graficosContainer.style.gap = '20px';
  graficosContainer.style.marginBottom = '20px';
  graficosContainer.style.width = '100%';
  graficosContainer.style.maxWidth = '100%';
  graficosContainer.style.boxSizing = 'border-box';
  graficosContainer.style.padding = '0';

  const filaArriba = document.createElement('div');
  filaArriba.style.display = 'flex';
  filaArriba.style.justifyContent = 'center';
  filaArriba.style.alignItems = 'center';
  filaArriba.style.gap = '15px';
  filaArriba.style.width = '100%';
  filaArriba.style.maxWidth = '100%';
  filaArriba.style.margin = '0 auto';

  const graficosArriba = [
    { id: 'gastos-categoria', title: 'GASTOS POR CATEGORÍA', type: 'doughnut' },
    { id: 'balance-mensual', title: 'BALANCE MENSUAL', type: 'line' },
    { id: 'ingresos-comparativo', title: 'INGRESOS REAL VS ESTIMADO', type: 'bar' }
  ];
  graficosArriba.forEach(grafico => {
    const contenedor = document.createElement('div');
    contenedor.style.background = '#2c2f33';
    contenedor.style.borderRadius = '8px';
    contenedor.style.padding = '15px';
    contenedor.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    contenedor.style.minHeight = '300px';
    contenedor.style.display = 'flex';
    contenedor.style.flexDirection = 'column';
    contenedor.style.alignItems = 'center';
    contenedor.style.justifyContent = 'center';
    contenedor.style.width = '100%';
    contenedor.style.maxWidth = '350px';
    contenedor.style.boxSizing = 'border-box';
    const title = document.createElement('h3');
    title.textContent = grafico.title;
    title.style.margin = '0 0 10px 0';
    title.style.fontSize = '1rem';
    title.style.color = '#fff';
    const canvasContainer = document.createElement('div');
    canvasContainer.style.position = 'relative';
    canvasContainer.style.height = '220px';
    canvasContainer.style.width = '100%';
    const canvas = document.createElement('canvas');
    canvas.id = `chart-${grafico.id}`;
    canvasContainer.appendChild(canvas);
    contenedor.appendChild(title);
    contenedor.appendChild(canvasContainer);
    filaArriba.appendChild(contenedor);
  });
  graficosContainer.appendChild(filaArriba);

  const filaAbajo = document.createElement('div');
  filaAbajo.style.display = 'grid';
  filaAbajo.style.gridTemplateColumns = 'repeat(2, 1fr)';
  filaAbajo.style.gap = '15px';
  filaAbajo.style.width = '100%';
  filaAbajo.style.maxWidth = '100%';
  filaAbajo.style.marginLeft = '0';
  filaAbajo.style.marginRight = 'auto';

  const graficosAbajo = [
    { id: 'evolucion-balance', title: 'EVOLUCIÓN ANUAL', type: 'line' },
    { id: 'distribucion', title: 'DISTRIBUCIÓN', type: 'bar' }
  ];
  graficosAbajo.forEach(grafico => {
    const contenedor = document.createElement('div');
    contenedor.style.background = '#2c2f33';
    contenedor.style.borderRadius = '8px';
    contenedor.style.padding = '15px';
    contenedor.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    contenedor.style.minHeight = '300px';
    contenedor.style.display = 'flex';
    contenedor.style.flexDirection = 'column';
    contenedor.style.alignItems = 'center';
    contenedor.style.justifyContent = 'center';
    contenedor.style.width = '100%';
    contenedor.style.maxWidth = '450px';
    contenedor.style.boxSizing = 'border-box';
    const title = document.createElement('h3');
    title.textContent = grafico.title;
    title.style.margin = '0 0 10px 0';
    title.style.fontSize = '1rem';
    title.style.color = '#fff';
    const canvasContainer = document.createElement('div');
    canvasContainer.style.position = 'relative';
    canvasContainer.style.height = '220px';
    canvasContainer.style.width = '100%';
    const canvas = document.createElement('canvas');
    canvas.id = `chart-${grafico.id}`;
    canvasContainer.appendChild(canvas);
    contenedor.appendChild(title);
    contenedor.appendChild(canvasContainer);
    filaAbajo.appendChild(contenedor);
  });
  graficosContainer.appendChild(filaAbajo);
  dashboard.appendChild(graficosContainer);

  const transacciones = document.createElement('div');
  const transTitle = document.createElement('h2');
  transTitle.textContent = 'TRANSACCIONES RECIENTES';
  transTitle.style.color = '#fff';
  transTitle.style.margin = '0 0 10px 0';
  transTitle.style.fontSize = '1.2rem';
  const tablaContainer = document.createElement('div');
  tablaContainer.style.background = '#2c2f33';
  tablaContainer.style.borderRadius = '8px';
  tablaContainer.style.padding = '15px';
  tablaContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  tablaContainer.style.maxHeight = '300px';
  tablaContainer.style.overflowY = 'auto';
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th style="padding:10px; text-align:left; border-bottom:1px solid #444; position:sticky; top:0; background:#2c2f33;">Fecha</th>
      <th style="padding:10px; text-align:left; border-bottom:1px solid #444; position:sticky; top:0; background:#2c2f33;">Descripción</th>
      <th style="padding:10px; text-align:right; border-bottom:1px solid #444; position:sticky; top:0; background:#2c2f33;">Monto</th>
    </tr>
  `;
  const tbody = document.createElement('tbody');
  tbody.id = 'transacciones-body';
  table.appendChild(thead);
  table.appendChild(tbody);
  tablaContainer.appendChild(table);
  transacciones.appendChild(transTitle);
  transacciones.appendChild(tablaContainer);
  dashboard.appendChild(transacciones);

  main.appendChild(dashboard);

  // Espera datos externos generados por el programa
  if (window.dashboardData) {
    loadDashboardData(window.dashboardData);
  } else {
    console.warn('No se encontraron datos para el dashboard. Asigna window.dashboardData antes de renderizar.');
    loadDashboardData(); // fallback a datos simulados
  }
}

function createFilterControl(labelText, selectElement) {
  const div = document.createElement('div');
  div.style.display = 'flex';
  div.style.alignItems = 'center';
  div.style.gap = '8px';
  const label = document.createElement('label');
  label.textContent = labelText;
  label.style.color = '#fff';
  div.appendChild(label);
  div.appendChild(selectElement);
  return div;
}

function loadDashboardData(data) {
 
  if (!data) {
    data = {
      ingresos: 3250.75,
      gastos: 1875.30,
      balance: 1375.45,
      presupuesto: 2500.00,
      transacciones: [
        { fecha: '2023-07-20', descripcion: 'Supermercado', monto: 120.75, tipo: 'gasto' },
        { fecha: '2023-07-19', descripcion: 'Salario', monto: 2200.00, tipo: 'ingreso' },
        { fecha: '2023-07-18', descripcion: 'Gasolina', monto: 50.20, tipo: 'gasto' },
        { fecha: '2023-07-17', descripcion: 'Netflix', monto: 12.99, tipo: 'gasto' },
        { fecha: '2023-07-16', descripcion: 'Freelance', monto: 450.00, tipo: 'ingreso' }
      ],
      gastosCategoria: {
        labels: ['Vivienda', 'Alimentación', 'Transporte', 'Ocio', 'Salud'],
        data: [650, 350, 400, 250, 150]
      },
      balanceMensual: {
        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
        real: [800, 850, 900, 700],
        estimado: [1000, 1000, 1000, 1000]
      },
      ingresosComparativo: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
        real: [2800, 2950, 3100, 2900, 3000, 3150, 3250],
        estimado: [3000, 3000, 3000, 3000, 3000, 3000, 3000]
      },
      evolucionBalance: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
        data: [1200, 1350, 1500, 1400, 1550, 1700, 1850]
      },
      distribucion: {
        labels: ['Ingresos', 'Gastos'],
        data: [3250, 1875]
      }
    };
  }

  document.querySelector('#ingresos-kpi .kpi-valor').textContent = '$' + data.ingresos.toFixed(2);
  document.querySelector('#gastos-kpi .kpi-valor').textContent = '$' + data.gastos.toFixed(2);
  document.querySelector('#balance-kpi .kpi-valor').textContent = '$' + data.balance.toFixed(2);
  document.querySelector('#presupuesto-kpi .kpi-valor').textContent = '$' + data.presupuesto.toFixed(2);

  const tbody = document.getElementById('transacciones-body');
  tbody.innerHTML = '';
  data.transacciones.forEach(t => {
    const row = document.createElement('tr');
    row.style.borderBottom = '1px solid #444';
    const fecha = new Date(t.fecha);
    const fechaFormateada = fecha.toLocaleDateString('es-ES');
    row.innerHTML = `
      <td style="padding:10px;">${fechaFormateada}</td>
      <td style="padding:10px;">${t.descripcion}</td>
      <td style="padding:10px; text-align:right; color:${t.tipo === 'ingreso' ? '#4CAF50' : '#F44336'}">
        $${t.monto.toFixed(2)}
      </td>
    `;
    tbody.appendChild(row);
  });

  // Crear gráficos
  createChart('chart-gastos-categoria', 'doughnut', {
    labels: data.gastosCategoria.labels,
    datasets: [{
      data: data.gastosCategoria.data,
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      borderWidth: 1
    }]
  });
  createChart('chart-balance-mensual', 'line', {
    labels: data.balanceMensual.labels,
    datasets: [
      {
        label: 'Real',
        data: data.balanceMensual.real,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Estimado',
        data: data.balanceMensual.estimado,
        borderColor: '#9C27B0',
        borderDash: [5, 5],
        backgroundColor: 'rgba(156, 39, 176, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  });
  createChart('chart-ingresos-comparativo', 'bar', {
    labels: data.ingresosComparativo.labels,
    datasets: [
      {
        label: 'Real',
        data: data.ingresosComparativo.real,
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
        borderWidth: 1
      },
      {
        label: 'Estimado',
        data: data.ingresosComparativo.estimado,
        backgroundColor: 'rgba(33, 150, 243, 0.5)',
        borderColor: 'rgba(33, 150, 243, 0.8)',
        borderWidth: 1
      }
    ]
  });
  createChart('chart-evolucion-balance', 'line', {
    labels: data.evolucionBalance.labels,
    datasets: [{
      label: 'Balance',
      data: data.evolucionBalance.data,
      borderColor: '#FF9800',
      backgroundColor: 'rgba(255, 152, 0, 0.1)',
      tension: 0.3,
      fill: true,
      pointBackgroundColor: '#FF9800',
      pointBorderColor: '#fff',
      pointRadius: 5,
      pointHoverRadius: 7
    }]
  });
  createChart('chart-distribucion', 'bar', {
    labels: data.distribucion.labels,
    datasets: [{
      label: 'Distribución',
      data: data.distribucion.data,
      backgroundColor: ['#4CAF50', '#F44336'],
      borderColor: ['#4CAF50', '#F44336'],
      borderWidth: 1
    }]
  });
}

function createChart(id, type, data) {
  const ctx = document.getElementById(id).getContext('2d');
  new Chart(ctx, {
    type: type,
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#fff',
            font: { size: 12 }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.parsed.y !== undefined) {
                label += '$' + context.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2 });
              } else {
                label += '$' + context.raw.toLocaleString('en-US', { minimumFractionDigits: 2 });
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: type === 'bar',
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: {
            color: '#fff',
            callback: function(value) {
              return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2 });
            }
          }
        },
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: { color: '#fff' }
        }
      }
    }
  });
}
