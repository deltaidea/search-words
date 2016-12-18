document.querySelector('#search').addEventListener('click', () => {
  const givenLetters = document.querySelector('#letters').value.split('')
  const givenWordLengths = document.querySelector('#lengths').value.split(',').map(l => l.trim()).map(l => parseInt(l, 10))

  console.log(givenLetters, givenWordLengths)

  const isWordMatching = (word, letters, lengths) => {
    const remainingLetters = letters.slice()

    if (!lengths.includes(word.length)) {
      return false
    }

    for (let i = word.length - 1; i >= 0; i--) {
      let letterIndex = remainingLetters.indexOf(word[i].toLowerCase())
      if (letterIndex > -1) {
        remainingLetters.splice(letterIndex, 1)
      } else {
        return false
      }
    }
    return remainingLetters
  }

  const wordsOfGivenLetters = window.dictionary.filter(word => isWordMatching(word, givenLetters, givenWordLengths))

  const wordsByLengthHash = wordsOfGivenLetters.reduce((hash, word) => {
    hash[word.length] = hash[word.length] || []
    hash[word.length].push(word)
    return hash
  }, {})

  const wordsByLengthArray = givenWordLengths.map(len => wordsByLengthHash[len] || [])

  const matchingCombinations = []

  const findAllMatching = (lengthIndex, letters, previousWords) => {
    const wordsOfCurrentLength = wordsByLengthArray[lengthIndex]

    wordsOfCurrentLength.forEach(word => {
      const remainingLetters = isWordMatching(word, letters, [givenWordLengths[lengthIndex]])
      if (!remainingLetters) return

      const wordsWithCurrent = previousWords.concat([word])

      if (lengthIndex === (givenWordLengths.length - 1)) {
        matchingCombinations.push(wordsWithCurrent)
      } else {
        findAllMatching(lengthIndex + 1, remainingLetters, wordsWithCurrent)
      }
    })
  }

  findAllMatching(0, givenLetters, [])

  let result = '<div class="alert alert-warning">Ничего не нашлось. :(</div>'
  if (matchingCombinations.length > 0) {
    result = matchingCombinations.map(words => words.join(' ')).map(s => `<div class="alert alert-success">${s}</div>`).join('\n')
  }
  document.querySelector('#result').innerHTML = result
})
