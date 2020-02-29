window.onload = function() {
    var $averages = $('#averages');
    var averages = JSON.parse($averages.text());

    $.fn.dataTable.ext.errMode = 'none';
    $('#average-table').on('error.dt', function (e, settings, techNote, message) {
        console.log('pit-table: ', message);
    }).DataTable({
        data: averages,
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
                data: 'teamNumber',
                title: 'Team'
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
                data: 'defenseNA',
                title: 'Defense NA',
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
            }
        ]
    })
    $('#yaxis').on('change', function (e) {
        var ctx = document.getElementById("average-chart");
        if (window.averageChart) {
            averageChart.destroy();
        }
        window.averageChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: $('#average-table').DataTable().column(0).data().toArray(),
                datasets: [{
                    label: $('#average-table').DataTable().settings().init().columns[$('#yaxis').val()].title,
                    data: $('#average-table').DataTable().column($('#yaxis').val()).data().toArray()
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: $('#average-table').DataTable().settings().init().columns[$('#yaxis').val()].title,
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Team'
                        }
                    }]
                }
            }
        })
    })
}