// script.js

// Set up the chart globally so we can update it later
let churnChart;

// Handle form submission and API request
document.getElementById("churnForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Get form data
    const customerData = {
        CreditScore: document.getElementById("creditScore").value,
        Geography: document.getElementById("geography").value,
        Gender: document.getElementById("gender").value,
        Age: document.getElementById("age").value,
        Tenure: document.getElementById("tenure").value,
        Balance: document.getElementById("balance").value,
        NumOfProducts: document.getElementById("numOfProducts").value,
        HasCrCard: document.getElementById("hasCrCard").value,
        IsActiveMember: document.getElementById("isActiveMember").value,
        EstimatedSalary: document.getElementById("estimatedSalary").value
    };

    // Send data to the FastAPI backend
    const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(customerData)
    });

    const result = await response.json();
    
    // Display result in the HTML
    const churnProbability = result.churn_probability;
    document.getElementById("result").textContent = `Churn Probability: ${churnProbability.toFixed(2)}`;

    // Update the chart
    updateChart(churnProbability);
});

// Function to update the chart with new data
function updateChart(churnProbability) {
    if (churnChart) {
        // If the chart already exists, update the data
        churnChart.data.datasets[0].data.push(churnProbability);
        churnChart.data.labels.push(`Customer ${churnChart.data.labels.length + 1}`);
        churnChart.update();
    } else {
        // If chart doesn't exist, create it
        const ctx = document.getElementById('churnChart').getContext('2d');
        churnChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Customer 1'],
                datasets: [{
                    label: 'Churn Probability',
                    data: [churnProbability],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}
