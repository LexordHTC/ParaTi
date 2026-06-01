/* ==========================================================================
   LÓGICA INTERACTIVA - CARTA ROMÁNTICA
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ELEMENTOS DEL DOM
  const seal = document.getElementById('envelope-seal');
  const wrapper = document.getElementById('envelope-wrapper');
  const instructions = document.getElementById('instructions');
  const heartBg = document.getElementById('heart-bg');

  // CONFIGURACIÓN DE CORAZONES DE FONDO
  const heartsSymbols = ['❤', '💖', '💝', '💕', '💗', '❤️'];
  
  function createBackgroundHeart() {
    const heart = document.createElement('div');
    heart.classList.add('bg-heart');
    
    // Símbolo aleatorio
    heart.innerText = heartsSymbols[Math.floor(Math.random() * heartsSymbols.length)];
    
    // Propiedades aleatorias para dinamismo visual
    const size = Math.floor(Math.random() * 20) + 15; // Entre 15px y 35px
    const left = Math.random() * 100; // Ubicación horizontal
    const duration = Math.random() * 5 + 6; // Entre 6 y 11 segundos de viaje
    const opacity = Math.random() * 0.4 + 0.15; // Opacidad sutil
    const rotate = Math.floor(Math.random() * 360);
    
    heart.style.setProperty('--size', size + 'px');
    heart.style.left = left + '%';
    heart.style.setProperty('--duration', duration + 's');
    heart.style.setProperty('--opacity', opacity);
    heart.style.setProperty('--rotate', rotate + 'deg');
    
    heartBg.appendChild(heart);
    
    // Limpieza automática
    setTimeout(() => {
      heart.remove();
    }, duration * 1000);
  }

  // Generar corazones flotantes de fondo constantemente
  setInterval(createBackgroundHeart, 800);

  // PARTICULAS DE CORAZÓN AL INTERACTUAR (EXPLOSIÓN)
  function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.classList.add('heart-particle');
    particle.innerText = '❤';
    
    // Trayectoria y tamaño aleatorios
    const size = Math.floor(Math.random() * 15) + 10; // 10px a 25px
    const tx = (Math.random() - 0.5) * 200; // Dispersión X
    const ty = (Math.random() - 0.5) * 200 - 50; // Dispersión Y (con tendencia a subir)
    const rot = (Math.random() - 0.5) * 180;
    
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.setProperty('--size', size + 'px');
    particle.style.setProperty('--tx', tx + 'px');
    particle.style.setProperty('--ty', ty + 'px');
    particle.style.setProperty('--rot', rot + 'deg');
    
    document.body.appendChild(particle);
    
    // Limpieza de partícula
    setTimeout(() => {
      particle.remove();
    }, 800);
  }

  function createHeartBurst(x, y, count = 15) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => createParticle(x, y), i * 15); // Disparo secuencial ultra veloz
    }
  }

  // EVENTO DE APERTURA DEL SOBRE
  seal.addEventListener('click', (e) => {
    e.stopPropagation();
    
    // Efecto de explosión de corazones en el sello
    const rect = seal.getBoundingClientRect();
    const sealX = rect.left + rect.width / 2;
    const sealY = rect.top + rect.height / 2;
    createHeartBurst(sealX, sealY, 25);
    
    // Activar solapa superior (Animación 3D)
    wrapper.classList.add('active');
    
    // Bajar sobre y revelar hojas
    setTimeout(() => {
      wrapper.classList.add('open');
      instructions.classList.add('show');
      
      // Lanzar corazones desde donde emergen las hojas
      setTimeout(() => {
        const s1 = document.getElementById('sheet-1').getBoundingClientRect();
        const s2 = document.getElementById('sheet-2').getBoundingClientRect();
        const s3 = document.getElementById('sheet-3').getBoundingClientRect();
        createHeartBurst(s1.left + s1.width / 2, s1.top + s1.height / 2, 8);
        createHeartBurst(s2.left + s2.width / 2, s2.top + s2.height / 2, 8);
        createHeartBurst(s3.left + s3.width / 2, s3.top + s3.height / 2, 8);
      }, 500);

      // Desvanecer el sobre completamente después de que se desplieguen las hojas
      setTimeout(() => {
        wrapper.classList.add('fade-out');
        setTimeout(() => {
          wrapper.style.display = 'none';
        }, 800); // Esperar que termine la transición de opacidad
      }, 1500);
    }, 450);
  });

  // ==========================================================================
  // LÓGICA DE ARRASTRE DE HOJAS (DRAG & DROP) MULTITÁCTIL Y DE RATÓN
  // ==========================================================================
  
  const sheets = {
    'sheet-1': { dragX: 0, dragY: 0 },
    'sheet-3': { dragX: 0, dragY: 0 },
    'sheet-2': { dragX: 0, dragY: 0 }
  };
  
  let activeSheet = null;
  let startX = 0;
  let startY = 0;
  let initialDragX = 0;
  let initialDragY = 0;
  let highestZ = 15;

  function startDrag(e, sheet) {
    // Evitar arrastrar si el usuario está enfocado/editando texto para mejorar accesibilidad de edición
    if (e.target.closest('[contenteditable="true"]')) {
      return;
    }
    
    activeSheet = sheet;
    highestZ++;
    sheet.style.zIndex = highestZ;
    
    // Desactivar animaciones de transición mientras se arrastra para evitar retrasos visuales
    sheet.style.transition = 'none';
    
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
    
    startX = clientX;
    startY = clientY;
    
    const id = sheet.id;
    initialDragX = sheets[id].dragX;
    initialDragY = sheets[id].dragY;
    
    // Burst de corazones en el punto de contacto inicial
    createHeartBurst(clientX, clientY, 4);
  }

  function moveDrag(e) {
    if (!activeSheet) return;
    
    // Prevenir el scroll por defecto en móviles mientras se arrastran las cartas
    if (e.cancelable) {
      e.preventDefault();
    }
    
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
    
    const dx = clientX - startX;
    const dy = clientY - startY;
    
    const id = activeSheet.id;
    sheets[id].dragX = initialDragX + dx;
    sheets[id].dragY = initialDragY + dy;
    
    // Inyectar el desplazamiento dinámicamente mediante variables CSS
    activeSheet.style.setProperty('--drag-x', sheets[id].dragX + 'px');
    activeSheet.style.setProperty('--drag-y', sheets[id].dragY + 'px');
    
    // Soltar un pequeño corazón ocasional mientras se desplaza la hoja
    if (Math.random() < 0.08) {
      createParticle(clientX, clientY);
    }
  }

  function endDrag() {
    if (!activeSheet) return;
    // Restaurar transiciones de sombra y z-index, pero omitir transform para evitar saltos bruscos
    activeSheet.style.transition = 'box-shadow 0.3s, z-index 0.1s';
    activeSheet = null;
  }

  // Registrar eventos para todas las hojas de carta
  document.querySelectorAll('.letter-sheet').forEach(sheet => {
    // Eventos de ratón
    sheet.addEventListener('mousedown', (e) => startDrag(e, sheet));
    
    // Eventos táctiles para móviles
    sheet.addEventListener('touchstart', (e) => startDrag(e, sheet), { passive: true });
    
    // Llevar al frente si se hace clic aunque no se arrastre
    sheet.addEventListener('click', () => {
      highestZ++;
      sheet.style.zIndex = highestZ;
    });
  });

  // Eventos globales del ciclo de vida del arrastre
  window.addEventListener('mousemove', moveDrag);
  window.addEventListener('touchmove', moveDrag, { passive: false });
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchend', endDrag);
});
