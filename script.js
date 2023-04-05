//import FetchWrapper from "./fetch-wrapper.js";
import { capitalize, calculateCalories } from "./helpers.js";
import AppData from './app-data.js';
//import 'chart.js';
//import Chart from 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.2.1/Chart.js'

  




const API = new FetchWrapper('https://foodtracker.onrender.com/');
const appData = new AppData;


const form = document.getElementById("create-form");
const name = document.getElementById("create-name");
const carbs = document.getElementById("create-carbs");
const protein = document.getElementById("create-protein");
const fat = document.getElementById("create-fat");
const foodList = document.getElementById("food-list");
const totalCalories= document.getElementById("total-calories");

const displayEntry = (name, carbs, protein , fat) =>{
    appData.addFood(carbs, protein, fat);
    foodList.insertAdjacentHTML("beforeend",
    `<li class = "card">
        <div>
            <h3 class="name">${capitalize(name)}</h3>
            <div class="calories">${calculateCalories(carbs, protein, fat)} calories</div>
            <ul>
                <li class="carbs">
                    <div>Carbs</div>
                    <div class="value">${carbs}g</div>
                </li>
                <li class="protein">
                    <div>Protein</div>
                    <div class="value">${protein}g</div>
                </li>
                <li class="fat">
                    <div>Fat</div>
                    <div class="value">${fat}g</div>
                </li>
            </ul>
        </div>
    </li>`);
}

// Add FOOD 

form.addEventListener("submit", event =>{
    console.log('click')
    event.preventDefault();
    console.log('click')
    
   /* API.post('/', {
            name: name.value,
            carbs: carbs.value,
            protein: protein.value,
            fat: fat.value
        
    })*/

    fetch('https://foodtracker.onrender.com/', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: name.value,
            carbs: carbs.value,
            protein: protein.value,
            fat: fat.value
        })
    })
    .then(response => response.json())
    .then((data)=>{
        console.log(data);
        if(data.error){
            console.log("error")
            return
        }
        // Render FOOD
        displayEntry(name.value, carbs.value, protein.value, fat.value);
        render();
        name.value = '';
        carbs.value = '';
        protein.value = '';
        fat.value = '';
    })
    
  /*  fetch('http://localhost:3003', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: name.value,
            carbs: carbs.value,
            protein: protein.value,
            fat: fat.value
        })
    })
    .then(response => response.json())
    .then(data=>{console.log(data)}) */

})
    //GET SAVED FOOD AND LIST THEM

const init = () =>{
   // const API = new FetchWrapper('https://foodtracker.onrender.com/');
   fetch('https://foodtracker.onrender.com/')
   .then(response => response.json())
   .then(data => {
    console.log(data);
    data?.forEach(item =>{
        console.log(item);

// LIST FOOD

    displayEntry(item.name, item.carbs, item.protein, item.fat);

    })
    render();
   });

}

let chartInstance = null;
const renderChart = () => {
  chartInstance?.destroy();
  const context = document.querySelector("#app-chart").getContext("2d");

  chartInstance = new Chart(context, {
    type: "bar",
    data: {
      labels: ["Carbs", "Protein", "Fat"],
      datasets: [
        {
          label: "Macronutrients",
          data: [appData.getTotalCarbs(), appData.getTotalProtein(), appData.getTotalFat()],
          backgroundColor: ["#25AEEE", "#FECD52", "#57D269"],
          borderWidth: 3, // example of other customization
        },
      ],
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
  });
};

const updateTotalCalories = () =>{
      return  totalCalories.textContent = appData.getTotalCalories();
}

const render = () =>{
    renderChart();
    updateTotalCalories();
}

init();