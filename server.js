// Dependencias
var application_root = __dirname,
    express          = require( 'express' ),
    path             = require( 'path' ),
    mongoose         = require( 'mongoose' );

// Cria o servidor
var app = express();

// Configuracao do servidor
app.configure(function() {
    // Faz o parse do corpo do request e popula o request.body
    app.use( express.bodyParser() );

    // Checa a request.body para o metodo HTTP sobrescrever
    app.use( express.methodOverride() );

    // Realiza rotas de pesquisa nas URLS e métodos HTTP
    app.use( app.router );

    // Serve conteudo estatico
    app.use( express.static( path.join( application_root, 'site' ) ) );

    // Mostra os erros em dev
    app.use( express.errorHandler({ dumpExceptions: true, showStack: true }) );

    // Inicia o servidor
    var port = 4711;

    app.listen(port, function() {
        console.log(
            'Express server listening on port %d in %s mode',
            port,
            app.settings.env
        );
    });

    // Connect to database
    mongoose.connect( 'mongodb://localhost/library_database' );

    // Schemas
    var Keywords = mongoose.Schema({
        keyword: String
    });

    // Schemas
    var Book = new mongoose.Schema({
        title:       String,
        author:      String,
        releaseDate: Date,
        keywords:     [ Keywords ]
    });

    // Models
    var BookModel = mongoose.model( 'Book', Book );

    // Routes
    app.get( '/api', function( request, response ) {
        response.send( 'Library API is running' );
    });

    // Pega a lista de todos os livros
    app.get( '/api/books', function( request, response ) {
        return BookModel.find(function( err, books ) {
            if ( !err ) {
                return response.send( books );
            } else {
                return console.log( err );
            }
        });
    });

    // Insere um novo livro
    app.post( '/api/books', function( request, response ) {
        var book = new BookModel({
            title:       request.body.title,
            author:      request.body.author,
            releaseDate: request.body.releaseDate,
            keywords:    request.body.keywords
        });

        book.save( function( err ) {
            if ( !err ) {
                return console.log( 'created' );
            } else {
                return console.log( err );
            }
        });

        return response.send( book );
    });

    // Pega um livro por id
    app.get( '/api/books/:id', function( request, response ) {
        return  BookModel.findById( request.params.id, function( err, book ) {
            if ( !err ) {
                return response.send( book );
            } else {
                return console.log( err );
            }
        });
    });

    // Atualiza um livro
    app.put( '/api/books/:id', function( request, response ) {
        console.log( 'Updating book' + request.body.title );

        return BookModel.findById( request.params.id, function( err, book ) {
            book.title       = request.body.title;
            book.author      = request.body.author;
            book.releaseDate = request.body.releaseDate;
            book.keywords    = request.body.keywords;

            return book.save(function( err ) {
                if ( !err ) {
                    console.log( 'book updated' );
                } else {
                    console.log( err );
                }

                return response.send( book );
            });
        });
    });

    // Deleta um livro
    app.delete( '/api/books/:id', function( request, response ) {
        console.log( 'Deleting book with id: ' + request.params.id );

        return BookModel.findById( request.params.id, function( err, book ) {
            return book.remove(function( err ){
                if ( !err ) {
                    console.log( 'Book removed' );

                    return response.send( '' );
                } else {
                    console.log( err );
                }
            });
        });
    });
});
