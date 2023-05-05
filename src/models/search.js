import axios from 'axios'

export default class Search {
   constructor(query) {
      this.query = query
   }
   async getResults() {
      //   const key = 'se'
      try {
         const res = await axios(
            `http://192.168.1.2:3000/api/v1/search?key=${this.query}`
         )
         this.result = res.data
         console.log(data)
      } catch (error) {
         alert(error)
      }
   }
}
