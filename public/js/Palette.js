export default class Palette {
  constructor(name, colors = []) {
    this.id = Date.now(),
    this.name = name,
    this.colors = colors
  }

  appendPalette () {
  $('.saved-palettes').append(`
    <li id=${this.id}>${this.name}
    </li>
  `);
  }  
}
