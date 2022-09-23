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
        children.addClass("bg-success text-white");
    } else if ( momentObj.isBefore( now, "hour" ) ) {
        children.addClass("bg-danger text-white opacity-50");
    } else {
        children.addClass("bg-dark text-white");
    }


}

function generateRow( rowData ) {

    var parentRow =  $(`<div class="row is-listener" id="${rowData.id}">`);

    var timeEntry = $('<div class="shadow-lg column col-2 col-xl-1">').text(rowData.timeKey);
    var eventInput = $('<input type="text" class="column col-8 col-xl-9">');
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

    $(".is-listener").on("click", "button", function () {
        var elem = $(this).parent().children()
        var eventValue = elem.eq(1).val();
        var timeKey = elem.eq(0).text()

        storeEvent( eventValue, timeKey );
    })
    // col-2 col-8 col-2
}

main();