// https://api.github.com/zen

// n - no. of unique strings this function should return
// c - concurrency level , no . of parallel connection that can be made to the api server

// example c=2 n=5

let textArray = ['all', 'in', 'all', 'labakh', 'das']

const getData = (array) => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate error
      let randomNumber = Math.floor(Math.random() * (array.length + 10));
      if (randomNumber >= array.length) {
        reject()
      } else {
        resolve(array[randomNumber])
      }
    }, 100);
  });
  return promise;
}

const pipedPromises = (promises) => {
  let result = [];
  let completedRequests = 0;
  return new Promise((resolve) => {
    const onThen = (data) => {
      result.push(data);
      completedRequests++;
      if (completedRequests === promises.length) {
        resolve(result);
      }
    }
    const onCatch = (index) => {
      promises[index] = getData(textArray);
      promises[index].then(onThen).catch(() => onCatch(index));
    }
    for (let index = 0; index<promises.length; index++) {
      promises[index]
        .then((data) => onThen(data))
        .catch(() => onCatch(index));
    }
  });
}

const fetchParallely = async (concurrency) => {
  const stringPromises = [];
  for (let j=0; j<concurrency ; j++) {
    let promise = getData(textArray);
    stringPromises.push(promise);
  }
  let result = await pipedPromises(stringPromises);
  return result;
}

function getStrings(n, c) {
  return new Promise(async (resolve, reject) => {
    // implementation
    let uniqueSet = new Set();
    while (uniqueSet.size < n) {
      try {
        let result = await fetchParallely(c);
        result.forEach((string) => {
          uniqueSet.add(string);  
        });
      } catch(err) {
        console.error(err)
      }
    }
    resolve([...uniqueSet]);
  });
}
console.time("Program End");
getStrings(4, 4).then(strings => {
  console.timeEnd("Program End");
  console.log(strings);
});
