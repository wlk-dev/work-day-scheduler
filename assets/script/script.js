function getStoredEvents () {
    var currentDay = moment( JSON.parse(localStorage.getItem("current-date")) ) || moment();
    if ( currentDay.isSame( moment(), "day" ) ) {
        return JSON.parse( localStorage.getItem("stored-events") ) || {};
    } else {
        return {};
    }
}

function setDate () {
    const date = new Date();
    $("#currentDay").text( Intl.DateTimeFormat("en-US", {dateStyle: "full"} ).format(date) );
    localStorage.setItem("current-date", JSON.stringify( moment() ) )
}

function getMoments () {
    var now = moment().startOf('day')
    var endOf = moment().endOf("day")

    var moments = [];

    for (var hour = now.hour(); hour <= endOf.hour(); hour++) {
        moments.push( moment().startOf('day').add(hour, 'hours') )
    }
    return moments;
}

function styleRow ( rowElement, momentObj ) {
    var children = rowElement.children()
    var now = moment();

    if ( now.isSame( momentObj, "hour" ) ) {
        children.addClass("my-effects bg-warning text-white");
    } else if ( momentObj.isBefore( now, "hour" ) ) {
        children.addClass("my-effects bg-danger text-white opacity-70");
    } else {
        children.addClass("my-effects bg-primary text-white");
    }
}

function generateRow( rowData ) {
    var parentRow =  $(`<div class="row is-listener" id="${rowData.id}">`);

    var timeEntry = $('<div class="time-slot shadow-lg column col-2 col-xl-1">').text(rowData.timeKey);
    var eventInput = $('<input type="text" class="column col-8 col-xl-9">').val(rowData.event);
    var saveEventBtn = $('<button class="column col-2 col-xl-2 shadow-lg">').text("+");
    
    parentRow.append( [timeEntry, eventInput, saveEventBtn] )
    
    styleRow(parentRow, rowData.timeObj);
    
    return parentRow;
}

function initSchedule ( events, moments) {
    var eventsList = $("#events-list");
    if ( !jQuery.isEmptyObject( events ) ) {
        for ( const idx in moments ) {
            var key = moments[idx].format("ha");
            eventsList.append( generateRow( { timeObj:moments[idx] , timeKey:key, event:events[key], id:String(`${key}-time`) } ) )
        }
    } else {
        var newEvents = {};
        for ( const idx in moments ) {
            newEvents[ moments[idx].format("ha") ] = "";
        }
        localStorage.setItem("stored-events", JSON.stringify(newEvents));
    }
}

function storeEvent ( event, key ) {
    var events = getStoredEvents();
    events[key] = event;
    localStorage.setItem("stored-events", JSON.stringify(events));
}

function main () {
    setDate();
    initSchedule( getStoredEvents(), getMoments() );

    $(".is-listener").on("click", function (evt) {
        if ( evt.target.matches("button") ) {
            var elem = $(this).children()
            var eventValue = elem.eq(1).val();
            var timeKey = elem.eq(0).text()

            storeEvent( eventValue, timeKey );
        } else if ( evt.target.matches(".time-slot") ) {
            var elem = $(this).children()
            var eventValue = elem.eq(1).val("");
            var timeKey = elem.eq(0).text()

            storeEvent( "", timeKey );
        }

    })
}

main();
var timeInterval = setInterval( function () {
    $("#events-list").empty();
    main();
}, 60_000 );