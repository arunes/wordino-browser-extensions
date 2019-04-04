let parseResult = function (data) {
    let results = $("#results");

    // clear results
    results.empty();

    if (data === null) {
        let query = $("#word").val();
        $("<span/>").text("No results for " + query).appendTo(results);

        results.show();
        $("#loader").hide();
        return;
    }

    // loop through forms
    $.each(data.forms, (idxForm, form) => {
        let result = $("<div/>").addClass("result").appendTo(results);

        // add header
        $("<h2/>").text(data.word.word).appendTo(result);

        // add form
        $("<p/>").addClass("form").text(form.form).appendTo(result);

        // create definitions container
        let definitions = $("<ol/>").addClass("definitions").appendTo(result);

        // loop through definitions
        $.each(form.definitions, (idxDefinition, definition) => {
            // add definition
            let definitionItem = $("<li/>").addClass("definitionContainer").appendTo(definitions);
            $("<p/>").addClass("definition").text(definition.definition).appendTo(definitionItem);

            // synonyms
            if (definition.synonyms) {
                let synonymContainer = $("<div/>").addClass("synonyms").appendTo(definitionItem);
                $("<span/>").text("synonyms: ").appendTo(synonymContainer);
                $.each(definition.synonyms, (idxSynonym, synonym) => {
                    $("<a/>").attr("href", "#").click(() => {
                        searchWord(synonym);
                    }).text(synonym).appendTo(synonymContainer);
                    if (idxSynonym < definition.synonyms.length - 1) {
                        $("<span/>").text(", ").appendTo(synonymContainer);
                    }
                });
            }

            // antonyms
            if (definition.antonyms) {
                let antonymContainer = $("<div/>").addClass("antonyms").appendTo(definitionItem);
                $("<span/>").text("antonyms: ").appendTo(antonymContainer);
                $.each(definition.antonyms, (idxAntonym, antonym) => {
                    $("<a/>").attr("href", "#").click(() => {
                        searchWord(antonym);
                    }).text(antonym).appendTo(antonymContainer);
                    if (idxAntonym < definition.antonyms.length - 1) {
                        $("<span/>").text(", ").appendTo(antonymContainer);
                    }
                });
            }

            // also see
            if (definition.alsoSee) {
                let alsoSeeContainer = $("<div/>").addClass("alsoSee").appendTo(definitionItem);
                $("<span/>").text("also See: ").appendTo(alsoSeeContainer);
                $.each(definition.alsoSee, (idxAlsoSee, alsoSee) => {
                    $("<a/>").attr("href", "#").click(() => {
                        searchWord(alsoSee);
                    }).text(alsoSee).appendTo(alsoSeeContainer);
                    if (idxAlsoSee < definition.alsoSee.length - 1) {
                        $("<span/>").text(", ").appendTo(alsoSeeContainer);
                    }
                });
            }

            // samples
            if (definition.samples) {
                let samples = $("<ul/>").addClass("samples").appendTo(definitionItem);
                $.each(definition.samples, (idxSample, sample) => {
                    $("<li/>").text(sample).appendTo(samples);
                })
            }
        });

    });

    results.show();
    $("#loader").hide();
}

let searchWord = function (word) {
    // show loading indicator
    $("#results").hide();
    $("#info").hide();
    $("#loader").show();
    $("#word").val(word);

    let api = new WordinoAPI();
    api.searchWord(word).then(function (data) {
        // re-enable search button
        $("#doSearch").removeAttr("disabled");
        parseResult(data);
    });
}

let submitForm = function (event) {
    event.preventDefault();
    let queryWord = $("#word").val();
    if (!queryWord) {
        queryWord = "";
    } else {
        queryWord = queryWord.trim().toLowerCase()
    }

    if (queryWord.length == 0) {
        $("#errorMessage").text("Please enter word to lookup.").show();
        $("#word").focus();
        return;
    } else if (queryWord.length > 50) {
        $("#errorMessage").text("Word cannot be longer than 50 characters.").show();
        $("#word").focus();
        return;
    }

    // clear error message if any
    $("#errorMessage").text("").hide();
    $("#doSearch").attr("disabled", "disabled");

    searchWord(queryWord);
};

// try to get selected text from the active tab
let readSelection = async () => {
    try {
        let chromeHelper = new ChromeHelper();
        let result = await chromeHelper.runScript("window.getSelection().toString();");

        if (result) {
            result = result.toString().trim().toLowerCase()
            if (result.length > 0) {
                searchWord(result);
            }
        }
    } catch (err) {
        console.log(err);
    }
}

// on load
$(function () {
    $("#word").focus();
    $("#form").submit(submitForm);
    readSelection();
});