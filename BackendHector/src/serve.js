const app = require('./app.js');
const sequelize = require('./util/connect.js');

const PORT = 3000;

const main = async() => {
 try{
   await sequelize.sync()
    console.log(`Conectado la base de datos`);
    app.listen(PORT, ()=>{
    console.log(`Corriendo en el servidor en el puerto ${PORT}`);
});
 }catch(error){
    console.log(error);
 }
}

main();