class WordinoAPI {
    apiUrl = "http://localhost:5000";
    constructor() {

    }

    searchWord = async (word) => {
        try {
            var request = await fetch(this.apiUrl + "/dictionary/word/" + encodeURIComponent(word));
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
}