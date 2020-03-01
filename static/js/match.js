window.onload = function () {
    var $red = $('#red');
    var red = JSON.parse($red.text());
    var $blue = $('#blue');
    var blue = JSON.parse($blue.text());
    $.fn.dataTable.ext.errMode = 'none';
    
    $('#red-table').on('error.dt', function (e, settings, techNote, message) {
        console.log('red-table: ', message);
    }).removeAttr('width').DataTable({
        data: red,
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
                data: 'yellowPenaltyCard',
                title: 'Yellow Cards',
                defaultContent: 0
            },
            {
                data: 'redPenaltyCard',
                title: 'Red Cards',
                defaultContent: 0
            },
            {
                data: 'selfClimb',
                title: 'Climb',
                defaultContent: 0
            },
            {
                data: 'climbBalanced',
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
    $('#red-table').on('column-visibility.dt', function (e, settings, column, state) {
        for (var i = 0; i < red.length; i++) {
            $('#red-table').DataTable().draw()
            $(`td.sorting_1:contains(${red[i]._id})`).eq(1).parent().css("height", $(`td.sorting_1:contains(${red[i]._id})`).eq(0).height() + 16);
        }
    });

    $('#blue-table').on('error.dt', function (e, settings, techNote, message) {
        console.log('blue-table: ', message);
    }).removeAttr('width').DataTable({
        data: blue,
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
                data: 'yellowPenaltyCard',
                title: 'Yellow Cards',
                defaultContent: 0
            },
            {
                data: 'redPenaltyCard',
                title: 'Red Cards',
                defaultContent: 0
            },
            {
                data: 'selfClimb',
                title: 'Climb',
                defaultContent: 0
            },
            {
                data: 'climbBalanced',
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
    $('#blue-table').on('column-visibility.dt', function (e, settings, column, state) {
        for (var i = 0; i < blue.length; i++) {
            $('#blue-table').DataTable().draw()
            $(`td.sorting_1:contains(${blue[i]._id})`).eq(1).parent().css("height", $(`td.sorting_1:contains(${blue[i]._id})`).eq(0).height() + 16);
        }
    });


}