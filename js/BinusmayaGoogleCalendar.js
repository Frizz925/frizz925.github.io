// ==UserScript==
// @name         Application-Level Binusmaya Google Calendar Standalone
// @namespace    http://senakiho.tk/
// @version      2.0
// @description  Add shown class schedules into Google Calendar. Standalone version without using web server.
// @author       IZ14-0
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
// @require      https://apis.google.com/js/client.js
// @require      http://frizz925.github.io/js/GoogleCalendarWebUIFramework.min.js
// @match        http://apps.binusmaya.binus.ac.id/LMS/newSchedule.aspx*
// @grant        none
// ==/UserScript==

var columnMapping = [
    'Date', 'Shift', 'Status',
    'Course', 'Credits', 'Class',
    'Room', 'Campus'
];

GoogleCalendarWebUIFramework({
    credentialsUrl: "http://frizz925.github.io/js/GoogleCalendarAppCredentials.json",
    calendarName: "Binusmaya Calendar",
    fetchEvents: function() {
        var events = [];
        $('table.tablewithborder:not(:last-of-type)').each(function() {
            $(this).find('tr:not(:first-child)').each(function() {
                var cols = $(this).find('td');
                var data = {};
                $.each(columnMapping, function(idx, name) {
                    data[name] = $(cols[idx]).text().trim();
                });

                var time = data['Shift'].split('-');
                
                var summary = "[" + data['Status'] + "] " + data['Course'];
                var location = "Binus " + data['Campus'] + " " + data['Room'];
                var description = 
                    "Class: " + data['Class'] + "\n" +
                    "Credits: " + data['Credits'];
                var start = (new Date(data['Date'] + " " + time[0])).toISOString();
                var end = (new Date(data['Date'] + " " + time[1])).toISOString();
                
                var json = {
                    'summary'   : summary,
                    'location'  : location,
                    'start'     : { 'dateTime' : start },
                    'end'       : { 'dateTime' : end },
                    'description'   : description,
                    'reminders' : {
                        'useDefault'    : true
                    }
                };

                events.push(json);
            });
        });

        return events;
    },
    uiElements: function() {
        return {
            revoke: $("<a href='#'>Revoke</a>"),
            auth: $("<a href='#'>Authorize</a>"),
            insert: $("<a href='#'>Add to Calendar</a>"),
            separator: $("<span> | </span>"),
            loading: $("<span>Loading...</span>")
        };
    },
    uiLoadChecker: function() {
        return $('.tablewithborder').length;
    },
    uiWrapper: function() {
        var div = $('#thought > div:first-child')
        var container = $("<div></div>");
        div.after(container);
        return container;
    }
}).init();
