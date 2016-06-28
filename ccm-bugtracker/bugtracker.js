ccm.component( {
    name: 'bugtracker',
    config: {
        html:  [ ccm.store, { local: 'template.json' }],
        style: [ ccm.load, 'style.css' ]
    },
    Instance: function () {
        var i = 1;
        this.render = function(callback){
            var self = this;
            var element = ccm.helper.element(this);
            
            var story = ccm.helper.find( self, '.story' );
            element.html( ccm.helper.html( this.html.get( 'main' ) ) );

            var main = ccm.helper.find( this, '.main' );
            main.append( ccm.helper.html( this.html.get( 'ueberschrift' ) ) );


            var ueberschrift = ccm.helper.find( this, '.ueberschrift' );
            ueberschrift.append( ccm.helper.html( "Bug Tracker" ) ) ;

            main.append( ccm.helper.html( this.html.get( 'input' ), { onsubmit: function () {
                main.append( ccm.helper.html( self.html.get( 'bug' ),{
                    nummer: 'Bug #'+i,
                    name : 'Name: '+ccm.helper.find( self, '.bug_name' ).val(),
                    titel : 'Titel: '+ccm.helper.find( self, '.bug_titel' ).val(),
                    beschreibung : 'Beschreibung: '+ccm.helper.find( self, '.bug_beschreibung' ).val()

                } ) );
                main.append("<br>");
                i++;
                // prevent page reload
                return false;
            } } ) );

            if(callback) callback();
        }
    }
});