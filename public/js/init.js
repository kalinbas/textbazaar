(function ($) {
    $(function () {

        $('.button-collapse').sideNav();

        if (userLoggedIn()) {
            dragula([document.querySelector('#argumentsPro')], {revertOnSpill: true})
                .on('drop', function (el) {
                    changeOrder($(el).data('id'), true, $(el).index());
                });

            dragula([document.querySelector('#argumentsContra')], {revertOnSpill: true})
                .on('drop', function (el) {
                    changeOrder($(el).data('id'), false, $(el).index());
                });
        }
        //$('.parallax').parallax();

        $("#search").on("keyup", function (event) {
            var query = $("#search").val();
            $("#auto-complete ul").empty();
            if (query.length > 2) {
                $("#auto-complete .progress").show();
                $.get("/api/opinion/search?q=" + query, function (data) {
                    $.each(data, function (index, value) {
                        $("#auto-complete ul").append("<li><a class='collection-item' href='/opinions/" + value.slug + "'>" + value.title + "</a></li>");
                    });
                    $("#auto-complete .progress").hide();
                });
            }
        });

        $("#argTitle").on("change", function (event) {
            var query = $("#argTitle").val();
            $("#similar-arguments ul").empty();
            $.get("/api/opinion/search?q=" + query, function (data) {
                $.each(data, function (index, value) {
                    $("#similar-arguments ul").append("<li><a class='collection-item' onclick='linkArgument(\x22" + value.id + "\x22)'>" + value.title + "</a></li>");
                });
            });
        });
    }); // end of document ready
})(jQuery); // end of jQuery name space

function showSearch() {
    $('.button-collapse').sideNav('hide');

    $("#searchForm").show();
    $("#auto-complete").show();

    $(".menu-element").hide();

    $("#search").focus();
}
function hideSearch() {
    $("#searchForm").hide();
    $("#auto-complete").hide();

    $(".menu-element").show();
}
function commentKeyDown(event) {
    if(event.keyCode == 13) {
        event.preventDefault();
        var id = $("#opinionId").val();
        var comment = $("#commentField").val();
        if (comment) {
            $.ajax({
                url: "/api/opinion/" + id + "/comment",
                type: "POST",
                data: JSON.stringify({comment: comment}),
                contentType: "application/json; charset=utf-8",
                error: handleError
            }).always(function () {
                location.reload();
            });
        }
    }
}

function openArgumentModal(isPro) {
    $('#proArg').hide();
    $('#contraArg').hide();
    $('#isPro').val(isPro);

    if (isPro) $('#proArg').show();
    else $('#contraArg').show();

    $('#titleArg').text($('#opinionTitle').text());

    $('#modal1').openModal();
}

function addArgument() {

    var id = $("#opinionId").val();
    var isPro = $("#isPro").val();
    var title = $("#argTitle").val();
    var description = $("#argDescription").val();

    $.ajax({
        url: "/api/opinion/" + id + "/add",
        type: "POST",
        data: JSON.stringify({isPro: isPro === "true", title: title, description: description}),
        contentType: "application/json; charset=utf-8",
        error: handleError
    }).always(function () {
        $('#modal1').closeModal();
        location.reload();
    });
}

function linkArgument(argumentId) {

    var id = $("#opinionId").val();
    var isPro = $("#isPro").val();

    $.ajax({
        url: "/api/opinion/" + id + "/link",
        type: "POST",
        data: JSON.stringify({isPro: isPro === "true", argumentId: argumentId}),
        contentType: "application/json; charset=utf-8",
        error: handleError
    }).always(function () {
        $('#modal1').closeModal();
        location.reload();
    });
}

function changeOrder(argumentId, isPro, order) {
    var id = $("#opinionId").val();

    $.ajax({
        url: "/api/opinion/" + id + "/reorder",
        type: "POST",
        data: JSON.stringify({argumentId: argumentId, isPro: isPro, order: order}),
        contentType: "application/json; charset=utf-8",
        error: handleError
    });
}

function changeLike(element, argumentId, isPro, like) {
    var el = $(element);
    var id = $("#opinionId").val();

    // reset like if already liked
    if (like === true && el.closest("li.liked").length > 0) like = null;
    if (like === false && el.closest("li.unliked").length > 0) like = null;

    $.ajax({
        url: "/api/opinion/" + id + "/relike",
        type: "POST",
        data: JSON.stringify({argumentId: argumentId, isPro: isPro, like: like}),
        contentType: "application/json; charset=utf-8",
        error: handleError
    }).always(function () {
        location.reload();
    });
}

function userLoggedIn() {
    return $("#userId").length > 0;
}

function handleError(xhr, ajaxOptions, thrownError) {
    if (xhr.status === 401) {
        location.href = "/login";
    }
}