(function() {
  // Check if script is already loaded
  if (window.SchoolStatusCalculator) return;

  // Create calculator namespace
  window.SchoolStatusCalculator = {
    initialized: false
  };

  // Load required styles
  const styles = document.createElement('link');
  styles.rel = 'stylesheet';
  styles.href = 'https://calc.deanlofts.xyz/calculator.css';
  document.head.appendChild(styles);

  async function initCalculator() {
    if (window.SchoolStatusCalculator.initialized) return;
    
    const containers = document.querySelectorAll('[data-config]');
    
    for (const container of containers) {
      try {
        // Get calculator config from data attribute if available
        const configData = container.getAttribute('data-calculator');
        let config;
        
        if (configData) {
          // Use embedded config
          config = JSON.parse(configData);
        } else {
          // Fallback to fetching config (for embedded widget use)
          const configType = container.getAttribute('data-config');
          const response = await fetch(`https://calc.deanlofts.xyz/calculators/${configType}`);
          config = await response.json();
        }
        
        // Render calculator based on config
        renderCalculator(container, config);
        initializeCalculations(container, config);
      } catch (error) {
        console.error('Failed to load calculator:', error);
        container.innerHTML = '<p>Failed to load calculator</p>';
      }
    }

    window.SchoolStatusCalculator.initialized = true;
  }

  function renderCalculator(container, config) {
    // Render HTML based on config elements
    const html = `
      <div class="calculator-widget">
        <h1>${config.name}</h1>
        <p class="subtitle">${config.description}</p>
        ${renderElements(config.elements)}
      </div>
    `;
    container.innerHTML = html;
  }

  function renderSlider(element) {
    return `
      <div class="input-group">
        <div class="slider-header">
          <label for="${element.id}">${element.label}</label>
          <div class="range-input">
            <input 
              type="range"
              id="${element.id}"
              min="${element.min}"
              max="${element.max}"
              step="${element.step}"
              value="${element.default}"
            />
          </div>
          <div class="range-values">
            <span>0</span>
            <span class="current-value">${element.default}</span>
            <span>${element.max}</span>
          </div>
        </div>
        ${element.description ? `<p class="helper-text">${element.description}</p>` : ''}
      </div>
    `;
  }

  function renderResult(element) {
    return `
      <div class="cost-line ${element.isTotal ? 'total' : ''}">
        <span>${element.label}</span>
        <span id="${element.id}">$0.00</span>
      </div>
    `;
  }

  function renderElements(elements) {
    return elements.map(element => {
      if (element.type === 'slider') {
        return renderSlider(element);
      } else if (element.type === 'result') {
        return renderResult(element);
      }
      return '';
    }).join('');
  }

  function initializeCalculations(container, config) {
    // Setup input event listeners
    const sliders = container.querySelectorAll('input[type="range"]');
    
    sliders.forEach(slider => {
      // Update displayed value when slider changes
      slider.addEventListener('input', function() {
        const valueDisplay = this.closest('.slider-header').querySelector('.current-value');
        if (valueDisplay) {
          valueDisplay.textContent = this.value;
        }
        
        // Recalculate all values
        calculateResults(container, config);
      });
      
      // Initial calculation
      slider.dispatchEvent(new Event('input'));
    });
  }

  function calculateResults(container, config) {
    // Get all input values
    const inputs = {};
    container.querySelectorAll('input[type="range"]').forEach(input => {
      inputs[input.id] = parseFloat(input.value);
    });
    
    // Apply calculations from config
    config.elements
      .filter(element => element.type === 'result')
      .forEach(result => {
        let value = 0;
        
        if (result.formula) {
          try {
            // Call the formula function with inputs
            value = result.formula(inputs);
          } catch (error) {
            console.error('Calculation error:', error);
          }
        }
        
        // Format as currency and update DOM
        const element = container.querySelector(`#${result.id}`);
        if (element) {
          element.textContent = formatCurrency(value);
        }
      });
  }

  function formatCurrency(value) {
    return '$' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalculator);
  } else {
    initCalculator();
  }
  
  // Also listen for our custom event
  document.addEventListener('calculatorInit', initCalculator);
})(); 