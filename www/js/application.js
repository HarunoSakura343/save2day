var Application = {
    initApplication: function () {
        $(document)
            .on('pageinit', '#add-feed-page', function () {
                Application.initAddFeedPage();
            })
            .on('pageinit', '#slide-one-page', function () {
                Application.initSlideOnePage();
            })
            .on('pageinit', '#slide-two-page', function () {
                Application.initSlideTwoPage();
            })
            .on('pageinit', '#slide-three-page', function () {
                Application.initSlideThreePage();
            })
            .on('pageinit', '#list-feeds-page', function () {
                Application.initListFeedPage();
            })
            .on('pageinit', '#show-feed-page', function () {
                var url = this.getAttribute('data-url').replace(/(.*?)url=/g, '');
                Application.initShowFeedPage(url);
            })
            .on('pageinit', '#feed-overview-page', function () {
                Application.initFeedOverviewPage();
            })
            .on('pageinit', '#show-rss-page', function () {
                //   var link = this.getAttribute('data-url').replace(/(.*?)link=/g, '');
                Application.initShowRSSPage();
            })

            .on('pageinit', '#aurelio-page', function () {
                Application.initAurelioPage();
            })
            .on('backbutton', function () {
                $.mobile.changePage('index.html');
            })
            .on('pageinit', '#test-show', function () {
                var url = this.getAttribute('data-url').replace(/(.*?)url=/g, '');
                Application.initTestShow(url);
            });

        if (!localStorage.getItem('did_intro')) {
            $.mobile.changePage('slide-one.html');
            localStorage.setItem('did_intro', true);
        }
        $('li p').click(function () {
            var Feednaam = $(this).data("titel");
            var Feedlink = $(this).data("link");
            var image = $(this).data("image");
            //    console.log(checkConnection());
            shake.startWatch(onShake, 30);
            if (checkConnection() != 'WiFi connection') {
                navigator.notification.alert('enable WiFi in order to be able to get the RSS Feed' + checkConnection(), function () {
                }, 'Error');
            }
            else {

                FeedToevoegen(Feednaam, Feedlink, image);
                storeFeed(Feedlink, Feednaam);
                localStorage.setItem('feedopen', Feedlink);
                var showfeed = retrieveFeed(Feedlink);

                //    console.log(JSON.stringify(showfeed));

            }


            if (showfeed === null) {
                navigator.notification.alert('No RSS Feed Saved because there has not been a connection since it was pressed' + checkConnection(), function () {
                }, 'Error');
            } else {
                $.mobile.changePage('show-rss.html');
            }


        });
        Application.openLinksInApp();
    },
    initFeedOverviewPage: function () {

        var check = retrieveFollowing();
        if (check == 'no feeds saved yet') {
            var container = $('.feed-overview-container');
            container.append('<p>').text('no feeds saved yet');
        } else {
            //  var container = $('.show-rss-container');
            console.log(JSON.stringify(check));
            var container = $('.feed-overview-container');
            for (var i = 0; i < check.length; i++) {

                var toAppend = $('<div class="rssfeedrow">');
                toAppend
                    .append($('<img class="source-icon" src="' + check[i].Feedimage + '" />'))

                    // <p data-link="http://www.nu.nl/rss/games" data-titel="Nu - Games" data-image="img/feed-icons/nu.png">Nu - Games</p>
                    .append($('<p class="text" data-link="' + check[i].Feedlink + '" data-titel="' + check[i].Feednaam + '" data-image"' + check[i].Feedimage + '">').text(check[i].Feednaam))
                    .append($('<div class="clear"/>'))
                    .append($('<hr class="line">'))
                    .append($('<div class="clear"/>'));
                // Add description
                //  .append($('<p class="author">').text('author: ' + items[i].author))
                //  .append($('<p class="time">').text(timeSince(items[i].publishedDate)))
                //.append($('<hr class="line">'));
                container.append(toAppend);


            }
        }

        $('.rssfeedrow p').click(function () {


            var Feedlink = $(this).data("link");
            localStorage.setItem('feedopen', Feedlink);
            $.mobile.changePage('show-rss.html');
        });


    },
    initShowRSSPage: function () {

        var Feedlink = localStorage.getItem('feedopen');
        var showfeed = retrieveFeed(Feedlink);
        //    console.log(JSON.stringify(showfeed));
        var entriesToShow = 0;
        var items = showfeed.responseData.feed.entries;
        $('.show-rss-container').empty();
        var container = $('.show-rss-container');

        shake.startWatch(onShake, 30);
        for (var i = entriesToShow; i < items.length; i++) {

            var toAppend = $('<div class="rssfeedrow">');
            toAppend
                .append($('<h2 class="titleh2">').text(items[i].title))
                .append($('<p class="text">').html(items[i].content)) // Add description
                .append($('<p class="author">').text('author: ' + items[i].author))
                .append($('<p class="time">').text(timeSince(items[i].publishedDate)))
                .append($('<hr class="line">'));
            container.append(toAppend);

            //    console.log(JSON.stringify(itemskey[keyi].title));
            //      $('.show-rss-container').append('<div class="rssfeedrow"></div>');
            //$('.rssfeedrow').append('<h2 class="titleh2">'+(keyi)+'</h2>');
            //$('.rssfeedrow').append('<h2 class="titleh2">'+(itemskey[keyi].title)+'</h2>');
            //$('.rssfeedrow').append('<p class="text">'+(itemskey[keyi].content)+'</p>');
            //$('.rssfeedrow').append('<p class="author">'+ "auteur"+ (itemskey[keyi].author)+'</p>');
            //$('.rssfeedrow').append('<p class="time">'+ timeSince(itemskey[keyi].publishedDate)+'</p>');
            //$('.rssfeedrow').append('<hr class="line">');
            //appendToThis
            //    .append($('<h2 class="titleh2">').text(items[i].title))
            //    .append($('<p class="text">').html(items[i].content)) // Add description
            //    .append($('<p class="author">').text('auteur: ' + items[i].author))
            //    .append($('<p class="time">').text(timeSince(items[i].publishedDate)))
            //    .append($('<hr class="line">'));
        }


    },
    initSlideOnePage: function () {

    },
    initSlideTwoPage: function () {

    },
    initSlideThreePage: function () {

    },
    initAddFeedPage: function () {
        $('#add-feed-form').submit(function (event) {
            event.preventDefault();
            var feedName = $('#feed-name').val().trim();
            var feedUrl = $('#feed-url').val().trim();
            if (feedName === '') {
                navigator.notification.alert('Name field is required and cannot be empty', function () {
                }, 'Error');
                return false;
            }
            if (feedUrl === '') {
                navigator.notification.alert('URL field is required and cannot be empty', function () {
                }, 'Error');
                return false;
            }

            if (Feed.searchByName(feedName) === false && Feed.searchByUrl(feedUrl) === false) {
                var feed = new Feed(feedName, feedUrl);
                feed.add();
                navigator.notification.alert('feed opgeslagen', function () {
                    $.mobile.changePage('index.html');
                }, 'Success');
            } else {
                navigator.notification.alert('feed niet opgeslagen omdat er al een feed bestaat met deze naam of link', function () {
                }, 'Error');
            }
            return false;
        });
    },
    initTestShow: function () {

    },

    initListFeedPage: function () {
        var $feedsList = $('#feeds-list');
        var items = Feed.getFeeds();
        var htmlItems = '';

        $feedsList.empty();
        items = items.sort(Feed.compare);
        for (var i = 0; i < items.length; i++) {
            htmlItems += '<li><a href="show-feed.html?url=' + items[i].url + '">' + items[i].name + '</a></li>';
        }
        $feedsList.append(htmlItems).listview('refresh');
    },

    localFeedPage: function () {
        var $feedsList = $('#feeds-list');
        var items = Feed.getFeeds();
        var htmlItems = '';

        $feedsList.empty();
        items = items.sort(Feed.compare);
        for (var i = 0; i < items.length; i++) {
            htmlItems += '<li><a href="show-feed.html?url=' + items[i].url + '">' + items[i].name + '</a></li>';
        }
        $feedsList.append(htmlItems).listview('refresh');
    },

    initShowFeedPage: function (url) {
        var step = 20;
        var loadFeed = function () {
            var currentEntries = $('#feed-entries').find('div[data-role=collapsible]').length;
            var entriesToShow = currentEntries + step;
            $.ajax({
                url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=' + entriesToShow + '&q=' + encodeURI(url),
                dataType: 'json',
                beforeSend: function () {
                    $.mobile.loading('show', {
                        text: 'Please wait while retrieving data...',
                        textVisible: true
                    });
                },
                success: function (data) {
                    var $list = $('#feed-entries');
                    if (data.responseData === null) {
                        navigator.notification.alert('ongeldige feed link', function () {
                        }, 'Error');
                        return;
                    }
                    var items = data.responseData.feed.entries;


                    var $post;
                    if (currentEntries === items.length) {
                        navigator.notification.alert('geen nieuwe artiklen', function () {
                        }, 'Info');
                        return;
                    }
                    for (var i = currentEntries; i < items.length; i++) {

                        for (var j in items[i]) {
                            console.debug(j);
                        }

                        var datumpre = new Date(items[i].publishedDate);
                        var Feednaam = 'nu.nl';
                        var Feedlink = 'www.nu.nl,';
                        var feedimage = "img.jpg";
                        FeedToevoegen(Feednaam, Feedlink, feedimage);

                        $post = $('<div data-role="collapsible" data-expanded-icon="arrow-d" data-collapsed-icon="arrow-r" data-iconpos="right">');
                        $post
                            .append($('<h2 class="titleh2">').text(items[i].title))

                            .append($('<p class="text">').html(items[i].content)) // Add description
                            .append($('<p class="author">').text('auteur: ' + items[i].author))

                            .append($('<p class="time">').text(timeSince(items[i].publishedDate)))
                            .append($('<hr class="line">'));


                        $list.append($post);

                    }
                    $list.collapsibleset('refresh');
                },
                error: function () {
                    navigator.notification.alert('niet gelukt om de feed op te halen, probeer later nog eens', function () {
                    }, 'foutmelding');
                },
                complete: function () {
                    $.mobile.loading('hide');
                }
            });
        };
        $('#show-more-entries').click(function () {
            loadFeed();
            $(this).removeClass('ui-btn-active');
        });
        $('#delete-feed').click(function () {
            Feed.searchByUrl(url).delete();
            navigator.notification.alert('Feed verwijderd', function () {
                $.mobile.changePage('list-feeds.html');
            }, 'Succes');
        });
        if (Application.checkRequirements() === true) {
            loadFeed();
        } else {
            navigator.notification.alert('momenteel alleen beschikbaar met internetverbinding', function () {
            }, 'foutmelding');
        }
    },


    initAurelioPage: function () {
        $('a[target=_blank]').click(function () {
            $(this).closest('li').removeClass('ui-btn-active');
        });
    },
    checkRequirements: function () {
        if (navigator.connection.type === Connection.NONE) {
            return false;
        }

        return true;
    },
    updateIcons: function () {
        var $buttons = $('a[data-icon], button[data-icon]');
        var isMobileWidth = ($(window).width() <= 480);
        isMobileWidth ? $buttons.attr('data-iconpos', 'notext') : $buttons.removeAttr('data-iconpos');
    },
    openLinksInApp: function () {
        $(document).on('click', 'a[target=_blank]', function (event) {
            event.preventDefault();
            window.open($(this).attr('href'), '_blank');
        });
    }
};