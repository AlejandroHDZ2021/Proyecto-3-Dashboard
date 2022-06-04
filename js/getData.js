getData = async()=>{
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

  module.exports = getData