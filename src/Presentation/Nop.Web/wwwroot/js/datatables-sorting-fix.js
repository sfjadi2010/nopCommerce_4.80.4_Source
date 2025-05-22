/**
 * nopCommerce DataTables sorting fix
 *
 * This script ensures that column sorting parameters are correctly sent to the server
 * in the format that nopCommerce expects (Order_0__Column and Order_0__Dir).
 *
 * The issue is that DataTables sends sorting information in its own format, which doesn't match
 * what the nopCommerce backend expects. This script bridges that gap by translating
 * the parameters.
 */
$(document).ready(function () {
  // Store the original ajax function if it exists
  var originalPreprocessAjaxData =
    $.fn.dataTable.ext.legacy !== undefined
      ? $.fn.dataTable.ext.legacy.ajax
      : null;

  // Create our preprocessing function to transform DataTables parameters to nopCommerce format
  $.fn.dataTable.ext.legacy = $.fn.dataTable.ext.legacy || {};
  $.fn.dataTable.ext.legacy.ajax = function (settings, data) {
    // Call the original preprocessor if it exists
    if (originalPreprocessAjaxData) {
      originalPreprocessAjaxData(settings, data);
    }

    // Handle DataTables 1.10+ format (data.order array of objects)
    if (data.order && data.order.length > 0) {
      data["Order_0__Column"] = data.order[0].column;
      data["Order_0__Dir"] = data.order[0].dir;
      console.log(
        "DataTables 1.10+ format - Order_0__Column=" +
          data.Order_0__Column +
          ", Order_0__Dir=" +
          data.Order_0__Dir
      );
    }
    // Handle DataTables 1.9- format (iSortCol_0 and sSortDir_0)
    else if (data.iSortCol_0 !== undefined) {
      data["Order_0__Column"] = data.iSortCol_0;
      data["Order_0__Dir"] = data.sSortDir_0;
      console.log(
        "DataTables 1.9- format - Order_0__Column=" +
          data.Order_0__Column +
          ", Order_0__Dir=" +
          data.Order_0__Dir
      );
    }
    // Handle settings-based sorting (aaSorting)
    else if (settings && settings.aaSorting && settings.aaSorting.length) {
      data["Order_0__Column"] = settings.aaSorting[0][0];
      data["Order_0__Dir"] = settings.aaSorting[0][1];
      console.log(
        "Settings-based format - Order_0__Column=" +
          data.Order_0__Column +
          ", Order_0__Dir=" +
          data.Order_0__Dir
      );
    }
  };

  // Add a direct patch to the ajax.reload() method to ensure sorting is preserved
  var originalReload = $.fn.dataTable.Api.prototype.ajax.reload;
  $.fn.dataTable.Api.prototype.ajax.reload = function (callback, resetPaging) {
    // Get the current table settings
    var settings = this.settings()[0];

    // Hook into the XHR to modify request data
    if (settings.oFeatures.bServerSide) {
      var originalAjax = settings.ajax;

      // If ajax is a string URL, convert to object
      if (typeof originalAjax === "string") {
        settings.ajax = {
          url: originalAjax,
          type: "POST",
          data: function (data) {
            // Add sorting parameters if available
            if (settings.aaSorting && settings.aaSorting.length) {
              data["Order_0__Column"] = settings.aaSorting[0][0];
              data["Order_0__Dir"] = settings.aaSorting[0][1];
            }
            return data;
          },
        };
      }
      // If ajax is already an object with a data function
      else if (
        typeof originalAjax === "object" &&
        typeof originalAjax.data === "function"
      ) {
        var originalDataFn = originalAjax.data;
        originalAjax.data = function (data) {
          // Call the original data function
          var modifiedData = originalDataFn.call(this, data) || data;

          // Add sorting parameters if available
          if (settings.aaSorting && settings.aaSorting.length) {
            modifiedData["Order_0__Column"] = settings.aaSorting[0][0];
            modifiedData["Order_0__Dir"] = settings.aaSorting[0][1];
          }

          return modifiedData;
        };
      }
    }

    // Call the original reload method
    return originalReload.call(this, callback, resetPaging);
  };

  // For new DataTable initializations, ensure sorting is properly set
  $(document).on("init.dt", function (e, settings) {
    if (settings.oInit && settings.oInit.ordering !== false) {
      // Add a custom XHR preprocessor for this table
      var originalXhrFn = settings.ajax;

      // If ajax is a string (URL)
      if (typeof originalXhrFn === "string") {
        settings.ajax = {
          url: originalXhrFn,
          type: "POST",
          data: function (data) {
            // Ensure order parameters are included
            if (settings.aaSorting && settings.aaSorting.length) {
              data["Order_0__Column"] = settings.aaSorting[0][0];
              data["Order_0__Dir"] = settings.aaSorting[0][1];
            }
            return data;
          },
        };
      }
      // If ajax is already an object
      else if (typeof originalXhrFn === "object") {
        var originalDataFn = originalXhrFn.data;

        if (typeof originalDataFn === "function") {
          originalXhrFn.data = function (data) {
            // Call the original data function
            var modifiedData = originalDataFn.call(this, data) || data;

            // Add sorting parameters
            if (settings.aaSorting && settings.aaSorting.length) {
              modifiedData["Order_0__Column"] = settings.aaSorting[0][0];
              modifiedData["Order_0__Dir"] = settings.aaSorting[0][1];
            }

            return modifiedData;
          };
        } else {
          // If data is not a function, create one
          originalXhrFn.data = function (data) {
            // Add sorting parameters
            if (settings.aaSorting && settings.aaSorting.length) {
              data["Order_0__Column"] = settings.aaSorting[0][0];
              data["Order_0__Dir"] = settings.aaSorting[0][1];
            }

            return data;
          };
        }
      }
    }
  });

  // Add monitoring for column clicks to log sorting activity
  $(document).on(
    "click",
    "th.sorting, th.sorting_asc, th.sorting_desc",
    function () {
      var table = $(this).closest("table").DataTable();
      if (table) {
        setTimeout(function () {
          var order = table.order();
          if (order && order.length) {
            console.log(
              "Column clicked - New sort order: Column " +
                order[0][0] +
                " - Direction: " +
                order[0][1]
            );
          }
        }, 100);
      }
    }
  );
});
