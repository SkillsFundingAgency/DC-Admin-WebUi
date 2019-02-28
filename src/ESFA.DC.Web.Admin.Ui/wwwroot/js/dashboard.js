function Maths() {
    this.type = type;
    this.color = "red";
    this.getInfo = getAppleInfo;
}


////$(function() {
//    var updateStats = function UpdateStats() {
//        var data = $('#jsGrid').jsGrid('option', 'data');
//        if (data != null) {
//            $("#total").html(data.length);
//            $("#readyTotal").html($.grep(data, function (p) { return p.status === 1; }).length);
//            $("#completedTotal").html($.grep(data, function (p) { return p.status === 4; }).length);
//            $("#failedRetryTotal").html($.grep(data, function (p) { return p.status === 5; }).length);
//            $("#failedTotal").html($.grep(data, function (p) { return p.status === 6; }).length);
//            $("#movedForProcessingTotal").html($.grep(data, function (p) { return p.status === 2; }).length);
//            $("#pausedTotal").html($.grep(data, function (p) { return p.status === 7; }).length);
//            $("#processingTotal").html($.grep(data, function (p) { return p.status === 3; }).length);

//            var times = completedTimes(data);
//            if (times != null && times.length > 0) {
//                $("#minProcessTime").html(new Date(arr.min(times) * 1000).toISOString().substr(11, 8));
//                $("#maxProcessTime").html(new Date(arr.max(times) * 1000).toISOString().substr(11, 8));
//                $("#meanProcessTime").html(new Date(arr.mean(times) * 1000).toISOString().substr(11, 8));
//                $("#medianProcessTime").html(new Date(arr.median(times) * 1000).toISOString().substr(11, 8));
//            }
//            $("#ilrTotal").html($.grep(data, function (p) { return p.status === 4 && p.jobType === 1; }).length);
//            $("#refTotal").html($.grep(data, function (p) { return p.status === 2 && p.jobType === 2; }).length);
            

//            var ctx = document.getElementById('stats').getContext('2d');
//            ctx.height = 100;

//            var myPieChart = new Chart(ctx, {
//                type: 'pie',
//                data: {
//                    datasets: [
//                        {
//                            data: [$.grep(data, function (p) { return p.status === 1; }).length,
//                            $.grep(data, function (p) { return p.status === 2; }).length,
//                            $.grep(data, function (p) { return p.status === 3; }).length,
//                            $.grep(data, function (p) { return p.status === 4; }).length,
//                            $.grep(data, function (p) { return p.status === 5; }).length,
//                            $.grep(data, function (p) { return p.status === 6; }).length,
//                            $.grep(data, function (p) { return p.status === 7; }).length
//                            ],
//                            backgroundColor: ["#C6E9F5", "#109ABD", "#37b6b5", "#BFED91", "#E6BB77", "#F55840", "#FFC300"]

//                        }
//                    ],
//                    labels: [
//                        'Ready',
//                        'Moved for processing',
//                        'Processing',
//                        'Completed',
//                        'Failed rety',
//                        'Failed',
//                        'Paused'
//                    ]

//                },
//                options: {
//                    responsive: true,
//                    legend: {
//                        display: true
//                    },
//                    maintainAspectRatio: false

//                }
//            });

//        }

//}


//    var completedTimes = function(data) {
//        var completed = $.grep(data, function (p) { return p.status === 4 && p.jobType === 1; });
//        var diffs = new Array();
//        $.each(completed,
//            function (index, value) {
//                diffs.push(Math.abs((new Date(value.dateTimeUpdatedUtc).getTime() - new Date(value.dateTimeSubmittedUtc).getTime()) / 1000));
//            });
//        console.log(diffs);
//        return diffs;
//    }

////});

$(document).ready(function () {
    $.ajax({
        url: "http://localhost:2218/api/job/stats",
        method: "get",
        dataType: "json",
        success: function (data) {
            var table = $("#statsTableBody");
            for (var i = 0; i < data.length; i++) {
                var row = $("<tr class='table-striped'>" +
                    "<td>"+ data[i].collectionName +"</td>" +
                    "<td>" + data[i].jobStatus + "</td>" +
                    "<td>" + data[i].jobCount + "</td>" +
                            " </tr>");
                table.append(row);
            }
        }
    });
});

$(document).ready(function () {
    $.ajax({
        url: "http://localhost:2218/api/job/retried/ILR1819",
        method: "get",
        dataType: "json",
        success: function (data) {
            $("#retriedTotal").html(data);
        }
    });
});