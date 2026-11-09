(function () {
  var counter = 0;

  document.addEventListener('click', function (event) {
    var add = event.target.closest('[data-add]');
    if (add) {
      var block = add.closest('[data-repeat]');
      var template = block.querySelector('template');
      var key = 'n' + Date.now() + '_' + counter++;
      var holder = document.createElement('div');
      holder.innerHTML = template.innerHTML.replace(/__INDEX__/g, key);
      var item = holder.firstElementChild;
      block.querySelector('.repeat-items').appendChild(item);
      var first = item.querySelector('input:not([type=hidden]), textarea');
      if (first) first.focus();
      return;
    }

    var remove = event.target.closest('[data-remove]');
    if (remove && window.confirm('Remove this item? It disappears from the website after you publish.')) {
      remove.closest('.repeat-item').remove();
    }
  });

  document.addEventListener('change', function (event) {
    var input = event.target;
    if (input.type !== 'file' || !input.files || !input.files[0]) return;
    var scope = input.closest('.screen-item, .image-field');
    var thumb = scope && scope.querySelector('.thumb');
    if (!thumb) return;
    var img = document.createElement('img');
    img.alt = '';
    img.src = URL.createObjectURL(input.files[0]);
    thumb.replaceChildren(img);
  });
})();
