class ChromeHelper {

    runScript = async (script) => {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                let currentTab = tabs[0];
                if (!currentTab) {
                    reject("No active tabs.");
                    return;
                }

                if (currentTab.url.indexOf("chrome://") > -1) {
                    reject("It's chrome's special tab.");
                    return;
                }

                chrome.tabs.executeScript(tabs[0].id, {
                    code: script
                }, function (result) {
                    resolve(result);
                });
            });

        })
    }
}

