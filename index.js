import express from 'express';
import bodyParser from 'body-parser';
import pg from "pg";


const app = express();
const port = 3000;

let myitems = [
    { id: 1, title: "Gym" },
    { id: 2, title: "Visit noida" }
]

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "mylist",
    password: "shailender@123",
    port: 5432,

});
db.connect();



app.get('/', async (req, res) => {

    try {
        const result = await db.query("SELECT * FROM myitems ORDER BY id ASC");
        myitems = result.rows
        console.log(myitems);
        res.render("index.ejs", {
            listTitle: "CREATE YOUR LIST",
            listItems: myitems


        });

    } catch (err) {
        console.log(err);
    }






});

app.post('/add',async(req,res)=>{
    const item=req.body.newItem;
    try {
        await db.query("INSERT INTO myitems(title)VALUES($1)",[item]);
        res.redirect('/')
        
    } catch (error) {
        console.log(err);
        
    }
});

app.post("/edit",async(req,res)=>{
    const item=req.body.updateItemTitle;
    const id=req.body.updateItemId;
    try {
        await db.query("UPDATE myitems SET title=($1) WHERE id=$2",[item,id]);
        res.redirect('/');
        
    } catch (err) {
        console.log(err)
        
    }
    
});

app.post('/delete',async(req,res)=>{
    const id=req.body.deletedItemId
    await db.query("DELETE FROM myitems WHERE id=$1",[id]);
})


app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
});