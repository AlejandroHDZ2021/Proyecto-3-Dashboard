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
        <div class="card" style="width: 18rem;">
            <img src="${food.photo.thumb}" class="card-img-top" alt="">
            <div class="card-body">
              <h5 class="card-title text-center">${food.food_name.toUpperCase()}</h5>
              <p class="card-text text-center">Serving Size:  grams</p>
              <a href="#"  class="btn  btn-danger" id="${food.food_name}"  onclick="bringNutrients(this)">Ver Detalles</a>
            </div>
        </div>
        `
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
           realData = data.foods[0]
           renderChart()
       } catch (error) {
           container.innerHTML=`
           Sorry nothing was found please try another food item`
           console.log('oops, no information was found on this item')
       }
       setGraph(realData)
}
   
const setGraph = (realData) => {
    let labels = realData.filter(function(name){
        if(name.startsWith('nf')){
            return name
        }
    })
    console.log(labels)
}
//=============== FUNCTION TO SHOW BAR CHART WITH ALL THE NUTRITION DETAILS ===============
