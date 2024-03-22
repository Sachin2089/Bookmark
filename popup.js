document.addEventListener('DOMContentLoaded', function() {
  const bookmarkList = document.getElementById('bookmarkList');
  const addBookmarkButton = document.getElementById('addBookmark');
  const deleteBookmarkButton = document.getElementById('deleteBookmark');
  const viewBookmarkButton = document.getElementById('viewBookmark');

  chrome.storage.local.get('bookmarks', function(data) {
    const bookmarks = data.bookmarks || [];
    displayBookmarks(bookmarks);
  });

  function displayBookmarks(bookmarks) {
    bookmarkList.innerHTML = '';
    bookmarks.forEach(function(bookmark, index) {
      const list = document.createElement('ul');
      list.style.padding = '10px';
      
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.textContent = bookmark.title;
      link.href = bookmark.url;
      listItem.appendChild(link);
      
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.style.backgroundColor = 'rgb(255, 50, 0)';
      deleteButton.style.height = '30px';
      deleteButton.style.width = '70px';
      deleteButton.style.borderRadius = '7px';
      deleteButton.style.outline = 'none';
      deleteButton.onclick = function() {
        deleteBookmark(index);
      };
      listItem.appendChild(deleteButton);
      
      list.appendChild(listItem);
      bookmarkList.appendChild(list);
    });
  }

  function deleteBookmark(index) {
    chrome.storage.local.get('bookmarks', function(data) {
      const bookmarks = data.bookmarks || [];
      bookmarks.splice(index, 1);
      chrome.storage.local.set({bookmarks: bookmarks}, function() {
        displayBookmarks(bookmarks);
      });
    });
  }

  addBookmarkButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const newBookmark = {
        title: tabs[0].title || "Untitled",
        url: tabs[0].url || "https://example.com"
      };
      chrome.storage.local.get('bookmarks', function(data) {
        const bookmarks = data.bookmarks || [];
        bookmarks.push(newBookmark);
        chrome.storage.local.set({bookmarks: bookmarks}, function() {
          displayBookmarks(bookmarks);
        });
      });
    });
  });

  viewBookmarkButton.addEventListener('click', function() {
    chrome.tabs.create({url: chrome.runtime.getURL('popup.html')});
  });
});
