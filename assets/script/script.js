function setDate () {
    const date = new Date();
    $("#currentDay").text( Intl.DateTimeFormat("en-US", {dateStyle: "full"} ).format(date) );
}

function main () {
    setDate();
}

main();