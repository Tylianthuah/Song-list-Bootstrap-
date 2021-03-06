class Song {
  constructor(title, artist, album) {
    this.title = title;
    this.artist = artist;
    this.album = album;
  }
}

class UI {
  static displaySongs() {
    const songs = Store.getSong();
    songs.forEach((song) => UI.addToList(song));
  }

  static addToList(song) {
    const list = document.getElementById('song-list');
    const row = document.createElement('tr');
    row.innerHTML = `<td>${song.title}</td>
          <td>${song.artist}</td>
          <td>${song.album}</td>
          <td><a href="#" class="btn btn-sm btn-danger delete">X</a></td>
          `;

    list.appendChild(row);
  }

  static removeSong(target) {
    if (target.classList.contains('delete')) {
      target.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.form-cont');
    const form = document.querySelector('#song-form');

    container.insertBefore(div, form);

    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 1500);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#artist').value = '';
    document.querySelector('#album').value = '';
  }
}

class Store {
  static getSong() {
    let songs;
    if (localStorage.getItem('songs') === null) {
      songs = [];
    } else {
      songs = JSON.parse(localStorage.getItem('songs'));
    }
    return songs;
  }

  static addSong(song) {
    const songs = Store.getSong();
    songs.push(song);

    localStorage.setItem('songs', JSON.stringify(songs));
  }

  static removeSong(title) {
    const songs = Store.getSong();

    songs.forEach((song, index) => {
      if (song.title === title) {
        songs.splice(index, 1);
      }
    });

    localStorage.setItem('songs', JSON.stringify(songs));
  }
}

// Event:Displaying a song
document.addEventListener('DOMContentLoaded', UI.displaySongs);

// Event:Adding a song
const form = document.querySelector('#song-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.querySelector('#title').value;
  const artist = document.querySelector('#artist').value;
  const album = document.querySelector('#album').value;

  // Validate

  if (title === '' || artist === '' || album === '') {
    UI.showAlert('Enter all the fields', 'red');
  } else {
    const song = new Song(title, artist, album);
    UI.addToList(song);

    //Store
    Store.addSong(song);

    UI.showAlert('Song Added', 'green');
    // Clear Fields
    UI.clearFields();
  }
});

// Remove a song
document.querySelector('#song-list').addEventListener('click', (e) => {
  UI.removeSong(e.target);
  Store.removeSong(
    e.target.parentElement.parentElement.firstElementChild.textContent
  );
  UI.showAlert('Song Removed', 'red ');
});
