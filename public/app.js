'use strict';

var profile = "heap";
var data = {
  gt: []
};

refresh();

$(".cpu").on("click", function() {
  profile = "profile";
  refresh();
});
$(".heap").on("click", function() {
  profile = "heap";
  refresh();
});
$(".refresh").on("click", function() {
  refresh(true);
});
$(".filter").on("keyup", function() {
  refresh();
});

var moreStats = function() {
  $.ajax('/stats').done(function(d) {
    data.gt.pop(); // Remove the trailing 0.
    if (data.gt.length > 115) {
      data.gt.shift();
    }
    data.gt.push([d.goroutine, d.thread, d.block]);
    data.gt.push([0, 0, 0]);
    drawCharts();
    setTimeout(function() {
      moreStats();
    }, 1000);
  });
};

moreStats();

function refresh(force) {
  // TODO: cancel the existing request if it's not ciompleted.
  $('.results').html('Loading, be patient... CPU profile takes 30 seconds.');
  var f = $('.filter').val();
  $.get('/p', {
    profile: profile,
    filter: f,
    force: !!force
  }).done(function(data) {
    $('.results').html(data);
  }).fail(function(data) {
    $('.results').html(data);
  });
};

function drawCharts() {
  $("#tgchart").sparkline(data.gt, {
    type: 'bar',
    height: '40px',
    barSpacing: 2,
    barColor: '#1ABC9C',
    barWidth: 5,
    stackedBarColor: ['#16A085', '#1ABC9C', '#7F8C8D'],
  });
}