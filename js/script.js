document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const demoButton = document.getElementById('demo-button');
    const themeToggle = document.getElementById('theme-toggle');
    const buttonTextInput = document.getElementById('button-text');
    const buttonColorInput = document.getElementById('button-color');
    const buttonSizeSelect = document.getElementById('button-size');
    const buttonAnimationSelect = document.getElementById('button-animation');

    // Inicialización del tema
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.className = `${currentTheme}-theme`;
    updateThemeIcon(currentTheme);
    
    // Aplicar animación de entrada
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Efecto ripple
    demoButton.addEventListener('click', createRipple);
    
    // Cambiar tema
    themeToggle.addEventListener('click', toggleTheme);
    
    // Personalización del botón
    buttonTextInput.addEventListener('input', updateButtonText);
    buttonColorInput.addEventListener('input', updateButtonColor);
    buttonSizeSelect.addEventListener('change', updateButtonSize);
    buttonAnimationSelect.addEventListener('change', updateButtonAnimation);
    
    // Inicializar con valores por defecto
    updateButtonColor({ target: { value: '#4361ee' } });
    updateButtonSize({ target: { value: 'medium' } });
    updateButtonAnimation({ target: { value: 'none' } });
    
    // Funciones
    function createRipple(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size/2}px`;
        ripple.style.top = `${e.clientY - rect.top - size/2}px`;
        ripple.classList.add('ripple');
        ripple.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        ripple.style.opacity = '0.7';
        
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        button.appendChild(ripple);
        
        // Eliminar el elemento después de la animación
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    function toggleTheme() {
        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        const isDark = document.body.classList.contains('dark-theme');
        const newTheme = isDark ? 'light' : 'dark';
        
        document.body.classList.remove(`${isDark ? 'dark' : 'light'}-theme`);
        document.body.classList.add(`${newTheme}-theme`);
        
        updateThemeIcon(newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Reset transition after animation completes
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    }
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('.theme-icon');
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    
    function updateButtonText(e) {
        const text = e.target.value || 'Haz clic';
        demoButton.querySelector('.button-text').textContent = text;
    }
    
    function updateButtonColor(e) {
        const color = e.target.value;
        demoButton.style.setProperty('--primary-color', color);
        demoButton.style.setProperty('--primary-hover', adjustColor(color, -20));
    }
    
    function updateButtonSize(e) {
        const size = e.target.value;
        demoButton.className = 'premium-button';
        demoButton.classList.add(size);
        
        // Aplicar nuevamente la animación si existe
        const currentAnimation = buttonAnimationSelect.value;
        if (currentAnimation !== 'none') {
            demoButton.classList.add(`animate-${currentAnimation}`);
        }
    }
    
    function updateButtonAnimation(e) {
        const animation = e.target.value;
        const button = document.getElementById('demo-button');
        
        // Remover todas las clases de animación
        button.classList.remove(
            'animate-pulse',
            'animate-bounce',
            'animate-float',
            'animate-shake',
            'animate-tada'
        );
        
        // Aplicar la animación seleccionada
        if (animation !== 'none') {
            button.classList.add(`animate-${animation}`);
        }
    }
    
    // Función auxiliar para ajustar el color
    function adjustColor(color, amount) {
        return '#' + color.replace(/^#/, '').replace(/../g, color => 
            ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
        );
    }

    // Animación de entrada para los elementos
    document.querySelectorAll('.premium-button, .control-group, h1, h2').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        // Usar requestAnimationFrame para asegurar que las propiedades se apliquen antes de la animación
        requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    });
});