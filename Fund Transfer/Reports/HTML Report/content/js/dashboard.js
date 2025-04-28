/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8245833333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://parabank.parasoft.com/parabank/logout.htm"], "isController": false}, {"data": [0.0, 500, 1500, "Fund Transfer Stress Test"], "isController": true}, {"data": [1.0, 500, 1500, "https://parabank.parasoft.com/parabank/services_proxy/bank/customers/12212/accounts"], "isController": false}, {"data": [0.9975, 500, 1500, "https://parabank.parasoft.com/parabank/transfer.htm"], "isController": false}, {"data": [0.9975, 500, 1500, "https://parabank.parasoft.com/parabank/overview.htm"], "isController": false}, {"data": [0.9975, 500, 1500, "https://parabank.parasoft.com/parabank/services_proxy/bank/transfer?fromAccountId=12345&toAccountId=12345&amount=100"], "isController": false}, {"data": [0.9975, 500, 1500, "https://parabank.parasoft.com/parabank/login.htm-1"], "isController": false}, {"data": [0.495, 500, 1500, "https://parabank.parasoft.com/parabank/login.htm"], "isController": false}, {"data": [1.0, 500, 1500, "https://parabank.parasoft.com/parabank/logout.htm-0"], "isController": false}, {"data": [0.9125, 500, 1500, "https://parabank.parasoft.com/parabank/login.htm-0"], "isController": false}, {"data": [0.9975, 500, 1500, "https://parabank.parasoft.com/parabank/logout.htm-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2200, 0, 0.0, 365.18681818181824, 251, 1529, 275.5, 654.0, 724.0, 914.8299999999963, 18.015952306860804, 36.78136439106081, 13.260854099448057], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://parabank.parasoft.com/parabank/logout.htm", 200, 0, 0.0, 547.6299999999997, 511, 1331, 533.0, 578.9000000000001, 642.5999999999999, 768.6300000000003, 1.6834450018517895, 3.2202872614768863, 2.717514246153328], "isController": false}, {"data": ["Fund Transfer Stress Test", 200, 0, 0.0, 2709.6149999999993, 2498, 4143, 2638.0, 2846.8, 3270.399999999999, 3970.790000000001, 1.6378809096790574, 23.060899355289127, 9.763305735040007], "isController": true}, {"data": ["https://parabank.parasoft.com/parabank/services_proxy/bank/customers/12212/accounts", 400, 0, 0.0, 281.4675000000003, 259, 497, 272.0, 297.90000000000003, 344.9, 435.9100000000001, 3.348457198345862, 1.4303291350307221, 2.285714435198982], "isController": false}, {"data": ["https://parabank.parasoft.com/parabank/transfer.htm", 200, 0, 0.0, 274.97000000000014, 257, 560, 268.0, 287.8, 309.0, 411.7800000000002, 1.6837993247964707, 4.125489222631947, 1.351643598615917], "isController": false}, {"data": ["https://parabank.parasoft.com/parabank/overview.htm", 200, 0, 0.0, 280.76999999999975, 261, 542, 271.5, 295.6, 341.6499999999999, 446.6500000000003, 1.6830766641420516, 3.47424662595725, 1.346132605402676], "isController": false}, {"data": ["https://parabank.parasoft.com/parabank/services_proxy/bank/transfer?fromAccountId=12345&toAccountId=12345&amount=100", 200, 0, 0.0, 282.4700000000001, 261, 1030, 270.0, 299.8, 326.0, 499.0900000000008, 1.6853601193234966, 0.5615343413191314, 1.4450646335605761], "isController": false}, {"data": ["https://parabank.parasoft.com/parabank/login.htm-1", 200, 0, 0.0, 283.255, 262, 506, 274.0, 300.0, 345.39999999999986, 494.7000000000003, 1.6812232580425517, 10.169635755100412, 0.48105313926412857], "isController": false}, {"data": ["https://parabank.parasoft.com/parabank/login.htm", 200, 0, 0.0, 760.84, 651, 1529, 723.0, 875.8000000000001, 1001.9, 1502.92, 1.6654730776277, 10.767226521513749, 0.8685181869660077], "isController": false}, {"data": ["https://parabank.parasoft.com/parabank/logout.htm-0", 200, 0, 0.0, 272.32, 251, 499, 262.0, 288.8, 329.79999999999995, 473.8900000000001, 1.6873223038698737, 0.647575845137559, 1.3511760636457972], "isController": false}, {"data": ["https://parabank.parasoft.com/parabank/login.htm-0", 200, 0, 0.0, 477.09999999999997, 381, 1142, 446.5, 585.6, 717.4499999999998, 1123.2400000000007, 1.669351540394134, 0.6944763244217783, 0.39288449339354126], "isController": false}, {"data": ["https://parabank.parasoft.com/parabank/logout.htm-1", 200, 0, 0.0, 274.765, 257, 868, 267.0, 284.9, 291.0, 403.7600000000002, 1.6873080687071844, 2.5801065983236593, 1.3725855676104344], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2200, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
