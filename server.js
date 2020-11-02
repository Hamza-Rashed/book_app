
'use strict';

const
  express = require('express'),
  app = express(),
  PORT = process.env.PORT || 3000,
  superagent = require('superagent');

// --------------------------
app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
// ----------------------------

app.get('/',welcome)
app.post('/searches',search)
app.get('/search/new',renderForm)

// ---------------------------
function welcome(req,res){
  res.render('pages/index');
}

function search(req,res){
    console.log('here');
  var bookSearch = req.body.bookSearch;
  var searchType = req.body.searchType;
  console.log(bookSearch);
  console.log(searchType);

  let urlBooks;
  if (searchType == 'title'){
    urlBooks = `https://www.googleapis.com/books/v1/volumes?q=${bookSearch}+intitle`;
  }else{
    urlBooks = `https://www.googleapis.com/books/v1/volumes?q=${bookSearch}+inauthor`;
  }

  superagent.get(urlBooks).then(data =>{
    let result = data.body.items.map(element =>{
      console.log(element.volumeInfo)
      return new Book(element)
    });
    res.render('pages/searches/show',{booksResult: result });

  });
}

function renderForm(req,res){
  res.render('pages/searches/new.ejs')
}

function Book(data) {
  this.bookName = data.volumeInfo.title;
  this.bookAuthor = findData(data.volumeInfo.authors , 'cant find author');
  this.bookDesc = findData(data.volumeInfo.subtitle , 'cant find any description');
  this.bookImage = findData(data.volumeInfo.imageLinks.smallThumbnail , 'https://i.imgur.com/J5LVHEL.jpg')
}

// helper functions

function findData(data , massege) {
  if(data){
    return data;
  }else{
    return massege
  }
}

app.use('*',(req,res)=>{
  res.render('pages/error.ejs')
});
app.listen(PORT,() =>{
  console.log(`listening to port : ${PORT}`);
});
