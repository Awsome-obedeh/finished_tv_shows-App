const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const appRoutes = require('./routes/app.routes');

// define middlewares
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(cookieParser());

async function main () {
    try {
        console.log("Connectig to db")
        await mongoose.connect("mongodb+srv://adminUser:mcrA2YudwKcxo59H@todo-db.az8gh.mongodb.net/myFirstDatabase");

        // use our routes file so that request to localhost:3000/ will go to the appRoutes file
        app.use("/", appRoutes);
        
    } catch (error) {
        console.log(error);
    }
}


main()

app.listen(3000, () => {
    console.log(`App is live at http://localhost:3000`)
})