//Global Variables
var all_cumulativeData = [];
var lnk_cumulativeData = [];
var crete_cumulativeData = [];
var oma_cumulativeData = [];
var dates = [];
var lastUpdated = "";

var all_cumulative = 0;
var all_currentActive = 0;
var all_new = 0;



var lnk_cumulative = 0;
var lnk_currentActive = 0;
var lnk_new = 0;
var lnk_level = 0;


var crete_cumulative = 0;
var crete_currentActive = 0;
var crete_new = 0;
var crete_level = 0;


var oma_cumulative = 0;
var oma_currentActive = 0;
var oma_new = 0;
var oma_level = 0;


var cumulative;


function getDashboard() {
    request('GET', 'https://www0.doane.edu/covid-dashboard/api/getSheet/', "", function(JSONresult) {    
        let googleSheet = JSON.parse(JSONresult);
        //console.log(googleSheet);
        var dialDiv = document.getElementById("riskdials");
        
        googleSheet.table.rows.forEach(function(entry, key, array) {
            dates.push(convertDate(entry.c[0].f, "short"));
            var creteCurActive = parseInt(entry.c[1].f);
            var creteCumulative = parseInt(entry.c[2].f);
            var creteNew = parseInt(entry.c[3].f);
       
            
            var lnkCurActive = parseInt(entry.c[5].f);
            var lnkCumulative = parseInt(entry.c[6].f);
            var lnkNew = parseInt(entry.c[7].f);
           
            
            var omaCurActive = parseInt(entry.c[9].f);
            var omaCumulative = parseInt(entry.c[10].f);
            var omaNew = parseInt(entry.c[11].f);
            

            crete_cumulativeData.push(creteCumulative);
            lnk_cumulativeData.push(lnkCumulative);
            oma_cumulativeData.push(omaCumulative);
            all_cumulativeData.push(creteCumulative + lnkCumulative + omaCumulative);

            //Grab the most recent values when we get to the last record.
            if (key === array.length - 1){ 
                //console.log("Got Here");
                crete_level = parseInt(entry.c[4].f);
                crete_new = parseInt(entry.c[3].f);
                crete_currentActive = parseInt(entry.c[1].f);
                crete_cumulative = parseInt(entry.c[2].f);
                dialDiv.appendChild(buildImage(crete_level, "crete"));

                lnk_level = parseInt(entry.c[8].f);
                lnk_new = parseInt(entry.c[7].f);
                lnk_currentActive = parseInt(entry.c[5].f);
                lnk_cumulative = parseInt(entry.c[6].f);
                dialDiv.appendChild(buildImage(lnk_level, "lnk"));

                oma_level = parseInt(entry.c[12].f);
                oma_new = parseInt(entry.c[11].f);
                oma_currentActive = parseInt(entry.c[9].f);
                oma_cumulative = parseInt(entry.c[10].f);
                dialDiv.appendChild(buildImage(oma_level, "oma"));

                all_new = oma_new + lnk_new + crete_new;
                all_currentActive = oma_currentActive + lnk_currentActive +  crete_currentActive;
                all_cumulative = oma_cumulative + lnk_cumulative + crete_cumulative;
                lastUpdated = entry.c[0].f;
            }
           
        });


        //Set up the charts
        var rectangleSet = false;
        var configCumulative = {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    lineTension: 0,
                    backgroundColor: 'rgba(17, 141, 255, 1)',
                    borderColor: 'rgba(17, 141, 255, 1)',
                    pointRadius: 8,
					pointHoverRadius: 6,
                    data: all_cumulativeData,
                    fill: false
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                layout: {
                    padding: {
                      top: 20,
                      left: 20,
                      right: 20
                    }
                  },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        gridLines: {
                            display: true,
                            drawBorder: true,
                            drawOnChartArea: false,
                            lineWidth: 2
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        gridLines: {
                            borderDash: [5, 10],
                            lineWidth: 2
                        },
                        ticks: {
                            precision: 0,
                            maxTicksLimit: 6
                        },
                        scaleLabel: {
                            display: false,
                            labelString: 'Value'
                        }
                    }]
                },
                animation: {
                    onComplete: function () {
                        if (!rectangleSet) {
                            var scale = window.devicePixelRatio;                       

                            var sourceCanvas = this.chart.canvas;
                            var copyWidth = this.scales['y-axis-0'].width + 12;
                            var copyHeight = this.scales['y-axis-0'].height + this.scales['y-axis-0'].top + 10;
                            var targetCtx = document.getElementById("chartAxis").getContext("2d");
                            targetCtx.scale(scale, scale);
                            targetCtx.canvas.width = copyWidth * scale;
                            targetCtx.canvas.height = copyHeight * scale;

                            targetCtx.canvas.style.width = `${copyWidth}px`;
                            targetCtx.canvas.style.height = `${copyHeight}px`;
                            targetCtx.drawImage(sourceCanvas, 0, 0, copyWidth * scale, copyHeight * scale, 0, 0, copyWidth * scale, copyHeight * scale);
                            var sourceCtx = sourceCanvas.getContext('2d');

                            // Normalize coordinate system to use css pixels.
                            sourceCtx.clearRect(0, 0, copyWidth * scale, copyHeight * scale);
                            rectangleSet = true;
                        }
                    },
                    onProgress: function () {
                        if (rectangleSet === true) {
                            var copyWidth = this.scales['y-axis-0'].width;
                            var copyHeight = this.scales['y-axis-0'].height + this.scales['y-axis-0'].top + 10;

                            var sourceCtx = this.chart.canvas.getContext('2d');
                            sourceCtx.clearRect(0, 0, copyWidth, copyHeight);
                        }
                    }
                }
            }
        };
        
        var cumulativeCtx = document.getElementById('cumulative');
        cumulative = new Chart(cumulativeCtx, configCumulative);
        var div = document.getElementsByClassName('chartAreaWrapper')[0];
        div.scrollLeft = div.scrollWidth - div.clientWidth;
        document.getElementById("positiveStat").innerHTML = all_currentActive;
        document.getElementById("recoveredStat").innerHTML = all_cumulative;
        document.getElementById("pendingStat").innerHTML = all_new;
        document.getElementById("riskstatus").innerHTML = "Status as of " + convertDate(lastUpdated);
  
    });
  }

  function updateChart() {
    cumulative.data.datasets[0].data = eval(this.dataset.chart + "_cumulativeData");
    document.getElementById("positiveStat").innerHTML = eval(this.dataset.chart + "_currentActive");
    document.getElementById("recoveredStat").innerHTML = eval(this.dataset.chart + "_cumulative");
    document.getElementById("pendingStat").innerHTML = eval(this.dataset.chart + "_new");
    showDial(this.dataset.chart);
    cumulative.update();

  }

  function buildImage($level, $name) {  
    var element = document.createElement("div");
    element.classList.add($name);
    element.classList.add("dial");
    element.classList.add("visible");
    element.classList.add("all");
    var imgElement = document.createElement("img");
    var titleDiv = document.createElement("div");
    
    switch($name) {
        case 'oma':
            titleDiv.innerHTML = "Omaha Campus";
          break;
        case 'lnk':
            titleDiv.innerHTML = "Lincoln Campus";
          break;
        case 'crete':
            titleDiv.innerHTML = "Crete Campus";
    }
    
    element.appendChild(titleDiv);

    if($level < 2) {
        imgElement.src = "/modules/custom/doane_covid_dashboard/images/risk-dial-1.svg";
    }
    else if ($level < 3) {
        imgElement.src = "/modules/custom/doane_covid_dashboard/images/risk-dial-2.svg";
    }
    else if ($level < 4) {
        imgElement.src = "/modules/custom/doane_covid_dashboard/images/risk-dial-3.svg";
    }
    else {
        imgElement.src = "/modules/custom/doane_covid_dashboard/images/risk-dial-4.svg";
    }

    element.appendChild(imgElement);

    return element;
  }

  function showDial($dialName) {
    var allDials = document.getElementsByClassName("dial");
    for (var i = 0; i < allDials.length; i++) {
        allDials[i].classList.remove('visible');
    }

    var visibleDial = document.getElementsByClassName($dialName);
    for (var i = 0; i < visibleDial.length; i++) {
        visibleDial[i].classList.add('visible');
    }

  }

// Utility methods
function request(method, url, data, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            callback(req.responseText);
        } else if (req.readyState === 4 && req.status !== 200) {
            console.error('Cannot complete request.');
        }
    };
    req.open(method, url, true);
    if (method !== 'GET') {
        req.setRequestHeader('content-type', 'application/json');
    }
    req.send(data);
  }

function convertDate(inDate, len) {
    var date= inDate.split("/");
    var f = new Date(date[2], date[0] - 1, date[1]);
    //console.log(f.toString());
    var year = f.getFullYear();
    var month = f.getMonth();
    var day = f.getDate();

    const shortMonths = {
        0: 'Jan',
        1: 'Feb',
        2: 'Mar',
        3: 'Apr',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'Aug',
        8: 'Sept',
        9: 'Oct',
        10: 'Nov',
        11: 'Dec'
      }
      if (len == "short") {
        return shortMonths[month] + " " + day;
      } else {
        return shortMonths[month] + " " + day + ", " + year;
      }
      

}

//Event Listeners  
document.addEventListener("onload", getDashboard());
var elements = document.getElementsByClassName("updatechart");
for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', updateChart);
}