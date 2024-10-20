// Exchange rate (1 USD to INR)
const USD_TO_INR_RATE = 74.5; // This is a fixed rate for example purposes. In a real application, use an up-to-date rate.

let income = 0;
let budgets = { Food: 0, Bills: 0, EMI: 0, Entertainment: 0 };
let expenses = { Food: 0, Bills: 0, EMI: 0, Entertainment: 0 };
let budgetChart, expensesChart;

function setIncome() {
    income = parseFloat(document.getElementById('incomeInput').value) || 0;
    updateSummary();
}

function setBudget() {
    budgets.Food = parseFloat(document.getElementById('foodBudget').value) || 0;
    budgets.Bills = parseFloat(document.getElementById('billsBudget').value) || 0;
    budgets.EMI = parseFloat(document.getElementById('emiBudget').value) || 0;
    budgets.Entertainment = parseFloat(document.getElementById('entertainmentBudget').value) || 0;
    updateBudgetChart();
    updateSummary();
}

function addExpense() {
    const amount = parseFloat(document.getElementById('expenseAmount').value) || 0;
    const category = document.getElementById('expenseCategory').value;
    expenses[category] += amount;
    updateExpensesChart();
    updateSummary();
}

function removeExpense() {
    const amount = parseFloat(document.getElementById('expenseAmount').value) || 0; // Using the same input for amount
    const category = document.getElementById('expenseCategory').value;

    if (expenses[category] >= amount) {
        expenses[category] -= amount; // Decrease the amount in the selected category
    } else {
        alert('Cannot remove more than the current expense amount for this category.');
    }

    updateExpensesChart();
    updateSummary();
}

function updateBudgetChart() {
    const ctx = document.getElementById('budgetPieChart').getContext('2d');
    if (budgetChart) {
        budgetChart.destroy();
    }
    budgetChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(budgets),
            datasets: [{
                data: Object.values(budgets),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Budget Allocation'
            }
        }
    });
}

function updateExpensesChart() {
    const ctx = document.getElementById('expensesBarChart').getContext('2d');
    if (expensesChart) {
        expensesChart.destroy();
    }
    expensesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(expenses),
            datasets: [{
                label: 'Expenses',
                data: Object.values(expenses),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateSummary() {
    const totalBudget = Object.values(budgets).reduce((a, b) => a + b, 0);
    const totalExpenses = Object.values(expenses).reduce((a, b) => a + b, 0);
    const monthlySavings = income - totalExpenses;
    const budgetUtilization = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

    document.getElementById('totalIncome').textContent = `${income.toFixed(2)} (₹${(income * USD_TO_INR_RATE).toFixed(2)})`;
    document.getElementById('totalBudget').textContent = `${totalBudget.toFixed(2)} (₹${(totalBudget * USD_TO_INR_RATE).toFixed(2)})`;
    document.getElementById('totalExpenses').textContent = `${totalExpenses.toFixed(2)} (₹${(totalExpenses * USD_TO_INR_RATE).toFixed(2)})`;
    document.getElementById('monthlySavings').textContent = `${monthlySavings.toFixed(2)} (₹${(monthlySavings * USD_TO_INR_RATE).toFixed(2)})`;
    document.getElementById('yearlySavings').textContent = `${(monthlySavings * 12).toFixed(2)} (₹${(monthlySavings * 12 * USD_TO_INR_RATE).toFixed(2)})`;
    document.getElementById('budgetUtilization').textContent = budgetUtilization.toFixed(2);

    const savingsElements = document.querySelectorAll('#monthlySavings, #yearlySavings');
    savingsElements.forEach(element => {
        if (parseFloat(element.textContent) >= 0) {
            element.className = 'savings-positive';
        } else {
            element.className = 'savings-negative';
        }
    });
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text('Personal Finance Report', 105, 15, null, null, 'center');

    // Add summary information
    doc.setFontSize(12);
    doc.text(`Total Income: ₹${document.getElementById('totalIncome').textContent}`, 20, 30);
    doc.text(`Total Budget: ₹${document.getElementById('totalBudget').textContent}`, 20, 40);
    doc.text(`Total Expenses: ₹${document.getElementById('totalExpenses').textContent}`, 20, 50);
    doc.text(`Monthly Savings: ₹${document.getElementById('monthlySavings').textContent}`, 20, 60);
    doc.text(`Yearly Savings: ₹${document.getElementById('yearlySavings').textContent}`, 20, 70);
    doc.text(`Budget Utilization: ${document.getElementById('budgetUtilization').textContent}%`, 20, 80);

    // Add charts
    html2canvas(document.getElementById('budgetPieChart')).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 15, 90, 90, 70);
        
        html2canvas(document.getElementById('expensesBarChart')).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', 110, 90, 90, 70);
            
            // Save the PDF
            doc.save('personal_finance_report.pdf');
        });
    });
}

// Initialize charts
updateBudgetChart();
updateExpensesChart();
updateSummary();
