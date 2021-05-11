const moongoose=require("mongoose");
const config =require('./config.json');
const db=config.mongooURI


const connectDB = async () => {
    try{
        await moongoose.connect(db,{
            useNewUrlParser:true,
            useCreateIndex:true,
            useUnifiedTopology: true 
        });

        console.log('mongooDB connected')

    }
    catch(err){
        console.log(err)
        process.exit(1)

    }
}

module.exports=connectDB;