const mongoose=require('mongoose')
const Schema = mongoose.Schema

//mongo crea un id automatico
const UserSchema=new Schema({
    name:String,
    lastname:String,
    email:String,
    password:String, 
    role:String      
})

//creamos el modelo de usuario
const User=mongoose.model('User',UserSchema)
module.exports=User