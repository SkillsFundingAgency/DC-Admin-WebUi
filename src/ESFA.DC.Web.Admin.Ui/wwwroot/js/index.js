var baseApiUrl = $("#url").val();

$(function () {

    var priorities = [
        { Name: "1", Id: 1 },
        { Name: "2", Id: 2 },
        { Name: "3", Id: 3 },
        { Name: "4", Id: 4 },
        { Name: "5", Id: 5 }
    ];


    var statuses = [
        { Name: "Ready", Id: 1 },
        { Name: "Moved For processing", Id: 2 },
        { Name: "Processing", Id: 3 },
        { Name: "Completed", Id: 4 },
        { Name: "FailedRetry", Id: 5 },
        { Name: "Failed", Id: 6 },
        { Name: "Paused", Id: 7 },
        { Name: "Waiting", Id: 8 }
    ];

    var jobTypes = [
        { Name: "ILR", Id: 1 },
        { Name: "Reference data", Id: 2 }
    ];

    $("#jsGrid").jsGrid({
        width: "100%",
        height: "600px",

        inserting: false,
        editing: true,
        sorting: true,
        paging: true,
        autoload: true,
        onDataLoaded: function (grid) {
            if (grid !== null && grid.data !== null) {
                updateStats();
            }
            
        },
        rowClass: function(item, itemIndex) {

            var cls = String(statuses[item.status - 1].Name);
            return cls.replace(/\s/g, '');
            
        },
      
        controller: {
            loadData: function(filter) {
                return $.ajax({
                    url: baseApiUrl + "/job/period/ILR1819",
                    dataType: "json"
                });
            },
            deleteItem: function(item) {
                var deletedItem = item;
                return $.ajax({
                    url: baseApiUrl + "/job/" + item.jobId,
                    dataType: "text",
                    method: "DELETE",
                    success: function (result) {
                        if (result === 200)
                            $("#jsGrid").jsGrid("deleteItem", deletedItem);
                    },
                    error: function(xhr, status) {
                        alert('Delete failed, Either job is moved to in progress or job is aunavailable');
                    }
                });
            }
        },
        rowClick: function (args) {
            //if (!args.id.contains("file_")) {
               // showDetailsDialog("Edit", args.item);
            //}
        },
        fields: [
            { name: "jobId", title: "Job Id", type: "text", width: 50, validate: "required" },
            { name: "jobType", title: "Job Type", type: "select", items: jobTypes, valueField: "Id", textField: "Name", width: 110, validate: "required" },
            { name: "status", title: "Status", type: "select", width: 150, items: statuses, valueField: "Id", textField: "Name" },
            { name: "dateTimeSubmittedUtc", title: "Submitted Date time", type: "text", width: 160 },
            { name: "priority", type: "select", title: "Priority", width: 50, items: priorities, valueField: "Id", textField: "Name" },
            { name: "dateTimeUpdatedUtc", title: "Updated Date time",type: "text", width: 160},
            { name: "ukprn", type: "number", title: "Ukprn", width: 80 },
            { name: "fileName", type: "text", title: "File Name", width: 100 },
            { name: "rowVersion", type: "text", title: "", width: 0, visible: false },

            {
                type: "control",
                //modeSwitchButton: false,
                editButton: false,
                itemTemplate: function (value, item) {
                    var $iconRetry = $("<i>").attr({ class: "glyphicon glyphicon-repeat" });
                    var $iconUpload = $("<i>").attr({ class: "glyphicon glyphicon-upload" });
                    var $iconTrash = $("<i>").attr({ class: "glyphicon glyphicon-trash" });

                    var $retryButton = $("<button>")
                        .attr({ class: "btn btn-default btn-xs" })
                        .attr({ role: "button" })
                        .attr({ title: "Retry" })
                        .attr({ id: "btn-edit-" + item.id })
                        .click(function (e) {
                            updateStatusClient(item);
                            e.stopPropagation();
                        })
                        .append($iconRetry);

                    var $fileUpload = $("<input type='file' id='file_"+ item.jobId +"' hidden>")
                        
                        .click(function (e) {
                            e.stopPropagation();
                            //e.preventDefault();
                            //e.preventBubble();
                        })
                        .change(function (e) {
                            uploadFileClient(e,item);
                            //$("file_" + item.jobId).click();
                            e.stopPropagation();
                          
                        })

                    var $uploadButton = $("<button>")
                        .attr({ class: "btn btn-default btn-xs" })
                        .attr({ role: "button" })
                        .attr({ title: "Upload" })
                        .attr({ id: "btn-edit-" + item.jobId })
                        .click(function (e) {
                            //updateStatusClient(item);
                            $("#file_" + item.jobId)[0].click(e);
                            //e.stopPropagation();
                        })
                        .append($iconUpload);

                    var $customDeleteButton = $("<button>")
                        .attr({ class: "btn btn-danger btn-xs" })
                        .attr({ role: "button" })
                        .attr({ title: jsGrid.fields.control.prototype.deleteButtonTooltip })
                        .attr({ id: "btn-delete-" + item.id })
                        .click(function (e) {
                            deleteJob(item);
                            e.stopPropagation();
                        })
                        .append($iconTrash);

                    var addedElement = $("<div>").attr({ class: "btn-toolbar" });

                    if (item.status === 6 ) {
                        addedElement.append($retryButton);
                        }
                    if (item.status === 1) {
                        addedElement.append($customDeleteButton);
                    }

                    if (item.status === 5 || item.status === 6) {
                        addedElement.append($uploadButton);
                        addedElement.append($fileUpload);
                    }

                    return addedElement;
                }
                //headerTemplate: function () {
                //    return $("<button>").attr("type", "button").text("Add")
                //        .on("click", function () {
                //            showDetailsDialog("Add", {});
                //        });
                //},
                //itemTemplate: function (value, item) {
                //    var $result = $([]);

                //    if (item.status === 1) {
                //        $result = $result.add(this._createDeleteButton(item));
                //    }

                //    return $result;
                //}
            }
        ]
    });

    var formSubmitHandler = $.noop;

    $("#detailsDialog").dialog({
        autoOpen: false,
        width: 400,
        close: function() {
            $("#detailsForm").validate().resetForm();
            $("#detailsForm").find(".error").removeClass("error");
        }
    });

    $("#detailsForm").validate({
        rules: {
            status: "required",
            priority: { required: true, range: [1, 5] }
        },
        messages: {
            status: "Please enter valid status",
            priority: "Please enter valid priority"
        },
        submitHandler: function() {
            formSubmitHandler();
        }
    });

    var showDetailsDialog = function(dialogType, client) {
        $("#status").val(client.status);
        $("#priority").val(client.priority);
        $("#ukprn").val(client.ukprn);
        $("#jobType").val(client.jobType);
        $("#fileName").val(client.fileName);
        $("#jobId").val(client.jobId);
        $("#rowVersion").val(client.rowVersion);

        $("#ukprn").prop('disabled', false);
        $("#jobType").prop('disabled', false);
        $("#fileName").prop('disabled', false);

        $("#status").prop('disabled', false);
        $("#priority").prop('disabled', false);

        //disable update
        if (client.jobId > 0) {
            $("#ukprn").prop('disabled', true);
            $("#jobType").prop('disabled', true);
            $("#fileName").prop('disabled', true);


            if (client.status !== 1) {
                //$("#status").prop('disabled', true);
                $("#priority").prop('disabled', true);
            }
        }

        formSubmitHandler = function() {
            saveClient(client, dialogType === "Add");
        };

        $("#detailsDialog").dialog("option", "title", dialogType + " Job - Job Id : " + client.jobId)
            .dialog("open");
    };

    var saveClient = function(client, isNew) {
        $.extend(client,
            {
                priority: parseInt($("#priority").val()),
                status: parseInt($("#status").val()),
                jobId: parseInt($("#jobId").val()),
                ukprn: parseInt($("#ukprn").val()),
                fileName: $("#fileName").val(),
                jobType: parseInt($("#jobType").val()),
                rowVersion: $("#rowVersion").val()
            });

        client.jobId = isNaN(client.jobId) ? 0 : client.jobId;
        $.ajax({
            url: baseApiUrl + "/job",
            dataType: "json",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(client)
            //headers: {
            //    'Accept': 'application/json',
            //    'Content-Type': 'application/json'
            //},
            //data: JSON.stringify(client)
        }).complete(function(data) {
            if (data.status === 200) {
                client.jobId = isNew ? data.responseJSON : client.jobId;
                $("#jsGrid").jsGrid(isNew ? "insertItem" : "updateItem", client);
                $("#detailsDialog").dialog("close");
                updateStats();
            } else {
                if (
                    confirm("Update failed, Job status has been changed. Do you want to refresh the data?")) {
                    $("#detailsDialog").dialog("close");
                    $('#jsGrid').jsGrid('loadData');

                }
            }
        });

    };
    var updateStatusClient = function (item) {
            var client =
                {
                    jobStatus: 1,
                    jobId: item.jobId,
                    numberOfLearners:0
                };

            $.ajax({
                url: baseApiUrl + "/job/status",
                dataType: "json",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(client)
                //headers: {
                //    'Accept': 'application/json',
                //    'Content-Type': 'application/json'
                //},
                //data: JSON.stringify(client)
            }).complete(function (data) {
                if (data.status === 200) {
                    alert("Job set to ready again.");
                    $('#jsGrid').jsGrid('loadData');
                    updateStats();
                } else {
                    if (
                        alert("Update failed, Job status has been changed")) {
                        $('#jsGrid').jsGrid('loadData');
                    }
                }
            });

            //var deleteJob = deleteJob(item)
        //{
        //        var deletedItem = item;
        //        return $.ajax({
        //            url: baseApiUrl + "/job/" + item.jobId,
        //            dataType: "text",
        //            method: "DELETE",
        //            success: function (result) {
        //                if (result === 200)
        //                    $("#jsGrid").jsGrid("deleteItem", deletedItem);
        //            },
        //            error: function (xhr, status) {
        //                alert('Delete failed, Either job is moved to in progress or job is aunavailable');
        //            }
        //        });
    };


    var uploadFileClient = function (e, item) {
       
        var formData = new FormData();
        formData.append('file', $('#file_' + item.jobId)[0].files[0]);
        formData.append('fileName', $('#file_' + item.jobId)[0].files[0].name);

        $.ajax({
            url: baseApiUrl + "/file-upload/upload/" + item.jobId,
           // dataType: "json",
            method: "POST",
            contentType: false,
            processData: false,
            data: formData
        }).complete(function (data) {
            if (data.status === 200) {
                alert("Created new job with Id :" + data.result);
            } else {
                alert("New job creation failed...");
            }
        });

    };
    

    var timeout;
    var checked;
    function refresh() {
        if (checked === true) {
            $('#jsGrid').jsGrid('loadData');
            resetTimeout();
        } else {
            clearTimeout(timeout);

        }
    }

    $('#autoRefresh').click(function () {
        checked = this.checked;
        refresh();
    });
    
    function resetTimeout() {
        clearTimeout(timeout);
        timeout = setTimeout(refresh, 3000);
    }


    $('#pauseQueue').click(function () {
        $.ajax({
            url: baseApiUrl + "/jobManager",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            dataType: "json",
            data: this.value === "Pause Queue Processing" ? "0" : "1"
        }).complete(function(data) {
            if (data.status === 200) {
                $('#pauseQueue').prop("value",
                    $('#pauseQueue').prop("value") === "Start Queue Processing"
                    ? "Pause Queue Processing"
                    : "Start Queue Processing");
            } else {
                alert("Queue status changed failed, please try later.");
            }
        });
    });
});
