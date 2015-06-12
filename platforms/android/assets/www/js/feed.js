function Feed(name, url) {
    var _db = window.localStorage;
    var _tableName = 'feeds';

    this.name = name;
    this.url = url;

    this.save = function (feeds) {
        _db.setItem(_tableName, JSON.stringify(feeds));
    };

    this.load = function () {
        return JSON.parse(_db.getItem(_tableName));
    };
}

Feed.prototype.add = function () {
    var index = Feed.getIndex(this);
    var feeds = Feed.getFeeds();

    if (index === false) {
        feeds.push(this);
    } else {
        feeds[index] = this;
    }

    this.save(feeds);
};

Feed.prototype.delete = function () {
    var index = Feed.getIndex(this);
    var feeds = Feed.getFeeds();

    if (index !== false) {
        feeds.splice(index, 1);
        this.save(feeds);
    }

    return feeds;
};

function timeSince(date) {
    var datex = new Date(date);
    var seconds = Math.floor((new Date() - datex) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 0) {
        return interval + " jaar geleden";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 0) {
        return interval + " maanden geleden";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 0) {
        return interval + " dagen geleden";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 0) {
        return interval + " uur geleden";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 0) {
        return interval + " minuten geleden";
    }
    return Math.floor(seconds) + " seconde geleden";
}
Feed.prototype.compareTo = function (other) {
    return Feed.compare(this, other);
};

Feed.compare = function (feed, other) {
    if (other == null) {
        return 1;
    }
    if (feed == null) {
        return -1;
    }
    var test = feed.name.localeCompare(other.name);
    return (test === 0) ? feed.url.localeCompare(other.url) : test;
};

Feed.getFeeds = function () {
    var feeds = new Feed().load();
    return (feeds === null) ? [] : feeds;
};

Feed.getFeed = function (feed) {
    var index = Feed.getIndex(feed);
    if (index === false) {
        return null;
    }
    var feed = Feed.getFeeds()[index];
    return new Feed(feed.name, feed.url);
};

Feed.getIndex = function (feed) {
    var feeds = Feed.getFeeds();
    for (var i = 0; i < feeds.length; i++) {
        if (feed.compareTo(feeds[i]) === 0) {
            return i;
        }
    }

    return false;
};

Feed.deleteFeeds = function () {
    new Feed().save([]);
};

Feed.searchByName = function (name) {
    var feeds = Feed.getFeeds();
    for (var i = 0; i < feeds.length; i++) {
        if (feeds[i].name === name) {
            return new Feed(feeds[i].name, feeds[i].url);
        }
    }

    return false;
};

Feed.searchByUrl = function (url) {
    var feeds = Feed.getFeeds();
    for (var i = 0; i < feeds.length; i++) {
        if (feeds[i].url === url) {
            return new Feed(feeds[i].name, feeds[i].url);
        }
    }

    return false;
};

var onShake = function () {
    navigator.notification.alert(checkConnection(), function () {
    }, 'Shake it');

};

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';

    return (states[networkState]);
}
//function FeedToevoegen(Feednaam, Feedlink, Feedimage) {
//    var feedsObj = {Feednaam: Feednaam, Feedlink: Feedlink, Feedimage: Feedimage};
//    var feedarray = [];
//    if (localStorage.getItem('feeds') === null) {
//        feedarray[feedsObj.Feednaam] = feedsObj;
//        localStorage.setItem('feeds', JSON.stringify(array));
//    }
//    else {
//        var local = JSON.parse(localStorage.getItem('feeds'));
//        console.log(JSON.stringify(local));
//      // if (local.indexOf(feedsObj) < 0) {
//        if (!(feedsObj.Feednaam in local)) {
//           console.log("test");
//            feedarray[feedsObj.Feednaam] = feedsObj;
//
//           //local.push(feedsObj);
//
//           localStorage.setItem('feeds', JSON.stringify((local)));
//         //   var testConsole = JSON.parse(localStorage.getItem('feeds'));
//         //   console.log(JSON.stringify(testConsole));
//        //    return
//        }
//        //var testConsole = JSON.parse(localStorage.getItem('feeds'));
//        //console.log(JSON.stringify(testConsole));
//
//    }
//
//}
function FeedToevoegen(Feednaam, Feedlink, Feedimage) {
    var feedObj = {Feednaam: Feednaam, Feedlink: Feedlink, Feedimage: Feedimage},
        feedarray = [],
        inside = false;

    if (localStorage.getItem('feeds') === null) {
        localStorage.setItem('feeds', JSON.stringify(feedarray));
    }

        feedarray = JSON.parse(localStorage.getItem('feeds'));

    for(var i in feedarray) {
        if(feedarray[i].Feednaam == feedObj.Feednaam) {
            feedarray[i] = feedObj;
            inside = true;
        }
    }

    if(!inside) {
        feedarray.push(feedObj);
    }

    localStorage.setItem('feeds', JSON.stringify(feedarray));

    console.log(JSON.stringify(JSON.parse(localStorage.getItem('feeds'))));

}
//function storeFeed(Feednaam, Feedlink) {
//
//    var limit = 25;
//
//
//}
