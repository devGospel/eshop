const mongoose = require('mongoose')

const connectDB = async () =>{
    mongoose.connect('mongodb://127.0.0.1:27017/E-SHOP_API_DB', 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
.then(()=>{
console.log('Database Connection is ready...')
})
.catch((err)=> {
console.log(err);
})

} 

module.exports = connectDB