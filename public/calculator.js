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
            label.className = 'result-label';
            value.className = 'result-value';
          });
          
          // Add proper slider label structure
          container.querySelectorAll('input[type="range"]').forEach(slider => {
            const labels = slider.nextElementSibling;
            labels.className = 'slider-labels';
          });

          // Initialize calculation functionality
          const script = document.createElement('script');
          script.textContent = `
            function calculateResults() {
              const students = parseInt(document.getElementById('students').value) || 0;
              const pagesStudent = parseInt(document.getElementById('pagesStudent').value) || 0;
              const mailoutsStudent = parseInt(document.getElementById('mailoutsStudent').value) || 0;
              const staff = parseInt(document.getElementById('staff').value) || 0;
              const pagesStaff = parseInt(document.getElementById('pagesStaff').value) || 0;

              const paperCost = (students * pagesStudent) * 0.014;
              const printingCost = (students * pagesStudent + staff * pagesStaff) * 0.012;
              const maintenanceCost = ((students * pagesStudent + staff * pagesStaff) / 50000) * 395;
              const postageCost = (students * mailoutsStudent) * 0.5;
              const totalCost = paperCost + printingCost + maintenanceCost + postageCost;

              document.getElementById('paperCost').textContent = '$' + paperCost.toFixed(2);
              document.getElementById('printingCost').textContent = '$' + printingCost.toFixed(2);
              document.getElementById('maintenanceCost').textContent = '$' + maintenanceCost.toFixed(2);
              document.getElementById('postageCost').textContent = '$' + postageCost.toFixed(2);
              document.getElementById('totalCost').textContent = '$' + totalCost.toFixed(2);
            }

            document.querySelectorAll('input[type="range"]').forEach(slider => {
              slider.addEventListener('input', function() {
                this.nextElementSibling.children[1].textContent = this.value;
                calculateResults();
              });
            });

            calculateResults();
          `;
          document.body.appendChild(script);
        }
      } catch (error) {
        console.error('Failed to load calculator:', error);
        container.innerHTML = '<p>Failed to load calculator</p>';
      }
    }

    window.SchoolStatusCalculator.initialized = true;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalculator);
  } else {
    initCalculator();
  }
})(); 