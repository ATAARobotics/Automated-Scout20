window.onload = function () {
    var $matches = $('#matches');
    var matches = JSON.parse($matches.text());
    var $pit = $('#pit');
    var pit = JSON.parse($pit.text());
    $.fn.dataTable.ext.errMode = 'none';
    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }
    if (!pit.error) {
        document.getElementById("photo1").src = URL.createObjectURL(b64toBlob(pit[0]._attachments['photo1.jpg'].data, 'image/jpeg'));
        document.getElementById("photo2").src = URL.createObjectURL(b64toBlob(pit[0]._attachments['photo2.jpg'].data, 'image/jpeg'));
    }
    $('#pit-table').on('error.dt', function (e, settings, techNote, message) {
        console.log('pit-table: ', message);
    }).DataTable({
        data: pit,
        paging: false,
        scrollY: "400px",
        scrollCollapse: true,
        colReorder: true,
        scrollX: true,
        dom: 'Bfrtip',
        buttons: [
            'csv', 'excel'
        ],
        columns: [
            {
                data: "_rev",
                title: "Revision",
            },
            {
                data: "scoutName",
                title: "Scout Name",
                defaultContent: "No Name"
            },
            {
                data: "robotAppearance",
                title: "Appearance",
                defaultContent: 0
            },
            {
                data: "cellIntake",
                title: "Intake",
                defaultContent: 0
            },
            {
                data: "robotCapacity",
                title: "Cell Storage",
                defaultContent: 0
            },
            {
                data: "climbType",
                title: "Climb Level",
                defaultContent: 0
            },
            {
                data: "cellLowLevel",
                title: "Low Scoring",
                defaultContent: 0
            },
            {
                data: "cellHighLevel",
                title: "High Scoring",
                defaultContent: 0
            },
            {
                data: "cellInnerLevel",
                title: "Inner Scoring",
                defaultContent: 0
            },
            {
                data: "robotWeight",
                title: "Weight",
                defaultContent: 0
            },
            {
                data: "robotHeight",
                title: "Height",
                defaultContent: 0
            },
            {
                data: "robotDone",
                title: "Done",
                defaultContent: 0
            },
            {
                data: "robotBroken",
                title: "Broken",
                defaultContent: 0
            },
            {
                data: "comments",
                title: "Comments",
                width: "500px"
            }
        ]
    });
    $('#match-table').on('error.dt', function (e, settings, techNote, message) {
        console.log('match-table: ', message);
    }).removeAttr('width').DataTable({
        data: matches,
        paging: false,
        colReorder: true,
        scrollX: true,
        scrollY: "400px",
        scrollCollapse: true,
        fixedColumns: true,
        dom: 'Bfrtip',
        buttons: [
            'csv', 'excel',
            {
                extend: 'colvis',
                collectionLayout: 'fixed four-column'
            }
        ],
        columns: [
            {
                data: "_id",
                title: "Match",
                type: "natural"
            },
            {
                data: "scoutName",
                title: "Scout Name",
                defaultContent: "No Name"
            },
            {
                data: "startingLocation",
                title: "Starting Level",
                defaultContent: 0
            },
            {
                data: 'movedBaseline',
                title: 'Moved Baseline',
                defaultContent: 0
            },
            {
                data: 'autoCellsPickup',
                title: 'Auto Cells Pickup',
                defaultContent: 0
            },
            {
                data: 'autoCellsDropped',
                title: 'Auto Cells Dropped',
                defaultContent: 0
            },
            {
                data: 'autoCellsLow',
                title: 'Auto Cells Low',
                defaultContent: 0
            },
            {
                data: 'autoCellsHigh',
                title: 'Auto Cells High',
                defaultContent: 0
            },
            {
                data: 'autoCellsInner',
                title: 'Auto Cells Inner',
                defaultContent: 0
            },
            {
                data: 'autoCellsAssist',
                title: 'Auto Cells Assist',
                defaultContent: 0
            },
            {
                data: 'autoCellSuccessPercent',
                title: 'Auto Cell Accuracy',
                defaultContent: 0
            },
            {
                data: 'teleopCellsPickup',
                title: 'Teleop Cells Pickup',
                defaultContent: 0
            },
            {
                data: 'teleopCellsDropped',
                title: 'Teleop Cells Dropped',
                defaultContent: 0
            },
            {
                data: 'teleopCellsLow',
                title: 'Teleop Cells Low',
                defaultContent: 0
            },
            {
                data: 'teleopCellsHigh',
                title: 'Teleop Cells High',
                defaultContent: 0
            },
            {
                data: 'teleopCellsInner',
                title: 'Teleop Cells Inner',
                defaultContent: 0
            },
            {
                data: 'teleopCellsAssist',
                title: 'Teleop Cells Assist',
                defaultContent: 0
            },
            {
                data: 'cellAssistPercent',
                title: 'Assist Frequency',
                defaultContent: 0
            },
            {
                data: 'teleopCellSuccessPercent',
                title: 'Teleop Accuracy',
                defaultContent: 0
            },
            {
                data: 'totalCellSuccessPercent',
                title: 'Cell Accuracy',
                defaultContent: 0
            },
            {
                data: 'positionControl',
                title: 'Position Control',
                defaultContent: 0
            },
            {
                data: 'rotationControl',
                title: 'Rotation Control',
                defaultContent: 0
            },
            {
                data: 'selfClimb',
                title: 'Climb',
                defaultContent: 0
            },
            {
                data: 'climbBalance',
                title: 'Balanced Climb',
                defaultContent: 0
            },
            {
                data: 'selfPark',
                title: 'Park',
                defaultContent: 0
            },
            {
                data: 'speed',
                title: 'Speed',
                defaultContent: 0
            },
            {
                data: 'stability',
                title: 'Stability',
                defaultContent: 0
            },
            {
                data: 'defense',
                title: 'Defense',
                defaultContent: 0
            },
            {
                data: 'primaryDefense',
                title: 'Primary Defense',
                defaultContent: 0
            },
            {
                data: 'anythingBreak',
                title: 'Broken',
                defaultContent: 0
            },
            {
                data: 'dead',
                title: 'Dead',
                defaultContent: 0
            },
            {
                data: 'pointsEarned',
                title: 'Points Earned',
                defaultContent: 0
            },
            {
                data: "autoComments",
                title: "Auto Comments",
                width: "500px"
            },
            {
                data: "teleopComments",
                title: "Teleop Comments",
                width: "500px"
            },
            {
                data: "endgameComments",
                title: "Endgame Comments",
                width: "500px"
            },
            {
                data: "generalComments",
                title: "General Comments",
                width: "500px"
            }
        ]
    });
    $('#match-table').on('column-visibility.dt', function (e, settings, column, state) {
        for (var i = 0; i < matches.length; i++) {
            $('#match-table').DataTable().draw()
            $(`td.sorting_1:contains(${matches[i]._id})`).eq(1).parent().css("height", $(`td.sorting_1:contains(${matches[i]._id})`).eq(0).height() + 16);
        }
    });
    $('#yaxis').on('change', function (e) {
        var ctx = document.getElementById("match-chart");
        if (window.matchChart) {
            matchChart.destroy();
        }
        window.matchChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: $('#match-table').DataTable().column(0).data().toArray(),
                datasets: [{
                    label: $('#match-table').DataTable().settings().init().columns[$('#yaxis').val()].title,
                    data: $('#match-table').DataTable().column($('#yaxis').val()).data().toArray()
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: $('#match-table').DataTable().settings().init().columns[$('#yaxis').val()].title,
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Match'
                        }
                    }]
                }
            }
        })
    })
}