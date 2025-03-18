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
      const configType = container.getAttribute('data-config');
      
      try {
        // Fetch calculator HTML
        const response = await fetch(`https://calc.deanlofts.xyz/calculators/${configType}`);
        const html = await response.text();
        
        // Extract calculator content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const calculator = doc.querySelector('.max-w-3xl');
        
        if (calculator) {
          // Add widget class and remove Tailwind classes
          calculator.className = 'calculator-widget';
          container.innerHTML = calculator.outerHTML;

          // Update HTML structure to match new CSS
          container.querySelectorAll('.flex.justify-between').forEach(el => {
            el.className = 'result-row' + (el.querySelector('.font-bold') ? ' total' : '');
            
            // Add classes to label and value
            const label = el.children[0];
            const value = el.children[1];
            if (label && value) {
              label.className = 'result-label';
              value.className = 'result-value';
            }
          });
          
          // Add proper slider label structure
          container.querySelectorAll('input[type="range"]').forEach(slider => {
            const labels = slider.nextElementSibling;
            if (labels) {
              labels.className = 'slider-labels';
            }
          });

          // Initialize calculation functionality
          initializeCalculations(container);
        }
      } catch (error) {
        console.error('Failed to load calculator:', error);
        container.innerHTML = '<p>Failed to load calculator</p>';
      }
    }

    window.SchoolStatusCalculator.initialized = true;
  }

  function initializeCalculations(container) {
    function calculateResults() {
      const students = parseInt(container.querySelector('#students')?.value) || 0;
      const pagesStudent = parseInt(container.querySelector('#pagesStudent')?.value) || 0;
      const mailoutsStudent = parseInt(container.querySelector('#mailoutsStudent')?.value) || 0;
      const staff = parseInt(container.querySelector('#staff')?.value) || 0;
      const pagesStaff = parseInt(container.querySelector('#pagesStaff')?.value) || 0;

      const paperCost = (students * pagesStudent) * 0.014;
      const printingCost = (students * pagesStudent + staff * pagesStaff) * 0.012;
      const maintenanceCost = ((students * pagesStudent + staff * pagesStaff) / 50000) * 395;
      const postageCost = (students * mailoutsStudent) * 0.5;
      const totalCost = paperCost + printingCost + maintenanceCost + postageCost;

      container.querySelector('#paperCost').textContent = '$' + paperCost.toFixed(2);
      container.querySelector('#printingCost').textContent = '$' + printingCost.toFixed(2);
      container.querySelector('#maintenanceCost').textContent = '$' + maintenanceCost.toFixed(2);
      container.querySelector('#postageCost').textContent = '$' + postageCost.toFixed(2);
      container.querySelector('#totalCost').textContent = '$' + totalCost.toFixed(2);
    }

    container.querySelectorAll('input[type="range"]').forEach(slider => {
      slider.addEventListener('input', function() {
        if (this.nextElementSibling?.children[1]) {
          this.nextElementSibling.children[1].textContent = this.value;
        }
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