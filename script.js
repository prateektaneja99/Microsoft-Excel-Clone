'use strict';

//HTML
const inputCellContainer = document.querySelector('.input-cell-container');
const columnNameContainer = document.querySelector('.column-name-container');
const rowNameContainer = document.querySelector('.row-name-container');
const alignIcon = document.querySelectorAll('.align-icon');
const styleIcon = document.querySelectorAll('.style-icon');
const menuIconBar = document.querySelector('.menu-icon-bar');
const bold = document.querySelector('.icon-bold');
const italic = document.querySelector('.icon-italic');
const underline = document.querySelector('.icon-underline');
const alignLeft = document.querySelector('.icon-align-left');
const alignCenter = document.querySelector('.icon-align-center');
const alignRight = document.querySelector('.icon-align-right');
const iconColorFill = document.querySelector('.icon-color-fill');
const iconColorText = document.querySelector('.icon-color-text');
const backgroundColorPicker = document.querySelector(
  '.background-color-picker'
);
const textColorPicker = document.querySelector('.text-color-picker');
const fontFamilySelector = document.querySelector('.font-family-selector');
const fontSizeSelector = document.querySelector('.font-size-selector');
const iconAdd = document.querySelector('.icon-add');
const sheetTabContainer = document.querySelector('.sheet-tab-container');
const sheetOptionsModal = document.querySelector('.sheet-options-modal');
const container = document.querySelector('.container');
const sheetRenameModal = document.querySelector('.sheet-rename-modal');
const submitRename = document.querySelector('.submit-rename-button');
const cancelRename = document.querySelector('.cancel-rename-button');
const sheetRename = document.querySelector('.sheet-rename');
const newSheetName = document.querySelector('.new-sheet-name');
const deleteSheet = document.querySelector('.sheet-delete');
const yesDelete = document.querySelector('.sure-button.yes');
const noDelete = document.querySelector('.sure-button.no');
const areYouSure = document.querySelector('.sheet-delete-sure-modal');
const selectedCell = document.querySelector('.formula-editor.selected-cell');
const formulaBar = document.querySelector('.formula-input');

// Storing data
let defaultProperties = {
  text: '',
  'font-weight': '',
  'font-style': '',
  'text-decoration': '',
  'text-align': 'left',
  'background-color': '#FFFFFF',
  color: '#000000',
  'font-family': 'Noto Sans',
  'font-size': '14px',
  formula: '',
  children: '',
};

let cellData = {
  sheet1: {},
};

let totalNoOfSheets = 1;
let activeSheet = 'sheet1';
let sheetToBeEdited = null;
let nextSheetNumber = 2;

// Lodaing empty sheet
// let noOfColumns = 100;
// let noOfRows = 100;

for (let i = 0; i < noOfColumns; i++) {
  const code = getCode(i);
  let html = `<div class="column-name" data-code="${code}" data-id="${
    i + 1
  }">${code}</div>`;
  columnNameContainer.insertAdjacentHTML('beforeend', html);
}

for (let i = 1; i < noOfRows; i++) {
  const code = getCode(i);
  let html = `<div class="row-name" data-id="${i}">${i}</div>`;
  rowNameContainer.insertAdjacentHTML('beforeend', html);
}

for (let i = 1; i < noOfRows; i++) {
  let html = `<div class="cell-row"> `;
  for (let j = 1; j < noOfColumns; j++) {
    html += `<div
        class="input-cell"
        contenteditable="false"
        data-code="${getCode(j - 1)}"
        data-colId="${j}"
        data-rowId="${i}"
        data-address="${getCode(j - 1) + i}"
      ></div>`;
  }
  html += '</div>';
  inputCellContainer.insertAdjacentHTML('beforeend', html);
}
document
  .querySelector('.input-cell[data-rowid="1"]')
  .classList.add('selected-input-cell');

// Dynamic HTML Elements
const inputCell = document.querySelector('.input-cell');

function getCode(no) {
  let ans = '';
  const rem = no % 26;
  if (rem == 0 && no > 0) ans += 'A';
  for (let index = 1; index < no / 26; index++) {
    ans += 'A';
  }
  ans += String.fromCharCode(rem + 65);
  return ans;
}

// alignIcon.forEach(el =>
//   el.addEventListener('click', function () {
//     document
//       .querySelector('.align-icon.selected-icon')
//       .classList.remove('selected-icon');
//     el.classList.add('selected-icon');
//   })
// );

// styleIcon.forEach(el =>
//   el.addEventListener('click', function (e) {
//     e.target.classList.toggle('selected-icon');
//   })
// );

// Event delegation for the above two methods
menuIconBar.addEventListener('click', function (e) {
  if (e.target.classList.contains('align-icon')) {
    document
      .querySelector('.align-icon.selected-icon')
      .classList.remove('selected-icon');
    e.target.classList.add('selected-icon');
  } else if (e.target.classList.contains('style-icon')) {
    e.target.classList.toggle('selected-icon');
  }
});

inputCellContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('input-cell')) return;

  if (e.ctrlKey) {
    // console.log(e.target.dataset['colId']);
    const row = Number(e.target.dataset['rowid']);
    const col = Number(e.target.dataset['colid']);
    // console.log(row);
    if (row > 1) {
      const topCellSelected = document.querySelector(
        `.input-cell[data-colid="${col}"][data-rowid="${row - 1}"]`
      );
      if (topCellSelected.classList.contains('selected-input-cell')) {
        e.target.classList.add('top-cell-selected');
        console.log('Hi');
        topCellSelected.classList.add('bottom-cell-selected');
      }
    }
    if (row < noOfRows) {
      const bottomCellSelected = document.querySelector(
        `.input-cell[data-colId="${col}"][data-rowId="${row + 1}"]`
      );
      if (bottomCellSelected.classList.contains('selected-input-cell')) {
        e.target.classList.add('bottom-cell-selected');
        bottomCellSelected.classList.add('top-cell-selected');
      }
    }
    if (col > 1) {
      const leftCellSelected = document.querySelector(
        `.input-cell[data-colId="${col - 1}"][data-rowId="${row}"]`
      );
      if (leftCellSelected.classList.contains('selected-input-cell')) {
        e.target.classList.add('left-cell-selected');
        leftCellSelected.classList.add('right-cell-selected');
      }
    }
    if (col < noOfColumns) {
      const rightCellSelected = document.querySelector(
        `.input-cell[data-colId="${col + 1}"][data-rowId="${row}"]`
      );
      if (rightCellSelected.classList.contains('selected-input-cell')) {
        e.target.classList.add('right-cell-selected');
        rightCellSelected.classList.add('left-cell-selected');
      }
    }
  } else {
    document
      .querySelectorAll('.input-cell.selected-input-cell')
      ?.forEach(ele =>
        ele?.classList.remove(
          'selected-input-cell',
          'right-cell-selected',
          'bottom-cell-selected',
          'top-cell-selected',
          'left-cell-selected'
        )
      );
  }
  e.target.classList.add('selected-input-cell');
  const selectedElementDataset = document.querySelector(
    '.input-cell.selected-input-cell'
  ).dataset;
  selectedCell.innerText =
    selectedElementDataset['code'] + selectedElementDataset['rowid'];

  changeHeader(e.target);
});

function changeHeader(ele) {
  const row = Number(ele.dataset['rowid']);
  const col = Number(ele.dataset['colid']);
  let cellInfo = defaultProperties;
  if (cellData[activeSheet][row] && cellData[activeSheet][row][col]) {
    cellInfo = cellData[activeSheet][row][col];
  }
  cellInfo['font-weight']
    ? bold.classList.add('selected-icon')
    : bold.classList.remove('selected-icon');

  cellInfo['font-style']
    ? italic.classList.add('selected-icon')
    : italic.classList.remove('selected-icon');

  cellInfo['text-decoration']
    ? underline.classList.add('selected-icon')
    : underline.classList.remove('selected-icon');

  let align = cellInfo['text-align'];
  document
    .querySelector('.align-icon.selected-icon')
    .classList.remove('selected-icon');
  document.querySelector(`.icon-align-${align}`).classList.add('selected-icon');

  backgroundColorPicker.value = cellInfo['background-color'];
  textColorPicker.value = cellInfo['color'];
  fontFamilySelector.value = cellInfo['font-family'];
  fontFamilySelector.style.fontFamily = cellInfo['font-family'];
  fontSizeSelector.value = cellInfo['font-size'].split('p')[0];
  formulaBar.value = cellInfo['formula'];
}

inputCellContainer.addEventListener('dblclick', function (e) {
  if (!e.target.classList.contains('input-cell')) return;
  document
    .querySelector('.input-cell.selected-input-cell')
    ?.classList.remove('selected-input-cell');
  e.target.classList.add('selected-input-cell');
  e.target.setAttribute('contenteditable', 'true');
  e.target.focus();
});

['focusout', 'keydown'].forEach(evt =>
  inputCellContainer.addEventListener(evt, function (e) {
    if (evt === 'keydown' && e.key !== 'Enter') return;
    //   if (e.target.classList.contains('.input-cell'))
    document
      .querySelector('.input-cell.selected-input-cell')
      .setAttribute('contenteditable', 'false');
    const row = e.target.dataset.rowid;
    const col = e.target.dataset.colid;
    if (cellData[activeSheet][row] && cellData[activeSheet][row][col]) {
      if (cellData[activeSheet][row][col].text !== e.target.innerHTML) {
        removeChildToParent(
          cellData[activeSheet][row][col].formula,
          e.target.dataset.address
        );
        cellData[activeSheet][row][col].formula = '';
        // cellData[activeSheet][row][col].children = '';
      }
    }
    updateCell('text', e.target.innerHTML);
  })
);

inputCellContainer.addEventListener('scroll', function () {
  //   console.log(this.scrollLeft);
  columnNameContainer.scrollLeft = this.scrollLeft;
});

inputCellContainer.addEventListener('scroll', function () {
  //   console.log(this.scrollLeft);
  rowNameContainer.scrollTop = this.scrollTop;
});

function updateCell(property, value, defaultPossible = false) {
  document.querySelectorAll('.input-cell.selected-input-cell').forEach(ele => {
    ele.style[property] = value;
    const row = Number(ele.dataset['rowid']);
    const col = Number(ele.dataset['colid']);
    console.log(col);
    if (cellData[activeSheet][row]) {
      if (cellData[activeSheet][row][col]) {
        cellData[activeSheet][row][col][property] = value;
      } else {
        cellData[activeSheet][row][col] = { ...defaultProperties };
        cellData[activeSheet][row][col][property] = value;
      }
    } else {
      cellData[activeSheet][row] = {};
      cellData[activeSheet][row][col] = { ...defaultProperties };
      cellData[activeSheet][row][col][property] = value;
    }
    if (property == 'text') {
      //   console.log(ele.dataset['address']);
      updateChildren(ele.dataset['address']);
    }
    if (
      defaultPossible &&
      JSON.stringify(cellData[activeSheet][row][col]) ===
        JSON.stringify(defaultProperties)
    ) {
      delete cellData[activeSheet][row][col];
      if (Object.keys(cellData[activeSheet][row]).length == 0) {
        delete cellData[activeSheet][row];
      }
    }
  });
}

bold.addEventListener('click', function (e) {
  if (e.target.classList.contains('selected-icon')) {
    updateCell('font-weight', '', true);
  } else {
    updateCell('font-weight', 'bold');
  }
});

italic.addEventListener('click', function (e) {
  if (e.target.classList.contains('selected-icon')) {
    updateCell('font-style', '', true);
  } else {
    updateCell('font-style', 'italic');
  }
});

underline.addEventListener('click', function (e) {
  if (e.target.classList.contains('selected-icon')) {
    updateCell('text-decoration', '', true);
  } else {
    updateCell('text-decoration', 'underline');
  }
});

alignLeft.addEventListener('click', function (e) {
  if (!e.target.classList.contains('selected-icon')) {
    updateCell('text-align', 'left', true);
  }
});

alignCenter.addEventListener('click', function (e) {
  if (!e.target.classList.contains('selected-icon')) {
    updateCell('text-align', 'center', true);
  }
});

alignRight.addEventListener('click', function (e) {
  if (!e.target.classList.contains('selected-icon')) {
    updateCell('text-align', 'right', true);
  }
});

iconColorFill.addEventListener('click', function () {
  backgroundColorPicker.click();
});

iconColorText.addEventListener('click', function () {
  textColorPicker.click();
});

backgroundColorPicker.addEventListener('change', function (e) {
  //   console.log(e.target);
  updateCell('background-color', e.target.value);
});

textColorPicker.addEventListener('change', function (e) {
  updateCell('color', e.target.value);
});

fontFamilySelector.addEventListener('change', function (e) {
  updateCell('font-family', e.target.value);
  fontFamilySelector.style.fontFamily = e.target.value;
});

fontSizeSelector.addEventListener('change', function (e) {
  updateCell('font-size', `${e.target.value}px`);
});

function emptySheet(sheetNo) {
  let sheetInfo = cellData[sheetNo];
  for (let i of Object.keys(sheetInfo)) {
    for (let j of Object.keys(sheetInfo[i])) {
      //   console.log(i);
      //   console.log(j);
      const el = document.querySelector(
        `.input-cell[data-colId="${j}"][data-rowId="${i}"]`
      );
      for (let [prop, val] of Object.entries(defaultProperties)) {
        // console.log(prop, val);
        if (prop === 'text') el.innerText = val;
        else if (prop === 'formula') continue;
        else if (prop === 'children') continue;
        else el.style.setProperty(prop, val);
      }
    }
  }
}

function loadSheet() {
  let sheetInfo = cellData[activeSheet];
  console.log(cellData);
  for (let i of Object.keys(sheetInfo)) {
    for (let j of Object.keys(sheetInfo[i])) {
      //   console.log(i);
      //   console.log(j);
      const el = document.querySelector(
        `.input-cell[data-colId="${j}"][data-rowId="${i}"]`
      );
      let cellInfo = cellData[activeSheet][i][j];
      for (let [prop, val] of Object.entries(cellInfo)) {
        // console.log(prop, val);
        if (prop === 'text') el.innerText = val;
        else if (prop === 'formula') continue;
        else if (prop === 'children') continue;
        else el.style.setProperty(prop, val);
      }
    }
  }
}

iconAdd.addEventListener('click', function (e) {
  emptySheet(activeSheet);
  document.querySelector('.sheet-tab.selected').classList.remove('selected');
  let sheetName = `sheet${nextSheetNumber}`;
  cellData[sheetName] = {};
  totalNoOfSheets += 1;
  nextSheetNumber += 1;
  activeSheet = sheetName;
  sheetTabContainer.insertAdjacentHTML(
    'beforeend',
    `<div class="sheet-tab selected">${sheetName}</div>`
  );
});

sheetTabContainer.addEventListener('click', selectSheet);

function selectSheet(e) {
  if (!e.target.classList.contains('sheet-tab')) return;
  emptySheet(activeSheet);
  document.querySelector('.sheet-tab.selected').classList.remove('selected');
  activeSheet = e.target.innerText;
  e.target.classList.add('selected');
  loadSheet();
}

sheetTabContainer.addEventListener('contextmenu', function (e) {
  if (!e.target.classList.contains('sheet-tab')) return;
  e.preventDefault();
  //   console.log(e.target);
  sheetToBeEdited = e.path[0];
  sheetOptionsModal.style.display = 'block';
  sheetOptionsModal.style.left = `${e.x}px`;
});

container.addEventListener('click', function (e) {
  sheetOptionsModal.style.display = 'none';
});

sheetRename.addEventListener('click', function () {
  sheetRenameModal.style.display = 'block';
});

cancelRename.addEventListener('click', () => {
  sheetRenameModal.style.display = 'none';
});

submitRename.addEventListener('click', function (e) {
  if (newSheetName.value === '') {
    alert('Please enter a name');
    return;
  }
  const newName = newSheetName.value;
  console.log(e);
  const oldName = sheetToBeEdited.innerText;
  sheetToBeEdited.innerText = newName;
  let newCellData = {};
  for (let key in cellData) {
    if (key != oldName) {
      newCellData[key] = cellData[key];
    } else {
      newCellData[newName] = cellData[key];
    }
  }
  cellData = newCellData;
  //   delete newCellData;
  sheetRenameModal.style.display = 'none';
});

deleteSheet.addEventListener('click', function (e) {
  areYouSure.style.display = 'block';
});

yesDelete.addEventListener('click', function (e) {
  if (totalNoOfSheets < 2) {
    alert('Only 1 sheet cannot be deleted');
    areYouSure.style.display = 'none';
    return;
  }
  sheetToBeEdited.remove();
  //   console.log(sheetToBeEdited.innerText);
  if (activeSheet == sheetToBeEdited.innerText) {
    document.querySelector('.sheet-tab').classList.add('selected');
    activeSheet = document.querySelector('.sheet-tab.selected').innerText;
  }
  emptySheet(sheetToBeEdited.innerText);
  delete cellData[sheetToBeEdited.innerText];
  totalNoOfSheets--;
  areYouSure.style.display = 'none';
  loadSheet();
});

noDelete.addEventListener('click', () => {
  areYouSure.style.display = 'none';
});

formulaBar.addEventListener('keydown', async function (e) {
  let inputFormula = formulaBar.value;
  //   console.log(inputFormula);
  if (e.key === 'Enter' && inputFormula) {
    let result = evaluateFormula(inputFormula);

    // console.log(result);
    document
      .querySelectorAll('.input-cell.selected-input-cell')
      .forEach(async el => {
        //   console.log(el);
        let currentAddress = el.dataset.address;
        addToGraph(inputFormula, currentAddress);
        let cycleFromation = isGraphCyclic();
        if (cycleFromation) {
          // alert('Cycle detected cannot be completed');
          let response = confirm(
            'Cycle detected cannot be completed. Do you want to trace the path?'
          );
          while (response === true) {
            // keep tracking color
            await isGraphCyclicTracePath(cycleFromation);
            response = confirm(
              'Cycle detected cannot be completed. Do you want to trace the path?'
            );
          }
          formulaBar.value = '';
          removeFromGraph(inputFormula, currentAddress);
          return;
        }

        el.innerText = result;
        updateCell('text', el.innerText);
        const oldFormula =
          cellData[activeSheet][el.dataset.rowid][el.dataset.colid].formula;
        updateCell('formula', inputFormula);
        //   console.log(currentAddress);
        if (inputFormula != oldFormula)
          removeChildToParent(oldFormula, currentAddress);
        addChildToParent(inputFormula, currentAddress);
      });
  }
});

function addToGraph(formula, childAddress) {
  const parent = document.querySelector(
    `.input-cell[data-address="${childAddress}"]`
  );
  const childRow = parent.dataset.rowid;
  const childCol = parent.dataset.colid;
  let encodedFormula = formula.split(' ');
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      const el = document.querySelector(
        `.input-cell[data-address="${encodedFormula[i]}"]`
      );
      const row = el.dataset.rowid;
      const col = el.dataset.colid;
      graph[row][col].push([childRow, childCol]);
    }
  }
}

function removeFromGraph(formula, childAddress) {
  const parent = document.querySelector(
    `.input-cell[data-address="${childAddress}"]`
  );
  const childRow = parent.dataset.rowid;
  const childCol = parent.dataset.colid;
  let encodedFormula = formula.split(' ');
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      const el = document.querySelector(
        `.input-cell[data-address="${encodedFormula[i]}"]`
      );
      const row = el.dataset.rowid;
      const col = el.dataset.colid;
      graph[row][col].pop();
    }
  }
}

function addChildToParent(formula, address) {
  let encodedFormula = formula.split(' ');
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      const el = document.querySelector(
        `.input-cell[data-address="${encodedFormula[i]}"]`
      );
      const row = el.dataset.rowid;
      const col = el.dataset.colid;
      console.log('hi');
      cellData[activeSheet][row][col].children += `${address} `;
      //   cellData[activeSheet][row][col].children.unshift(address);
    }
  }
}

function removeChildToParent(formula, address) {
  let encodedFormula = formula.split(' ');
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      const el = document.querySelector(
        `.input-cell[data-address="${encodedFormula[i]}"]`
      );
      const row = el.dataset.rowid;
      const col = el.dataset.colid;
      console.log(el + ' ' + address);
      cellData[activeSheet][row][col].children = cellData[activeSheet][row][
        col
      ].children.replace(`${address} `, '');
      //   cellData[activeSheet][row][col].children.unshift(address);
    }
  }
}

function updateChildren(parentAddress) {
  const parent = document.querySelector(
    `.input-cell[data-address="${parentAddress}"]`
  );
  const parentRow = parent.dataset.rowid;
  const parentCol = parent.dataset.colid;
  //   console.log(cellData[activeSheet][parentRow][parentCol].children);
  for (const child of cellData[activeSheet][parentRow][
    parentCol
  ].children.split(' ')) {
    const el = document.querySelector(`.input-cell[data-address="${child}"]`);
    // console.log('Hi ' + child);
    if (!el) continue;
    // console.log(el);
    const formula =
      cellData[activeSheet][el.dataset.rowid][el.dataset.colid].formula;
    el.innerText = evaluateFormula(formula);
    cellData[activeSheet][el.dataset.rowid][el.dataset.colid].text =
      el.innerText;
    updateChildren(el.dataset.address);
  }
}

function evaluateFormula(formula) {
  let encodedFormula = formula.split(' ');
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      const el = document.querySelector(
        `.input-cell[data-address="${encodedFormula[i]}"]`
      );
      encodedFormula[i] = el.innerText == '' ? 0 : el.innerText;
    }
  }
  formula = encodedFormula.join(' ');
  return eval(formula);
}
