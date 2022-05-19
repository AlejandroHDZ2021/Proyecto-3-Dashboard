const form1 = document.querySelector('#form1')
const container = document.querySelector('.container')
const information = document.querySelector('#information')
let foodData;
let foodSearch = form1.value;


//=============== FUNCTION TO BRING GROUP OF ITEMS FROM API ===============
const getData = async()=>{
    const url = `https://trackapi.nutritionix.com/v2/search/instant?query=${form1.value}&detailed=true`
    try {
        let response = await fetch(url,{
            method:'GET',
            headers:{
                'content-type':'application/json',
                'x-app-id':'52961f76',
                'x-app-key':'767fff5579e1dfc9bd9b25e883d8a276'
            }
        })
        let data = await response.json()
        console.log(data.common)
        foodData = data.common
        render()
    } catch (error) {
        console.log('no item found')
    }
    
   
}
//=============== FUNCTION TO RENDER CARD WITH FOOD ITEM INFORMATION ===============
const render = ()=>{
    container.innerHTML=''
    foodData.forEach(food => {
        container.innerHTML +=`
        
        <div class="row text-center align-item-center" style="border: 0.5px solid">
                        <div class="col-xl-4"  style="background-color:#aaa">
                        <img src="${food.photo.thumb}" class="card-img-top" alt="">
                        </div>
                        <div class="col-xl-4"  style="background-color:#bbb">
                          <h3>${food.food_name.toUpperCase()}</h3> 
                        </div>
                        <div class="col-xl-4"  style="background-color:#ccc">
                        <a href="#"  class="btn  btn-danger" id="${food.food_name}" data-bs-target="#staticBackdrop" data-bs-toggle="modal" onclick="bringNutrients(this);addToBasket(this)">Agregar</a
                        </div>
                </div>`
    });
    
}


//=============== FUNCTION TO BRING NUTRITION DETAILS FROM API ===============


const bringNutrients = async(btn)=>{
    const url = 'https://trackapi.nutritionix.com/v2/natural/nutrients'
    try {
           let response = await fetch(url,{
               method:'POST',
               headers:{
                   'content-type':'application/json',
                   'x-app-id':'52961f76',
                   'x-app-key':'767fff5579e1dfc9bd9b25e883d8a276'
               },
               body:JSON.stringify({
                    query:`${btn.id}`
               })
           })
           let data = await response.json()
           console.log(data.foods[0]) 
           foodData = data.foods[0]
        //    renderChart()
       } catch (error) {
           container.innerHTML=`
           Sorry nothing was found please try another food item`
           console.log('oops, no information was found on this item')
       }
       getKeys(foodData);
       
    
}   
    let labels = []
    let keyValues = []
    const getKeys = (array)=>{
        let keys = Object.entries(array).map(([key,value])=>{
            if (key.startsWith('nf')) {
              labels.push(key.slice(3).toLocaleUpperCase());
              keyValues.push(value);
            }
                  
        })
    } 
    
//=============== FUNCTION TO SHOW BAR CHART WITH ALL THE NUTRITION DETAILS ===============





const charts = document.querySelectorAll(".chart");

charts.forEach(function (chart) {
  var ctx = chart.getContext("2d");
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Informacion Nutricional",
          data: keyValues,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});

let addToBasket = (btn) =>{
  foodData.forEach((food)=>{
    if (food.name = btn) {
      
    }
  })
}


