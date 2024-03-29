const form1 = document.querySelector('#form1')
const bButton = document.querySelector("#basket")
const eraser = document.querySelector('#eraser')
const container = document.querySelector('#container')
const boton = document.querySelector('#boton')
const information = document.querySelector('#information')
const chart = document.querySelector(".chart")
const canasta = document.querySelector('#canasta')
const total = document.querySelector('#totalCalories')
const botones =document.querySelectorAll('button')
const basket = document.querySelector('#basket')
let plate = JSON.parse(localStorage.getItem("PLATE")) || [];
let foodSearch = form1.value;
let foodData;
let nutrients;
let myChart;
import eraseAll from "./eraseAll.js"

//=============== EVENT LISTENERS ===============
form1.addEventListener("input",()=>getData())
boton.addEventListener("click",()=>getData())
container.addEventListener("click",(e)=>bringNutrients(e.target.id))
eraser.addEventListener("click",()=>eraseAll())
bButton.addEventListener("click",()=>renderBasket())
bButton.addEventListener("click",()=>renderTotal())
canasta.addEventListener('click',(e)=>deleteItem(e.target.id))
canasta.addEventListener('click',(e)=>setChart(e.target.id))


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
    container.innerHTML=`
         Sorry nothing was found please try another food item`
      console.log('no item found')
  }
  
 
}
  

//=============== FUNCTION TO RENDER CARD WITH FOOD ITEM INFORMATION ===============
const render = (array)=>{
    container.innerHTML='' 
    array.forEach(food => {
        container.innerHTML +=`
        
        <div class="row  text-center align-items-center justify-content-center" style="border: 0.5px solid; margin: 0px; ">
                        <div class="col-xl-4">
                        <img src="${food.photo.thumb}"  style=" width: 40px; height: 40px;">
                        </div>
                        <div class="col-xl-4" >
                          <h5>${food.food_name}</h5> 
                        </div>
                        <div class="col-xl-4">
                        <a href="#" id="${food.food_name}" class="btn  btn-success btn-sm" data-bs-target="#staticBackdrop" data-bs-toggle="modal">Agregar</a
                        </div>
                </div>`
    });
    
}


//=============== FUNCTION TO BRING NUTRITION DETAILS FROM API ===============

const bringNutrients = async(name)=>{
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
                    query:`${name}`
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

//=============== FUNCTION TO ADD TOTAL CALORIES AND RENDER TOTAL ===============
const renderTotal = ()=>{
  total.innerHTML=''
  let totalCalories = 0
  plate.forEach(item =>{
    totalCalories += item.calories*1
  })
  total.innerHTML=`Total Cal: ${totalCalories.toLocaleString()}`
  
}

//=============== FUNCTION TO ADD FOOD ITEM AS OBJECT TO LOCAL STORAGE ===============
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
  renderTotal()
  localStorage.setItem("PLATE", JSON.stringify(plate));
}
 
//=============== FUNCTION TO RENDER ITEMS IN THE PLATE ===============
const renderBasket = ()=>{
  canasta.innerHTML = ""
  plate.forEach((item)=>{
     canasta.innerHTML +=`
      
      <div id="basket" class="row text-center align-items-center" style="border: 0.5px solid">
          <div class="col-xl-3">
          <a href="#"  data-bs-target="#info" data-bs-toggle="modal" > <i id="${item.name}" class="bi bi-info-circle-fill"></i></a
            <br/>
            <img src="${item.photo}"  style=" width: 50px; height: 50px;">
          </div>
          <div class="col-xl-3">
            <h5>${item.name.toUpperCase()}</h5> 
          </div>
          <div class="col-xl-3">
            <h5>${item.calories}cal</h5> 
          </div>
          <div class="col-xl-3">
            
            <a href="#"><i id="${item.name+'a'}" class="bi bi-x-lg"></i></a
          </div>
          
      </div>`

  })
}

//=============== FUNCTION TO GIVE CHART DATA TO GRAPH ===============
const setChart = (info) => {
  plate.forEach(item =>{
    if (info === item.name) {
      var ctx = chart.getContext("2d");
      if(myChart){
        myChart.destroy();
      }

      const dataConfig = {
        labels:item.keys,
        datasets: [{
          label: item.name,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data:item.values,
        }]
      };

      const config = {
        type: 'bar',
        data: dataConfig,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      };
  myChart = new Chart(ctx,
  config);
    }
  })
 
  
}
  
//=============== FUNCTION TO DELETE ITEM FROM BASKET ===============
const deleteItem = (name)=>{
plate.forEach((item,index) => {
  if (item.name+'a' == name) {
    plate.splice(index,1)
  }
})
  updatePlate()
}

//=============== FUNCTION TO DELETE ALL ITEMS FROM BASKET ===============
// const eraseAll =() =>{
//   localStorage.clear();
//   plate = [];
// }