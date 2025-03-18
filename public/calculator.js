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

  // Load Google Fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono&display=swap';
  document.head.appendChild(fontLink);

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
          const data = await response.json();
          config = data;
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
        ${renderInputElements(config.elements)}
        ${renderResultElements(config.elements)}
      </div>
    `;
    container.innerHTML = html;
  }

  function renderInputElements(elements) {
    return elements
      .filter(element => element.type !== 'result')
      .map(element => {
        if (element.type === 'slider') {
          return renderSlider(element);
        } else if (element.type === 'list') {
          return renderDropdown(element);
        } else if (element.type === 'checkbox') {
          return renderCheckbox(element);
        } else if (element.type === 'radio') {
          return renderRadio(element);
        } else if (element.type === 'field') {
          return renderField(element);
        } else if (element.type === 'text') {
          return renderText(element);
        }
        return '';
      }).join('');
  }

  function renderResultElements(elements) {
    const resultElements = elements.filter(element => element.type === 'result');
    
    if (resultElements.length === 0) return '';
    
    return `
      <div class="results">
        ${resultElements.map(element => renderResult(element)).join('')}
      </div>
    `;
  }

  function renderSlider(element) {
    return `
      <div class="input-group slider-group" data-element-id="${element.id}">
        <label for="${element.id}">${element.label}</label>
        ${element.description ? `<p class="helper-text">${element.description}</p>` : ''}
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
          <span>${element.min}</span>
          <span class="current-value" id="${element.id}-value">${element.default}</span>
          <span>${element.max}</span>
        </div>
      </div>
    `;
  }

  function renderDropdown(element) {
    return `
      <div class="input-group">
        <label for="${element.id}">${element.label}</label>
        ${element.description ? `<p class="helper-text">${element.description}</p>` : ''}
        <select id="${element.id}">
          ${element.options.map(option => `
            <option value="${option.value}">${option.label}</option>
          `).join('')}
        </select>
      </div>
    `;
  }

  function renderCheckbox(element) {
    return `
      <div class="input-group">
        <label for="${element.id}">${element.label}</label>
        ${element.description ? `<p class="helper-text">${element.description}</p>` : ''}
        <div class="checkbox-wrapper">
          <input type="checkbox" id="${element.id}" />
          <span>${element.label}</span>
        </div>
      </div>
    `;
  }

  function renderRadio(element) {
    return `
      <div class="input-group">
        <label>${element.label}</label>
        ${element.description ? `<p class="helper-text">${element.description}</p>` : ''}
        <div class="radio-group">
          ${element.options.map((option, index) => `
            <div class="radio-option">
              <input 
                type="radio" 
                id="${element.id}_${index}" 
                name="${element.id}" 
                value="${option.value}"
                ${index === 0 ? 'checked' : ''}
              />
              <span>${option.label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderField(element) {
    return `
      <div class="input-group">
        <label for="${element.id}">${element.label}</label>
        ${element.description ? `<p class="helper-text">${element.description}</p>` : ''}
        <input type="number" id="${element.id}" value="${element.default || 0}" />
      </div>
    `;
  }

  function renderText(element) {
    return `
      <div class="input-group">
        <label>${element.label}</label>
        <div class="text-element">
          <p>${element.description || ''}</p>
        </div>
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

  function initializeCalculations(container, config) {
    // Setup input event listeners
    const sliders = container.querySelectorAll('input[type="range"]');
    const selects = container.querySelectorAll('select');
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const radios = container.querySelectorAll('input[type="radio"]');
    const fields = container.querySelectorAll('input[type="number"]');
    
    // Add event listeners to all input types
    sliders.forEach(slider => {
      slider.addEventListener('input', function() {
        const valueDisplay = container.querySelector(`#${this.id}-value`);
        if (valueDisplay) {
          valueDisplay.textContent = this.value;
        }
        calculateResults(container, config);
      });
      
      // Trigger initial value display
      const valueDisplay = container.querySelector(`#${slider.id}-value`);
      if (valueDisplay) {
        valueDisplay.textContent = slider.value;
      }
    });
    
    selects.forEach(select => {
      select.addEventListener('change', () => calculateResults(container, config));
    });
    
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => calculateResults(container, config));
    });
    
    radios.forEach(radio => {
      radio.addEventListener('change', () => calculateResults(container, config));
    });
    
    fields.forEach(field => {
      field.addEventListener('input', () => calculateResults(container, config));
    });
    
    // Initial calculation
    calculateResults(container, config);
  }

  function calculateResults(container, config) {
    // Get all input values
    const inputs = {};
    
    // Get values from all input types
    container.querySelectorAll('input[type="range"]').forEach(input => {
      inputs[input.id] = parseFloat(input.value);
    });
    
    container.querySelectorAll('select').forEach(select => {
      inputs[select.id] = select.value;
    });
    
    container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      inputs[checkbox.id] = checkbox.checked ? 1 : 0;
    });
    
    container.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
      inputs[radio.name] = radio.value;
    });
    
    container.querySelectorAll('input[type="number"]').forEach(field => {
      inputs[field.id] = parseFloat(field.value);
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
            console.error('Calculation error for ' + result.id + ':', error);
            console.error('Inputs:', inputs);
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
    // Format like "$1,792.00" - standard currency format
    const rounded = Math.round(value * 100) / 100;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return formatter.format(rounded);
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