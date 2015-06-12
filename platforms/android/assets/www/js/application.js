var Application = {
    initApplication: function () {
        $(document)
            .on('pageinit', '#add-feed-page', function () {
                Application.initAddFeedPage();
            })
            .on('pageinit', '#list-feeds-page', function () {
                Application.initListFeedPage();
            })
            .on('pageinit', '#show-feed-page', function () {
                var url = this.getAttribute('data-url').replace(/(.*?)url=/g, '');
                Application.initShowFeedPage(url);
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

$('li p').click(function() {
  var Feednaam = $(this).data("titel");
    var Feedlink = $(this).data("link");
    var image = $(this).data("image");
    FeedToevoegen(Feednaam, Feedlink, image);
});
        Application.openLinksInApp();
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
                    shake.startWatch(onShake, 20 /*, onError */);

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