/**
 * Debug helper for DataTables sorting issues
 */
$(document).ready(function() {
    // Add event listener to track column clicking and parameter sending
    $(document).on('click', 'th.sorting, th.sorting_asc, th.sorting_desc', function() {
        console.log('Column header clicked:', $(this).text());
        
        // Get column index
        var columnIndex = $(this).index();
        console.log('Column index:', columnIndex);
        
        // Find the datatable this header belongs to
        var tableId = $(this).closest('table').attr('id');
        console.log('Table ID:', tableId);
        
        // Get DataTable instance
        var table = $('#' + tableId).DataTable();
        
        // Log the order parameters that should be sent
        var order = table.order();
        console.log('Current order:', order);
        
        // Add one-time listener to see what's being sent in AJAX request
        $(document).ajaxSend(function(event, jqxhr, settings) {
            // Only intercept requests from this table
            if (settings.url.includes('ProductList')) {
                console.log('DataTables AJAX request data:', settings.data);
                // Remove the listener after first capture
                $(document).off('ajaxSend');
            }
        });
    });
    
    // Patch for DataTables to ensure ordering parameters are sent
    if ($.fn.dataTable) {
        var originalAjaxSend = $.fn.dataTable.ext.legacy.ajax;
        if (originalAjaxSend) {
            $.fn.dataTable.ext.legacy.ajax = function(settings, data) {
                // Ensure ordering parameters are included
                if (settings.aaSorting && settings.aaSorting.length) {
                    data['order[0][column]'] = settings.aaSorting[0][0];
                    data['order[0][dir]'] = settings.aaSorting[0][1];
                    
                    // Translate to nopCommerce expected format
                    data['Order_0__Column'] = settings.aaSorting[0][0];
                    data['Order_0__Dir'] = settings.aaSorting[0][1];
                }
                
                console.log('Modified request data:', data);
                
                // Call the original function
                if (originalAjaxSend) {
                    return originalAjaxSend(settings, data);
                }
            };
        }
        
        // Add a hook for serverParams to include ordering
        var originalServerParams = $.fn.dataTable.defaults.fnServerParams;
        $.fn.dataTable.defaults.fnServerParams = function(data) {
            var api = this.api();
            var order = api.order();
            
            if (order && order.length) {
                data['Order_0__Column'] = order[0][0];
                data['Order_0__Dir'] = order[0][1];
            }
            
            console.log('Server params:', data);
            
            // Call the original function if it exists
            if (originalServerParams) {
                originalServerParams.call(this, data);
            }
        };
    }
});
