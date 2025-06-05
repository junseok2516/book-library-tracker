import bodyParser from "body-parser";
import express from "express";
import axios from "axios";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static("public"));

const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'testLibrary',
    password: 'password',
    port: 5432
});
db.connect();

let books = [];
const BOOK_URL = "https://openlibrary.org/search.json?title="

async function loadAllBooks() {
    const result = await db.query("SELECT * FROM library;");
    books = result.rows; 
    console.log("All Books:", books);
}

app.get("/", async(req,res) => {
    await loadAllBooks();
    res.render("index.ejs", { books: books});
});

app.post("/add", async(req,res) => {
    const response = await axios.get(BOOK_URL + req.body.addBook);
    // console.log(response.data.docs[0]);
    const result = response.data.docs[0]; // always fetching the first book among the results
    const search_title = result.title;
    const search_authors = result.author_name.join(', '); // can have more than one author for the book; separated with semicolon
    // console.log(search_authors);
    try {
        await db.query("INSERT INTO library (title,author) VALUES ($1, $2);", [search_title, search_authors]);
    } catch(err) {
        console.log(err);
    }
    res.redirect("/");
});

app.post("/delete", async(req,res) => {
    const del_ID = req.body.bookID;
    // console.log(del_ID);
    try {
        await db.query("DELETE FROM library WHERE id = $1;", [del_ID]);
        res.redirect("/");
    } catch(err) {
        console.log(err);
    }
})

app.listen(port, () => {
    console.log(`Server is up and running on ${port}`);
});