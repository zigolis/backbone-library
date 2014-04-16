var app = app || {};

app.LibraryView = Backbone.View.extend({
    el: '#books',

    events: {
        'click #add' : 'addBook'
    },

    initialize: function(){
        this.collection = new app.Library();
        this.collection.fetch({ reset: true });
        this.render();

        this.listenTo( this.collection, 'add', this.renderBook );
        this.listenTo( this.collection, 'reset', this.render );
    },

    addBook: function( e ){
        e.preventDefault();

        var formData = {};

        $('#addBook div').children('input').each(function( i, el ) {
            if ( $(el).val() != '' ) {
                formData[ el.id ] = $(el).val();
            }
        });

        this.collection.create( formData );
    },

    // Pega cada item da colecao e aplica renderBook
    render: function() {
        this.collection.each(function( item ) {
            this.renderBook( item );
        }, this);
    },

    // Renderiza o elemento e adiciona na View
    renderBook: function( item ){
        var bookView = new app.BookView({
            model: item
        });

        this.$el.append( bookView.render().el );
    }
});
