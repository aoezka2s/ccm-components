ccm.component( {
    name: 'bugtracker',
    config: {
        html:  [ ccm.store, { local: 'template.json' }],
        key: 'bugTracker',
        store: [ ccm.store, { url: 'ws://ccm2.inf.h-brs.de/index.js', store: 'aoezka2s_bugtracker' } ],
        style: [ ccm.load, 'style.css' ],
        user:  [ ccm.instance, 'http://kaul.inf.h-brs.de/ccm/components/user2.js' ]
    },
    Instance: function () {
        var self = this;
        this.init = function ( callback ) {
            self.store.onChange = function () {
                self.render();
            };

            callback();

        };

        self.render = function (callback) {

            var element = ccm.helper.element(self);

            element.html(ccm.helper.html(self.html.get('main')));

            self.store.get(self.key, function (dataset) {

                if (dataset === null)
                    self.store.set({key: self.key, bugs: []}, proceed);
                else
                    proceed(dataset);

                function proceed(dataset) {

                    var main = ccm.helper.find(self, '.main');

                    main.append( ccm.helper.html( self.html.get( 'ueberschrift' ) ) );

                    var ueberschrift = ccm.helper.find( self, '.ueberschrift' );
                    ueberschrift.append( ccm.helper.html( "Bug Tracker" ) ) ;

                    main.append(ccm.helper.html(self.html.get('input'), { onsubmit: function () {

                            var iTitel = 'Titel: '+ccm.helper.find( self, '.bug_titel' ).val();
                            var iBeschreibung = 'Beschreibung: '+ccm.helper.find( self, '.bug_beschreibung' ).val();

                            if (iTitel === '') return;

                            self.user.login( function () {

                                dataset.bugs.push({
                                    titel: iTitel,
                                    beschreibung: iBeschreibung,
                                    user: self.user.data().key
                                });

                                self.store.set(dataset, function () {
                                    self.render();
                                });
                            });
                            main.append("<br>");
                            return false;
                        }
                    }));

                   for (var i = 0; i < dataset.bugs.length; i++) {

                        var bug = dataset.bugs[i];

                        main.append(ccm.helper.html(self.html.get('bug'), {
                            titel : ccm.helper.val(bug.titel),
                            beschreibung : ccm.helper.val(bug.beschreibung),
                            user : ccm.helper.val(bug.user)
                        }));
                        main.append("<br>");
                    }

                    if (callback) callback();
                }
            })
        }
    }

});