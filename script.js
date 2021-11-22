async function getWordsList() {
  let wordsList = [];

  for (let i = 2; ; i++) {
    try {
      const path = `${i}-letters.txt`;
      const data = await fetch(path);
      if (!data.ok) {throw "File doesn't exist!";}
      const words = await data.text();
      wordsList.push({length: i, words});
    } catch {
      break;
    }
  }

  return wordsList.reverse();
}

function findWords(words, letters) {
  const regex = new RegExp(`\\b([${letters}]{2,${letters.length}}\\*?)(?=$|\\W|\\s)`, "g");
  const results = [...words.matchAll(regex)].reduce((acc, word) => {
    let wordTest = word[1];
    for (const letter of letters) {
      wordTest = wordTest.replace(letter, "");
    }
    if (wordTest === "" || wordTest === "*") {
      acc.push(word[1]);
    }
    return acc;
  }, []);

  return results;
}

document.addEventListener('DOMContentLoaded', async () => {

  const wordsList = await getWordsList();

  document.getElementById("searchWords").addEventListener("submit", async function (e) {
    e.preventDefault();

    // get input
    const input = document.getElementById("letters").value.toUpperCase().trim();

    // empty output
    const outputEl = document.getElementById("results");

    let newHtml = "";

    for (let i = 0; i < wordsList.length; i++) {
      const wordSet = wordsList[i];
      const words = findWords(wordSet.words, input);
      if (words.length > 0) {
        newHtml += `<section class="fieldset"><h1 class="legend">${wordSet.length} letters</h1><ul class="words">${words.map(word => {
          let css = "word ";

          if (word.indexOf("*") > -1) {
            css += "danger";
            word = word.substring(0, word.indexOf("*"));
          }

          return `<li class="${css}">${word}</li>`;
        }).join('')}</ul></section>`;
      }
    }

    if (newHtml === "") {
		 newHtml = `No words found matching '${input}'`;
    }

    outputEl.innerHTML = newHtml;
  });
});
