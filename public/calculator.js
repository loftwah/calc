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
    const sliders = elements
      .filter(element => element.type === 'slider')
      .map(element => renderSlider(element))
      .join('');

    const results = `
      <div class="results">
        ${elements
          .filter(element => element.type === 'result')
          .map(element => renderResult(element))
          .join('')}
      </div>
    `;

    return sliders + results;
  }

  function initializeCalculations(container, config) {
    function calculateResults() {
      // Get all slider values
      const inputs = {};
      config.elements
        .filter(element => element.type === 'slider')
        .forEach(element => {
          inputs[element.id] = parseInt(container.querySelector(`#${element.id}`)?.value) || 0;
        });

      // Calculate and update all results
      config.elements
        .filter(element => element.type === 'result')
        .forEach(element => {
          const result = element.formula(inputs);
          container.querySelector(`#${element.id}`).textContent = '$' + result.toFixed(2);
        });
    }

    function updateSliderBackground(slider) {
      const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
      slider.style.backgroundSize = `${value}% 100%`;
    }

    container.querySelectorAll('input[type="range"]').forEach(slider => {
      // Initialize the background size
      updateSliderBackground(slider);
      
      slider.addEventListener('input', function() {
        // Update the output value
        const valueDisplay = this.parentElement.nextElementSibling.querySelector('.current-value');
        if (valueDisplay) {
          valueDisplay.textContent = this.value;
        }
        // Update the slider fill
        updateSliderBackground(this);
        calculateResults();
      });
    });

    calculateResults();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalculator);
  } else {
    initCalculator();
  }
})(); 