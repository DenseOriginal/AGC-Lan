function createClassPicker(parentElementId) {
  // Generate all classes for the three current years, including grundforløb
  const thisYear = new Date().getFullYear().toString().slice(2);
  const classChars = ['A', 'B', 'C', 'D', 'E', 'J', 'P', 'R']

  const grundforløb = Array.from({ length: 8 }, (_, idx) => `${thisYear}HTXCG${idx + 1}`);
  const stamklasser = Array.from({ length: 3 }, (_, idx) => {
    const year = thisYear - idx;
    return classChars.map(char => `${year}HTXC${char}`);
  });

  // Prepend the grundforløb array to the stamklasser array
  stamklasser.unshift(grundforløb);

  // Append the two STX classses that go to the school
  // It's only two classes, so why bother adding it to the algorithm
  // And lærer
  stamklasser.push(["20STXCC", "20STXCX", "Lærer"]);

  // Flatten the array [[1], [2], [3]]   >>>   [1, 2, 3]
  const flattenedAray = [].concat(...stamklasser);

  document.getElementById(parentElementId).insertAdjacentHTML('beforeend', `<datalist id="classes">
    ${flattenedAray.map(cur => `<option value="${cur}">`).join("")}
  </datalist>`);
}