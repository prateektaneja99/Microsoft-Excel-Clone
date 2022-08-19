let noOfColumns = 100;
let noOfRows = 100;

let graph = [];

for (let i = 0; i <= noOfRows; i++) {
  let row = [];
  for (let j = 0; j <= noOfColumns; j++) {
    row.push([]);
  }
  graph.push(row);
}

class ObjectSet extends Set {
  add(elem) {
    return super.add(typeof elem === 'object' ? JSON.stringify(elem) : elem);
  }
  has(elem) {
    return super.has(typeof elem === 'object' ? JSON.stringify(elem) : elem);
  }
  remove(elem) {
    return super.delete(typeof elem === 'object' ? JSON.stringify(elem) : elem);
  }
}

function isGraphCyclic() {
  let visited = new ObjectSet();
  for (let i = 1; i < noOfRows; i++) {
    for (let j = 1; j < noOfColumns; j++) {
      //   console.log(i + ' ' + j + ' ' + graph[i][j]);
      if (graph[i][j].length > 0 && !visited.has([i, j])) {
        visited.add([i, j]);
        if (dfs(visited, i, j)) return [i, j];
      }
    }
  }
  return false;
}

function dfs(visited, i, j) {
  if (graph[i][j].length == 0) return false;
  for (const arr of graph[i][j]) {
    if (visited.has([arr[0], arr[1]])) return true;

    visited.add(arr);

    if (dfs(visited, arr[0], arr[1])) return true;

    visited.remove(arr);
  }
  return false;
}
