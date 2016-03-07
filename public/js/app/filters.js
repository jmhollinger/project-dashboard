/*--------------Filters--------------*/

/* titlecase filter */
projectDashboard.filter('titlecase', function () {
  return function (input) {
    var bigwords = /\b(LFUCG|ac|aka|llc|hvac|[a-z]\/[a-z]|i|ii|iii|iv|v|vi|vii|viii|ix)\b/i;
	var smallwords = /\b(an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|to|vs)\b/i;
    var words = input.toLowerCase().split(' ');
    for (var i = 0; i < words.length; i++) {
      if (words[i].match(bigwords) !== null) {words[i] = words[i].toUpperCase()}
      else if (words[i].match(smallwords) !== null)	{words[i] = words[i].toLowerCase()}
      else {words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)}
    }
    return words.join(' ');
  }
});

/* percent filter */
projectDashboard.filter('percent', function () {
  return function (input, decimals) {
  var per = input * 100
  return per.toFixed(decimals) + '%'
  }
  })