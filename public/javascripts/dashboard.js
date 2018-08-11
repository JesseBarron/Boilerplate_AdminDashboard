function init_daterangepicker() {

    if( typeof ($.fn.daterangepicker) === 'undefined'){ return; }
    console.log('init_daterangepicker');

    var cb = function(start, end, label) {
    //   console.log(start.toISOString(), end.toISOString(), label);
      $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    };

    var optionSet1 = {
      startDate: moment().subtract(8, 'days'),
      endDate: moment(),
      minDate: '01/01/2018',
      maxDate: '12/31/2030',
      dateLimit: {
        days: 60
      },
      showDropdowns: true,
      showWeekNumbers: true,
      timePicker: false,
      timePickerIncrement: 1,
      timePicker12Hour: true,
      ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      },
      opens: 'left',
      buttonClasses: ['btn btn-default'],
      applyClass: 'btn-small btn-primary',
      cancelClass: 'btn-small',
      format: 'MM/DD/YYYY',
      separator: ' to ',
      locale: {
        applyLabel: 'Submit',
        cancelLabel: 'Clear',
        fromLabel: 'From',
        toLabel: 'To',
        customRangeLabel: 'Custom',
        daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        firstDay: 1
      }
    };
    
    $('#reportrange span').html(moment().subtract(8, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
    getLoginActivity(moment().subtract(8,'days').format('YYYY-MM-DD'),moment().format('YYYY-MM-DD'))
    $('#reportrange').daterangepicker(optionSet1, cb);
    $('#reportrange').on('show.daterangepicker', function() {
      console.log("show event fired...dillon");
    });
    $('#reportrange').on('hide.daterangepicker', function() {
      console.log("hide event fired...dillon");
    });
    $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
      getLoginActivity(picker.startDate.format('YYYY-MM-DD'),picker.endDate.format('YYYY-MM-DD'))
      // console.log("apply event fired, start/end dates are " + picker.startDate.format('YYYY-MM-DD') + " to " + picker.endDate.format('MMMM D, YYYY'));
    });
    $('#reportrange').on('cancel.daterangepicker', function(ev, picker) {
      console.log("cancel event fired");
    });
    $('#options1').click(function() {
      $('#reportrange').data('daterangepicker').setOptions(optionSet1, cb);
    });
    $('#options2').click(function() {
      $('#reportrange').data('daterangepicker').setOptions(optionSet2, cb);
    });
    $('#destroy').click(function() {
      $('#reportrange').data('daterangepicker').remove();
    });

}

var chart_plot_02_data = [];
// for (var i = 0; i < 4; i++) {
//   chart_plot_02_data.push([new Date(Date.today().add(i-10).days()).getTime(), randNum() + i + i + 10]);
// }

var chart_plot_02_settings = {
  grid: {
    show: true,
    aboveData: true,
    color: "#3f3f3f",
    labelMargin: 10,
    axisMargin: 0,
    borderWidth: 0,
    borderColor: null,
    minBorderMargin: 5,
    clickable: true,
    hoverable: true,
    autoHighlight: true,
    mouseActiveRadius: 100
  },
  series: {
    lines: {
      show: true,
      fill: true,
      lineWidth: 5,
      steps: false
    },
    points: {
      show: true,
      radius: 4.5,
      symbol: "circle",
      lineWidth: 3.0
    }
  },
  legend: {
    position: "ne",
    margin: [0, -25],
    noColumns: 0,
    labelBoxBorderColor: null,
    labelFormatter: function(label, series) {
      return label + '&nbsp;&nbsp;';
    },
    width: 40,
    height: 1
  },
  colors: ['#96CA59', '#3F97EB', '#72c380', '#6f7a8a', '#f7cb38', '#5a8022', '#2c7282'],
  shadowSize: 0,
  tooltip: true,
  tooltipOpts: {
    content: "%s: %y.0",
    xDateFormat: "%d/%m",
  shifts: {
    x: -30,
    y: -50
  },
  defaultTheme: false
  },
  yaxis: {
    min: 0
  },
  xaxis: {
    mode: "time",
    minTickSize: [1, "day"],
    timeformat: "%d/%m/%y"
  }
};
var dashboardGraph;
if ($("#chart_plot_02").length){
  console.log('Plot2');
  
  dashboardGraph = $.plot( $("#chart_plot_02"), 
  [{ 
    label: "User Logins", 
    data: chart_plot_02_data, 
    lines: { 
      fillColor: "rgba(86, 184, 157, 0.12)" 
    }, 
    points: { 
      fillColor: "#fff" } 
  }], chart_plot_02_settings);
  
}

function getLoginActivity(min,max) {
  var minDate = moment(min)._d;
  var maxDate = moment(max).add(20,'hours')._d;
  $.post(
    "/api/logs/activity/filter",
    {minDate,maxDate},
    function(data, status){
      $.plot( $("#chart_plot_02"), 
      [{ 
        label: "User Logins", 
        data: data.content, 
        lines: { 
          fillColor: "rgba(86, 184, 157, 0.12)" 
        }, 
        points: { 
          fillColor: "#fff" } 
      }], chart_plot_02_settings);
    }
  );
}

init_daterangepicker();