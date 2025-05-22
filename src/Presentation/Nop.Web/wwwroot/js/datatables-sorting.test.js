/**
 * This file tests the DataTables sorting functionality
 */

function testDataTablesSorting() {
  console.log('Testing DataTables sorting functionality...');
  
  // Mock ajax request to check if our sorting parameters are correctly added
  var mockData = {
    draw: 1,
    order: [{ column: 2, dir: 'asc' }]
  };
  
  // Apply the sorting logic
  if ($.fn.dataTable.ext && $.fn.dataTable.ext.legacy && $.fn.dataTable.ext.legacy.ajax) {
    $.fn.dataTable.ext.legacy.ajax({}, mockData);
    
    // Check if our parameters were added
    if (mockData["Order_0__Column"] === 2 && mockData["Order_0__Dir"] === 'asc') {
      console.log('SUCCESS: Sorting parameters correctly added');
      console.log('  Order_0__Column = ' + mockData["Order_0__Column"]);
      console.log('  Order_0__Dir = ' + mockData["Order_0__Dir"]);
      return true;
    } else {
      console.error('FAIL: Sorting parameters not added correctly');
      return false;
    }
  } else {
    console.error('FAIL: DataTables extension not found');
    return false;
  }
}

// Function to run the test when DataTables is ready
function runDataTablesSortingTest() {
  if (window.$ && $.fn.dataTable) {
    setTimeout(testDataTablesSorting, 1000); // Wait a bit for everything to initialize
  } else {
    console.log('Waiting for DataTables to load...');
    setTimeout(runDataTablesSortingTest, 500);
  }
}

// Run the test automatically
$(document).ready(function() {
  runDataTablesSortingTest();
});
