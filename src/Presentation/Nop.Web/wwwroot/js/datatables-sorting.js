/**
 * nopCommerce DataTables sorting
 * 
 * This script handles column sorting by transforming DataTables' native
 * parameters into the format that nopCommerce expects.
 * 
 * DataTables sends sorting information as:
 *   - order[0][column] and order[0][dir] (1.10+)
 *   - iSortCol_0 and sSortDir_0 (older versions)
 * 
 * nopCommerce expects:
 *   - Order_0__Column and Order_0__Dir
 */

$(document).ready(function() {
  // Initialize DataTables pre-draw callback
  $.fn.dataTable.ext.legacy.ajax = function(settings, data) {
    // Add sorting parameters for both new and old DataTables versions
    if (data.order && data.order.length > 0) {
      data["Order_0__Column"] = data.order[0].column;
      data["Order_0__Dir"] = data.order[0].dir;
    } else if (data.iSortCol_0 !== undefined) {
      data["Order_0__Column"] = data.iSortCol_0;
      data["Order_0__Dir"] = data.sSortDir_0;
    }
    // Get order information from settings if available
    else if (settings && settings.aaSorting && settings.aaSorting.length > 0) {
      data["Order_0__Column"] = settings.aaSorting[0][0];
      data["Order_0__Dir"] = settings.aaSorting[0][1];
    }
  };

  // Handle DataTables reload method to ensure sorting is preserved
  var originalReload = $.fn.dataTable.Api.prototype.ajax.reload;
  $.fn.dataTable.Api.prototype.ajax.reload = function(callback, resetPaging) {
    var table = this;
    var settings = table.settings()[0];
    
    // Ensure sort information is passed when reloading
    if (settings.aaSorting && settings.aaSorting.length > 0) {
      var originalAjax = settings.ajax;
      
      // If ajax is a string URL
      if (typeof originalAjax === 'string') {
        settings.ajax = {
          url: originalAjax,
          data: function(data) {
            data["Order_0__Column"] = settings.aaSorting[0][0];
            data["Order_0__Dir"] = settings.aaSorting[0][1];
            return data;
          }
        };
      }
      // If ajax is already an object with a data function
      else if (typeof originalAjax === 'object' && typeof originalAjax.data === 'function') {
        var originalDataFn = originalAjax.data;
        originalAjax.data = function(data) {
          data = originalDataFn(data) || data;
          data["Order_0__Column"] = settings.aaSorting[0][0];
          data["Order_0__Dir"] = settings.aaSorting[0][1];
          return data;
        };
      }
    }
    
    return originalReload.call(this, callback, resetPaging);
  };
});
