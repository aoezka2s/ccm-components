ccm.component( {
    name: 'commentsystem',
    config: {
        html:  [ ccm.store, { local: 'template.json' }],
        key: 'commentsystem',
        store: [ ccm.store, { url: 'ws://ccm2.inf.h-brs.de/index.js', store: 'aoezka2s_comment'} ],
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
                    self.store.set({key: self.key, comments: []}, proceed);
                else
                    proceed(dataset);

                function proceed(dataset) {

                    var main = ccm.helper.find(self, '.main');

                    main.append(ccm.helper.html(self.html.get('input'), { onsubmit: function () {

                            var iTitel = 'Titel: '+ccm.helper.find( self, '.comment_titel' ).val();
                            var iText = 'Text: '+ccm.helper.find( self, '.comment_text' ).val();

                            if (iTitel === '') return;
                            if (iText === '') return;

                            self.user.login( function () {

                                dataset.comments.push({
                                    titel: iTitel,
                                    date: 'Datum: '+ new Date(),
                                    text: iText,
                                    user: 'User: '+ self.user.data().key
                                });

                                self.store.set(dataset, function () {
                                    self.render();
                                });
                            });
                        return false;
                        }
                    }));

                   for (var i = 0; i < dataset.comments.length; i++) {

                        var comment = dataset.comments[i];

                        main.append(ccm.helper.html(self.html.get('comment'), {
                            titel : ccm.helper.val(comment.titel),
                            date: ccm.helper.val(comment.date),
                            text : ccm.helper.val(comment.text),
                            user : ccm.helper.val(comment.user)
                        }));
                        main.append("<br>");
                    }

                    if (callback) callback();
                }
            })
        }
    }

});