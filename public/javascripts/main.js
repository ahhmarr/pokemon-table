$(function() {
    $('.datatable').dataTable();
    $('.pokemon-list').dataTable({
        "order": [
            [3, 'desc']
        ]
    });
});
$(function(){
    $("[name=json]").change(function()
    {
       var json=$(this).val();
       try{
            var pre=JSON.stringify(JSON.parse(json),null,1);
            $("#code").html(pre);
            hljs.configure({
                userBR : true    
            });
           hljs.highlightBlock(document.querySelector("#code"));
      
        }
        catch(error){
            alert('invalid JSON');
        }
                 
    });
});
function isFromIframe() {
    var result = false;
    try {
        var parent = top.location.href;
        var self = location.href;
        if (parent !== self)
            result = true;
    } catch (error) {
        result = true;
    }
    return result;
}
$(function() {
    if (isFromIframe()) {
        $('#embed').remove();
    } else {
        $('#embed').show();
    }
});
$(function() {
    $("#embed").click(function() {
        $('.modal').modal('show');
    })
    $("#generateCode").click(function() {
        var showInvetory = !$("#inventory").is(":checked") ? 'hinvent=true' : '';
        var showCandy = !$("#candy").is(":checked") ? 'hican=true' : '';
        var height = $("#height").val();
        var width = $("#width").val();
        var url = location.href.split('?')[0] + '?' + showInvetory + '&' + showCandy;
        var code = '<iframe style="height:' + height + ';width:' + width + ';border:0" src="' + url + '"></iframe>';
        $("#embedCode").html(code);
    });
});