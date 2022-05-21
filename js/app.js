const form1 = document.querySelector('#form1')
const container = document.querySelector('#container')
const information = document.querySelector('#information')
const chart = document.querySelector(".chart")
const canasta = document.querySelector('#canasta')
const total = document.querySelector('#totalCalories')
let plate = JSON.parse(localStorage.getItem("PLATE")) || [];
let foodSearch = form1.value;
let foodData;
let nutrients;




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
        foodData = data.common
        console.log(foodData)
        render(foodData)
    } catch (error) {
        console.log('no item found')
    }
    
   
}
//=============== FUNCTION TO RENDER CARD WITH FOOD ITEM INFORMATION ===============
const render = (array)=>{
    container.innerHTML=''
    array.forEach(food => {
        container.innerHTML +=`
        
        <div class="row  text-center align-items-center justify-content-center" style="border: 0.5px solid; margin: 0px; ">
                        <div class="col-xl-2">
                        <img src="${food.photo.thumb}"  style=" width: 40px; height: 40px;">
                        </div>
                        <div class="col-xl-6" >
                          <h5>${food.food_name}</h5> 
                        </div>
                        <div class="col-xl-2">
                        <a href="#"  class="btn  btn-success btn-sm" id="${food.food_name}" data-bs-target="#staticBackdrop" data-bs-toggle="modal" onclick="bringNutrients(this)">Agregar</a
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
           nutrients = data.foods[0]
        //    renderChart()
       } catch (error) {
           container.innerHTML=`
           Sorry nothing was found please try another food item`
           console.log('oops, no information was found on this item')
       }
       addToStorage(nutrients)
    
}   
    
//=============== FUNCTION TO SHOW BAR CHART WITH ALL THE NUTRITION DETAILS ===============






//=============== FUNCTION TO ADD TOTAL CALORIES AND RENDER TOTAL ===============
const renderTotal = ()=>{
  let totalCalories = 0
  plate.forEach(item =>{
    totalCalories += item.calories*1
  })
  total.innerHTML=`Total: ${totalCalories.toLocaleString()}`
}

//=============== FUNCTION TO ADD OBJECT TO LOCAL STORAGE ===============
const addToStorage = (arr)=>{
  let objFood = {
    'name': `${arr.food_name}`,
    'photo': `${arr.photo.highres}`,
    'calories':`${arr.nf_calories}`,
    'keys':[],
    'values':[]
  }
  let keys = Object.entries(arr).map(([key,value])=>{
    if (key.startsWith('nf')) {
      objFood.keys.push(key.slice(3).toLocaleUpperCase());
      objFood.values.push(value);
    }
          
})
  plate.push(objFood)
  updatePlate()
  renderTotal()
}
 


//=============== FUNCTION TO UPDATE PLATE TO LOCAL STORAGE ===============
const updatePlate = () =>{
  renderBasket()
  localStorage.setItem("PLATE", JSON.stringify(plate));
}
 
//=============== FUNCTION TO RENDER ITEMS IN THE PLATE ===============
const renderBasket = ()=>{
  canasta.innerHTML = ""
  plate.forEach((item)=>{
     canasta.innerHTML +=`
      
      <div class="row text-center align-items-center" style="border: 0.5px solid">
          <div class="col-xl-3">
            <img src="${item.photo}"  style=" width: 50px; height: 50px;">
          </div>
          <div class="col-xl-3">
            <h5>${item.name.toUpperCase()}</h5> 
          </div>
          <div class="col-xl-3">
            <h5>${item.calories}cal</h5> 
          </div>
          <div class="col-xl-3">
            <a href="#"  data-bs-target="#info" data-bs-toggle="modal" > <i class="bi bi-info-circle-fill"></i></a
            <br/>
            <a href="#"> <i class="bi bi-x-lg"></i></a
            

          </div>
          
      </div>`

  })
}


// charts.forEach(function (chart) {
//   var ctx = chart.getContext("2d");
//   var myChart = new Chart(ctx, {
//     type: "bar",
//     data: {
//       labels: labels,
//       datasets: [
//         {
//           label: "Informacion Nutricional",
//           data: keyValues,
//           backgroundColor: [
//             "rgba(255, 99, 132, 0.2)",
//             "rgba(54, 162, 235, 0.2)",
//             "rgba(255, 206, 86, 0.2)",
//             "rgba(75, 192, 192, 0.2)",
//             "rgba(153, 102, 255, 0.2)",
//             "rgba(255, 159, 64, 0.2)",
//           ],
//           borderColor: [
//             "rgba(255, 99, 132, 1)",
//             "rgba(54, 162, 235, 1)",
//             "rgba(255, 206, 86, 1)",
//             "rgba(75, 192, 192, 1)",
//             "rgba(153, 102, 255, 1)",
//             "rgba(255, 159, 64, 1)",
//           ],
//           borderWidth: 1,
//         },
//       ],
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true,
//         },
//       },
//     },
//   });
// });