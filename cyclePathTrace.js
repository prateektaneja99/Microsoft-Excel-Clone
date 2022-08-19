async function isGraphCyclicTracePath(cycleFormation) {
  let [srcRow, srcCol] = cycleFormation;
  let visited = new ObjectSet();
  //   for (let i = 1; i < noOfRows; i++) {
  //     for (let j = 1; j < noOfColumns; j++) {
  //       if (graph[i][j].length > 0 && !visited.has([i, j])) {
  //         visited.add([i, j]);
  //         if (dfs(visited, i, j)) return [i, j];
  //       }
  //     }
  //   }
  let response = await dfsTracePath(visited, srcRow, srcCol);
  if (response) return Promise.resolve(true);

  return Promise.resolve(false);
}

// Coloring the cells
async function dfsTracePath(visited, i, j) {
  if (graph[i][j].length == 0) return false;
  visited.add([i, j]);

  let cell = getElementRowCol(i, j);
  cell.style.backgroundColor = 'lightblue';
  await colorPromise();

  for (const arr of graph[i][j]) {
    if (visited.has([arr[0], arr[1]])) {
      let cell = getElementRowCol(i, j);
      cell.style.backgroundColor = 'lightsalmon';
      await colorPromise();
      //   cell.style.backgroundColor = 'transparent';
      //   await colorPromise();
      cell.style.backgroundColor = '#fff';
      return Promise.resolve(true);
    }

    if (await dfsTracePath(visited, arr[0], arr[1])) {
      let cell = getElementRowCol(i, j);
      cell.style.backgroundColor = '#fff';
      await colorPromise();
      return Promise.resolve(true);
    }
  }
  visited.remove([i, j]);
  return Promise.resolve(false);
}

function getElementRowCol(i, j) {
  const el = document.querySelector(
    `.input-cell[data-rowId="${i}"][data-colId="${j}"]`
  );
  return el;
}

function colorPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}
