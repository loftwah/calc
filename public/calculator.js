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
        // Get calculator config
        const configType = container.getAttribute('data-config');
        const configData = container.getAttribute('data-calculator');
        let config;
        
        if (configData) {
          // Use embedded config if available
          config = JSON.parse(configData);
          
          // After parsing, we need to reconstruct the formula functions
          if (config.elements) {
            config.elements.forEach(element => {
              if (element.type === 'result' && typeof element.formula === 'string') {
                // Check if the formula is already wrapped in a function
                if (element.formula.trim().startsWith('(function')) {
                  // For IIFE style functions, wrap in a new function that returns the result
                  element.formula = new Function('inputs', 'return ' + element.formula);
                } else if (element.formula.includes('return')) {
                  // For multi-line functions with return statements
                  element.formula = new Function('inputs', element.formula);
                } else {
                  // For simple expressions
                  element.formula = new Function('inputs', 'return ' + element.formula);
                }
              }
            });
          }
        } else if (configType === 'operoo') {
          // Hardcoded Operoo config for reliable operation
          config = {
            id: 'operoo',
            name: 'Operoo Cost Calculator',
            description: 'Calculate costs related to Operoo usage in schools',
            elements: [
              {
                type: "slider",
                id: "students",
                label: "Number of Students",
                min: 0,
                max: 3000,
                step: 1,
                default: 1000,
                description: "Total number of students in the school"
              },
              {
                type: "slider",
                id: "pagesStudent",
                label: "Pages per Student",
                min: 0,
                max: 500,
                step: 1,
                default: 100,
                description: "Includes registration, consent forms, handbooks, policies, agreements..."
              },
              {
                type: "slider",
                id: "mailoutsStudent",
                label: "Mailouts per Student",
                min: 0,
                max: 50,
                step: 1,
                default: 10,
                description: "Letters via mail. Most schools conduct about 18 mail-outs per year."
              },
              {
                type: "slider",
                id: "staff",
                label: "Number of Staff",
                min: 0,
                max: 300,
                step: 1,
                default: 50,
                description: "Total number of staff members"
              },
              {
                type: "slider",
                id: "pagesStaff",
                label: "Pages per Staff",
                min: 0,
                max: 500,
                step: 1,
                default: 100,
                description: "Includes HR forms, contracts, policies, agreements, etc."
              },
              {
                type: "result",
                id: "paperCost",
                label: "Paper Costs @ 1.4c per page",
                formula: function(inputs) { 
                  return (inputs.students * inputs.pagesStudent) * 0.014; 
                }
              },
              {
                type: "result",
                id: "printingCost",
                label: "Printing/Toner Costs @ 1.2c per page",
                formula: function(inputs) { 
                  return (inputs.students * inputs.pagesStudent + inputs.staff * inputs.pagesStaff) * 0.012; 
                }
              },
              {
                type: "result",
                id: "maintenanceCost",
                label: "Printer/Copier Maintenance @ $395 service fee every 50,000 copies",
                formula: function(inputs) { 
                  return ((inputs.students * inputs.pagesStudent + inputs.staff * inputs.pagesStaff) / 50000) * 395; 
                }
              },
              {
                type: "result",
                id: "postageCost",
                label: "Postage Costs @ 50c per mailout",
                formula: function(inputs) { 
                  return (inputs.students * inputs.mailoutsStudent) * 0.5; 
                }
              },
              {
                type: "result",
                id: "totalCost",
                label: "Total",
                isTotal: true,
                formula: function(inputs) {
                  const paperCost = (inputs.students * inputs.pagesStudent) * 0.014;
                  const printingCost = (inputs.students * inputs.pagesStudent + inputs.staff * inputs.pagesStaff) * 0.012;
                  const maintenanceCost = ((inputs.students * inputs.pagesStudent + inputs.staff * inputs.pagesStaff) / 50000) * 395;
                  const postageCost = (inputs.students * inputs.mailoutsStudent) * 0.5;
                  return paperCost + printingCost + maintenanceCost + postageCost;
                }
              }
            ],
            allowedDomains: ["deanlofts.xyz", "*.deanlofts.xyz", "*.operoo.com", "operoo.com", "localhost"]
          };
        } else if (configType) {
          // Try to fetch from server for other configs
          const response = await fetch(`https://calc.deanlofts.xyz/calculators/${configType}`);
          config = await response.json();
          
          // Reconstruct formula functions here too
          if (config.elements) {
            config.elements.forEach(element => {
              if (element.type === 'result' && typeof element.formula === 'string') {
                // Check if the formula is already wrapped in a function
                if (element.formula.trim().startsWith('(function')) {
                  // For IIFE style functions, wrap in a new function that returns the result
                  element.formula = new Function('inputs', 'return ' + element.formula);
                } else if (element.formula.includes('return')) {
                  // For multi-line functions with return statements
                  element.formula = new Function('inputs', element.formula);
                } else {
                  // For simple expressions
                  element.formula = new Function('inputs', 'return ' + element.formula);
                }
              }
            });
          }
        } else {
          throw new Error("No calculator configuration found");
        }
        
        // Render calculator based on config
        container.innerHTML = renderCalculator(config);
        
        // Setup event listeners and initial calculations
        setupCalculator(container, config);
        
      } catch (error) {
        container.innerHTML = '<div style="color: red; padding: 20px;">Failed to load calculator</div>';
      }
    }

    window.SchoolStatusCalculator.initialized = true;
  }

  function renderCalculator(config) {
    let html = `
      <div class="calculator-widget">
        <h1>${config.name}</h1>
        <p class="subtitle">${config.description}</p>
    `;
    
    // Add input controls
    config.elements.forEach(element => {
      if (element.type === 'slider') {
        html += `
          <div class="input-group">
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
    });
    
    // Add results section
    html += '<div class="results">';
    
    config.elements.forEach(element => {
      if (element.type === 'result') {
        html += `
          <div class="cost-line ${element.isTotal ? 'total' : ''}">
            <span>${element.label}</span>
            <span id="${element.id}">$0.00</span>
          </div>
        `;
      }
    });
    
    html += '</div></div>';
    
    return html;
  }

  function setupCalculator(container, config) {
    const widget = container.querySelector('.calculator-widget');
    
    // Initialize slider displays
    widget.querySelectorAll('input[type="range"]').forEach(slider => {
      const valueDisplay = widget.querySelector(`#${slider.id}-value`);
      if (valueDisplay) {
        valueDisplay.textContent = slider.value;
      }
      
      // Add event listener
      slider.addEventListener('input', function() {
        if (valueDisplay) {
          valueDisplay.textContent = this.value;
        }
        calculateAndDisplay(widget, config);
      });
    });
    
    // Initial calculation
    calculateAndDisplay(widget, config);
  }

  function calculateAndDisplay(widget, config) {
    // Gather all input values
    const inputs = {};
    
    // Set defaults for required values to prevent NaN
    inputs.students = 0;
    inputs.pagesStudent = 0;
    inputs.mailoutsStudent = 0;
    inputs.staff = 0;
    inputs.pagesStaff = 0;
    
    // Get actual values from sliders
    widget.querySelectorAll('input[type="range"]').forEach(input => {
      inputs[input.id] = parseFloat(input.value) || 0; // Use 0 if NaN
    });
    
    // Calculate each result
    config.elements.forEach(element => {
      if (element.type === 'result' && typeof element.formula === 'function') {
        try {
          // Execute the formula function
          const result = element.formula(inputs);
          
          // Update the display
          const displayElement = widget.querySelector(`#${element.id}`);
          if (displayElement) {
            displayElement.textContent = formatCurrency(isNaN(result) ? 0 : result);
          }
        } catch (error) {
          // Silently handle errors
        }
      }
    });
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalculator);
  } else {
    initCalculator();
  }
  
  // Also listen for custom event
  document.addEventListener('calculatorInit', initCalculator);
})();