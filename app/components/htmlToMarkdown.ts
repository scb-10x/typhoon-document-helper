// Function to handle conversion of math formulas from HTML to Markdown
export function processMathElements(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Process inline math formulas
    const inlineMathElements = tempDiv.querySelectorAll('.math-inline');
    inlineMathElements.forEach((element) => {
        const formula = element.getAttribute('data-formula');
        if (formula) {
            // Replace the element with the Markdown-style math formula
            const placeholder = document.createElement('span');
            placeholder.textContent = `$${formula}$`;
            element.parentNode?.replaceChild(placeholder, element);
        }
    });

    // Process block math formulas
    const blockMathElements = tempDiv.querySelectorAll('.math-block');
    blockMathElements.forEach((element) => {
        const formula = element.getAttribute('data-formula');
        if (formula) {
            // Replace the element with the Markdown-style math formula
            const placeholder = document.createElement('div');
            placeholder.textContent = `$$\n${formula}\n$$`;
            element.parentNode?.replaceChild(placeholder, element);
        }
    });

    return tempDiv.innerHTML;
} 