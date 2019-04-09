let activeTab;
let submitForm = async function (event) {
    event.preventDefault();
    let queryWord = $("#query").val();
    if (!queryWord) {
        queryWord = "";
    } else {
        queryWord = queryWord.trim().toLowerCase()
    }

    if (queryWord.length == 0) {
        $("#query").addClass('has-error').focus();
        window.setTimeout(() => {
            $("#query").removeClass('has-error');
        }, 1500);
        return;
    } else if (queryWord.length > 50) {
        $("#query").focus();
        return;
    }

    // start loading
    $("#loader").show();
    $("#results").hide().empty();
    $("form button").attr("disabled", "disabled");

    let html = "";
    let uiHelper = new UIHelper();
    switch (activeTab) {
        case "definition":
            html = await uiHelper.getWord(queryWord);
            break;

        case "anagrams":
            html = await uiHelper.getAnagrams(queryWord);
            break;

        case "buildWords":
            html = await uiHelper.buildWords(queryWord);
            break;

        case "fillTheBlanks":
            html = await uiHelper.fillTheBlanks(queryWord);
            break;
    }

    $("form button").removeAttr("disabled");
    $("#loader").hide();
    $("#results").html(html)
    $("#results a[data-word]").click(function () {
        let word = $(this).data("word");
        let target = $(this).data("target");
        if (target) {
            switchTab(target);
        }

        $("#query").val(word);
        $("form").submit();
    });
    $("#results").show();
    $("#results").scrollTop(0);
};

// try to get selected text from the active tab
let readSelection = async () => {
    try {
        let chromeHelper = new ChromeHelper();
        let result = await chromeHelper.runScript("window.getSelection().toString();");

        if (result) {
            result = result.toString().trim().toLowerCase()
            if (result.length > 0) {
                $("#query").val(result);
                $("form").submit();
            }
        }
    } catch (err) {
        console.log(err);
    }
}

let switchTab = function (tab) {
    activeTab = tab;
    $("#menu button").removeClass("blue");

    let btn = $("#menu button[data-tab='" + tab + "']");
    btn.addClass("blue");
    $("#infoTexts p").hide();
    $("#infoTexts ." + tab).show();
    $("#results").hide().empty();
    $("#query").focus();
};

let prepareMenu = function () {
    $("#menu button").click(function () {
        let tab = $(this).data("tab");
        switchTab(tab);
    });
};

// on load
$(function () {
    $("#query").focus();
    $("form").submit(submitForm);
    prepareMenu();
    switchTab("definition");
    readSelection();
});