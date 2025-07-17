PROYECTO 3 - SISTEMA DE FINANZAS
PERSONALES WEB
UNIVERSIDAD RAFAEL URDANETA - INGENIERÍA DE COMPUTACIÓN

DESCRIPCIÓN GENERAL:
    Desarrollar una aplicación web completa para el seguimiento y control de finanzas
    personales mensuales. La aplicación permitirá a los usuarios gestionar categorías,
    registrar transacciones, establecer presupuestos y visualizar información financiera a
    través de un dashboard interactivo con gráficos.

🔧 FUNCIONALIDADES PRINCIPALES

1. GESTIÓN DE CATEGORÍAS
    Sección central para administrar todas las categorías del sistema
     Funcionalidades requeridas:
    o Crear nuevas categorías personalizadas
    o Eliminar categorías (si se elimina una categoría con transacciones
    asociadas deberán eliminarse todas las mismas)
    o Visualizar lista completa de categorías
    o Categorías predefinidas: Alimentación, Transporte, Ocio, Servicios, Salud,
    Educación, Otros

     Interfaz:
    o Lista visual de todas las categorías con opciones de edición
    o Formulario para crear/editar categorías
    o Confirmación antes de eliminar


2. GESTIÓN DE TRANSACCIONES
    Registro y administración de todos los movimientos financieros
   
     Tipos de transacciones:
    o Ingresos
    o Egresos

     Estructura de datos por transacción:
    o Tipo de transacción (Ingreso/Egreso)
    o Monto (número positivo)
    o Fecha de realización
    o Categoría asociada (obligatoria)
    o Descripción opcional
    o ID único para identificación

     Funcionalidades:
    o Registrar nuevas transacciones
    o Editar transacciones existentes
    o Eliminar transacciones
    o Filtrar por tipo, categoría de transacción
    o Búsqueda por descripcion o categoría.

3. SISTEMA DE PRESUPUESTOS
    Planificación y control de gastos e ingresos estimados
   
     Presupuesto de gastos:
    o Establecer monto estimado por categoría para cada mes
    o Asignar presupuestos a meses específicos de cualquier año
    o Comparación automática entre gastos estimados vs reales
    o Proyección mensual de egresos totales

     Presupuesto de ingresos:
    o Establecer ingresos estimados por mes de un año
    o Proyección mensual de ingresos totales
    o Comparación con ingresos reales registrados

     Funcionalidades:
    o Crear presupuestos por mes de un año
    o Editar presupuestos existentes
    o Visualizar desviaciones (positivas/negativas)
    o Alertas cuando se supere el presupuesto de una categoría

4. DASHBOARD INTERACTIVO
    Vista principal con información financiera visual y ordenada
    
     Información mostrada:
    o Resumen del mes actual (ingresos, gastos, balance)
    o Transacciones recientes
    o Estado del presupuesto actual
    
     Gráficos con Chart.js: (Mínimo 4, ejemplos adjuntos)
    o Gastos por categoría del mes: Gráfico de dona/pastel
    o Balance real vs estimado: Gráfico de líneas mensual
    o Ingresos estimados vs reales: Gráfico de barras comparativo
    o Evolución del balance mensual: Gráfico de líneas anual
    o Distribución de gastos vs ingresos: Gráfico de barras
    
     Funcionalidades:
    o Filtros de tiempo (Mes seleccionado)
    o Actualización en tiempo real al registrar transacciones

🛠️ REQUISITOS TÉCNICOS DETALLADOS

Interfaz de Usuario
    1. Navegación principal:
        o Dashboard (página inicial)
        o Transacciones
        o Categorías
        o Presupuestos
    2. Formularios requeridos:
        o Registro/edición de transacciones
        o Gestión de categorías
        o Configuración de presupuestos
    3. Vistas de datos:
        o Lista de transacciones con filtros avanzados
        o Comparativa gastos estimados vs reales
        o Resumen mensual

Persistencia con IndexedDB:
    Se deberá manejar IndexedDB para la implementación de persistencia local en el
    navegador.

Estructura del código:
    Se deberá trabajar con una estructura orientada a pseudocomponentes
    para mayor estructura del proyecto. Separar

Entregables:
    1. Código fuente completo en repositorio Github
    2. Aplicación desplegada en vercel u otra plataforma.
    3. README con documentación

METODOLOGÍA DE TRABAJO:
    Dado que el proyecto se trabajará en parejas, deben trabajar en un solo
    repositorio en Github de manera colaborativa y deben reflejarse los commits de
    ambos miembros en el mismo.
    Se sugiere trabajar con un esquema de ramas:
         Master: principal (producción)
         Develop: desarrollo, antes de pasar a master
         Ramas para features individuales y hacer PR a develop

CONSIDERACIONES ADICIONALES:
     Será tomado en cuenta la originalidad de la interfaz gráfica, estilos del
    proyecto para la evaluación, proyecto que se determine que no fue
    realizado por el estudiante sino por inteligencia artificial no tendrá
    oportunidad para ser evaluado.
     Se evaluará la organización del trabajo en conjunto entre la pareja, esto se
    visualizará a través de los commits realizados.