// get references to key DOM objects
const button = document.querySelector('#calculate-taxes');
const form = document.querySelector('#tax-form');
const grossSalary = document.querySelector('#gross-salary');
const outputDiv = document.querySelector('.output');
const resetBtn = document.querySelector("#btn-reset");

let chart = '';

let user = {
    'gross': 0,
    'federal': 0, 
    'state': 0,
    'medicare': 0,
    'socialSecurity': 0, 
    'total': 0, 
    'net': 0
}


const doTaxes = () => {
    const gross = grossSalary.value;
    user.gross = gross;
    console.log('doing taxes ');

    doStateTaxes(gross);
    doFederalTaxes(gross);
    doSocialSecurity(gross);
    doMedicare(gross);
    doTotal();
    doNet();
    display();
    makeChart();
}

const doFederalTaxes = grossIncome => {
    let federalTax;
    if (grossIncome < 9876) {
        federalTax = grossIncome * .1;
    } else if (grossIncome < 40126) {
        federalTax = ((grossIncome - 9875) * .12) + 987.5;
    } else if (grossIncome < 85526) {
        federalTax = ((grossIncome - 40125) * .22) + 4617.5;
    } else if (grossIncome < 163301) {
        federalTax = ((grossIncome - 85525) * .24) + 14605.5;
    } else if (grossIncome < 207351) {
        federalTax = ((grossIncome - 163300) * .32) + 33271.5;
    } else if (grossIncome < 518401) {
        federalTax = ((grossIncome - 207350) * .35) + 47367.5;
    }  else {
        federalTax = ((grossIncome - 518400) * .37) + 156235;
    }

    user.federal = federalTax;
}

const doStateTaxes = grossIncome => {
    let stateTax;
    if (grossIncome < 11971) {
        stateTax = grossIncome * .0354;
    } else if (grossIncome < 23931) {
        stateTax = ((grossIncome - 11970) * .0465) + 423.74;
    } else if (grossIncome < 263481) {
        stateTax = ((grossIncome - 23930) * .0627) + 979.88;
    } else {
        stateTax = ((grossIncome - 263480) * .0765) + 15999.67;
    }

    user.state = stateTax;
}

const doSocialSecurity = grossIncome => {
    let socialSecurityTax;
    if (grossIncome <= 137000) {
        socialSecurityTax = grossIncome * .062;
    } else {
        socialSecurityTax = 8494;
    }

    user.socialSecurity = socialSecurityTax;
}

const doMedicare = grossIncome => {
    let medicareTax;
    if (grossIncome <= 200000) {
        medicareTax = grossIncome * .0145;
    } else {
        medicareTax = ((grossIncome - 200000) * .0235) + 2900;
    }

    user.medicare = medicareTax;
}

const doTotal = () => {
    const totalTaxes = user.federal + user.state + user.medicare + user.socialSecurity
    user.total = totalTaxes;
}

const doNet = () => {
    const netTaxes =  user.gross - user.total;
    user.net = netTaxes;
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const display = () => {
    const table = `
    <table class='table table-dark'>
        <tr>
            <td>Gross Pay</td>
            <td> ${ formatter.format(user.gross) } </td>
        </tr>
        <tr>
            <td>Federal Taxes</td>
            <td> ${ formatter.format(user.federal) } </td>
        </tr>
        <tr>
            <td>State Taxes</td>
            <td> ${ formatter.format(user.state) }  </td>
        </tr>
        <tr>
            <td>Medicare Taxes</td>
            <td> ${ formatter.format(user.medicare) } </td>
        </tr>
        <tr>
            <td>SS Taxes</td>
            <td> ${ formatter.format(user.socialSecurity) } </td>
        </tr>
        <tr>
            <td>Total Taxes</td>
            <td> ${ formatter.format(user.total) } </td>
        </tr>
        <tr>
            <td>Net Pay</td>
            <td> ${ formatter.format(user.net) }  </td>
        </tr>
        <tr>
            <td>Percent of income to taxes</td>
            <td> ${ +((1 - (user.net / user.gross)) * 100).toFixed(2) + '%' }  </td>
        </tr>
    </table>
    `;

    outputDiv.innerHTML = table;
}

// pie chart
const makeChart = () => {

    const data = {
        labels: ['Federal Tax', 'State Tax', 'Social Security Tax', 'Medicare Tax', 'Net Pay'],
        datasets: [
        {
            label: 'Tax burdens',
            data:[+user.federal.toFixed(2), 
                +user.state.toFixed(2), 
                +user.socialSecurity.toFixed(2), 
                +user.medicare.toFixed(2), 
                +user.net.toFixed(2)],
            backgroundColor: [
                'rgba(255, 99, 132)',
                'rgba(255, 165, 0)',
                'rgba(255, 255, 0)',
                'rgba(54, 0, 255)',
                'rgba(11, 103, 2)'
            ],
        }
        ]
    }

    const ctx = document.getElementById('pieChart').getContext('2d');
    chart = new Chart(ctx, { 
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Tax Burden By Category',
                    color: 'white',
                    fullsize: true,
                    font: {
                        size: 22
                    }
                },
                legend: {
                    labels: {
                        color: 'white',
                    },
                    position: 'top'
                }
            }, 
            
        }
    });    
}

// event listeners
button.addEventListener('click', function(e) {
    e.preventDefault();
    doTaxes();
});

resetBtn.addEventListener('click', function() {
    window.location.reload(false);
})

