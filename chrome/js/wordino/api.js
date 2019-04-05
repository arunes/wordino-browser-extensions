class WordinoAPI {
    _apiUrl = "http://localhost:5000";
    constructor() {

    }

    _queryApi = async function (url) {
        try {
            var request = await fetch(url);
            if (request.status === 200) {
                var data = await request.json();
                return data;
            }

            console.log(request.status, request.statusText);
            return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    searchWord = async (query) => {
        let url = this._apiUrl + "/dictionary/word/" + encodeURIComponent(query)
        return await this._queryApi(url);
    }

    getAnagrams = async (query) => {
        let url = this._apiUrl + "/dictionary/word/" + encodeURIComponent(query) + "/anagrams"
        return await this._queryApi(url);
    }

    buildWords = async (query) => {
        let url = this._apiUrl + "/dictionary/tools/buildwords?letters=" + encodeURIComponent(query)
        return await this._queryApi(url);
    }

    fillTheBlanks = async (query) => {
        let url = this._apiUrl + "/dictionary/tools/filltheblanks?wordPattern=" + encodeURIComponent(query)
        return await this._queryApi(url);
    }
}