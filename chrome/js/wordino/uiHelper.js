class UIHelper {
    _getWordResultHtml = function (query, data) {
        let results = $("<div/>");

        if (data === null) {
            $("<span/>").addClass("noResult").text("No results for " + query).appendTo(results);
            return results.html();
        }

        // loop through words
        $.each(data, (idxWord, word) => {
            // loop through forms
            $.each(word.forms, (idxForm, form) => {
                let result = $("<div/>").addClass("definitionResult").appendTo(results);

                // add header
                $("<h2/>").text(word.word).appendTo(result);

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
                        let synonymContainer = $("<div/>").addClass("references").appendTo(definitionItem);
                        $("<span/>").text("synonyms: ").appendTo(synonymContainer);
                        $.each(definition.synonyms, (idxSynonym, synonym) => {
                            $("<a/>").attr({ "href": "#", "data-word": synonym }).text(synonym).appendTo(synonymContainer);
                            if (idxSynonym < definition.synonyms.length - 1) {
                                $("<span/>").text(", ").appendTo(synonymContainer);
                            }
                        });
                    }

                    // antonyms
                    if (definition.antonyms) {
                        let antonymContainer = $("<div/>").addClass("references").appendTo(definitionItem);
                        $("<span/>").text("antonyms: ").appendTo(antonymContainer);
                        $.each(definition.antonyms, (idxAntonym, antonym) => {
                            $("<a/>").attr({ "href": "#", "data-word": antonym }).text(antonym).appendTo(antonymContainer);
                            if (idxAntonym < definition.antonyms.length - 1) {
                                $("<span/>").text(", ").appendTo(antonymContainer);
                            }
                        });
                    }

                    // also see
                    if (definition.alsoSee) {
                        let alsoSeeContainer = $("<div/>").addClass("references").appendTo(definitionItem);
                        $("<span/>").text("also See: ").appendTo(alsoSeeContainer);
                        $.each(definition.alsoSee, (idxAlsoSee, alsoSee) => {
                            $("<a/>").attr({ "href": "#", "data-word": alsoSee }).text(alsoSee).appendTo(alsoSeeContainer);
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
        });

        return results.html();
    }

    _getAnagramsResultHtml = function (query, data) {
        let results = $("<div/>");

        if (data === null) {
            $("<span/>").addClass("noResult").text("No results for " + query).appendTo(results);
            return results.html();
        }

        // loop through results
        $.each(data, (idxResult, result) => {
            let anagramResult = $("<div/>").addClass("anagramResult").appendTo(results);
            $("<h5/>").text(result.length + " letter anagrams").appendTo(anagramResult);

            let anagramContainer = $("<div/>").addClass("anagrams").appendTo(anagramResult);
            $.each(result.words, (idxWord, word) => {
                $("<a/>").attr({ "href": "#", "data-word": word, "data-target": "definition" }).text(word).appendTo(anagramContainer);
                if (idxWord < result.words.length - 1) {
                    $("<span/>").text(", ").appendTo(anagramContainer);
                }
            });
        });

        return results.html();
    }

    _buildWordsHtml = function (query, data) {
        let results = $("<div/>");

        if (data === null) {
            $("<span/>").addClass("noResult").text("No results for " + query).appendTo(results);
            return results.html();
        }

        // loop through results
        $.each(data, (idxResult, result) => {
            let buildWordResult = $("<div/>").addClass("buildWordResult").appendTo(results);
            $("<h5/>").text(result.length + " letter words").appendTo(buildWordResult);

            let wordsContainer = $("<div/>").addClass("words").appendTo(buildWordResult);
            $.each(result.words, (idxWord, word) => {
                $("<a/>").attr({ "href": "#", "data-word": word, "data-target": "definition" }).text(word).appendTo(wordsContainer);
                if (idxWord < result.words.length - 1) {
                    $("<span/>").text(", ").appendTo(wordsContainer);
                }
            });
        });

        return results.html();
    }

    _fillTheBlanksHtml = function (query, data) {
        let results = $("<div/>");

        if (data === null) {
            $("<span/>").addClass("noResult").text("No results for " + query).appendTo(results);
            return results.html();
        }

        let fillTheBlanksResult = $("<div/>").addClass("fillTheBlanksResult").appendTo(results);
        $("<h5/>").text("Possible words for " + query).appendTo(fillTheBlanksResult);

        let wordsContainer = $("<div/>").addClass("words").appendTo(fillTheBlanksResult);
        $.each(data, (idxResult, word) => {
            $("<a/>").attr({ "href": "#", "data-word": word, "data-target": "definition" }).text(word).appendTo(wordsContainer);
            if (idxResult < data.length - 1) {
                $("<span/>").text(", ").appendTo(wordsContainer);
            }
        });

        return results.html();
    }

    getWord = function (query) {
        return new Promise((resolve => {
            let api = new WordinoAPI();
            api.searchWord(query).then((data) => {
                resolve(this._getWordResultHtml(query, data));
            });
        }))
    }

    getAnagrams = function (query) {
        return new Promise((resolve => {
            let api = new WordinoAPI();
            api.getAnagrams(query).then((data) => {
                resolve(this._getAnagramsResultHtml(query, data));
            });
        }))
    }

    buildWords = function (query) {
        return new Promise((resolve => {
            let api = new WordinoAPI();
            api.buildWords(query).then((data) => {
                resolve(this._buildWordsHtml(query, data));
            });
        }))
    }

    fillTheBlanks = function (query) {
        return new Promise((resolve => {
            let api = new WordinoAPI();
            api.fillTheBlanks(query).then((data) => {
                resolve(this._fillTheBlanksHtml(query, data));
            });
        }))
    }
}