/**
 * Created with JetBrains WebStorm.
 * User: bmd1
 * Date: 08/09/12
 * Time: 23:55
 * To change this template use File | Settings | File Templates.
 */
var timeout=0;
var baseURL="https://api.github.com/";
var userURL="users/"

var viewModel={
    searchTerm: ko.observable(),
    searchTypes:ko.observableArray(['User', 'Team', 'Organisation']),
    selectedSearchType : ko.observable('User'),
    user: ko.observable(),
    team: ko.observable(),
    repo: ko.observable(),

    search: function(){
        if (this.searchTerm().length>3)
        {
            //timeout
            clearTimeout(timeout);
            timeout=setTimeout(function(){
                carryOutGitHubSearch(viewModel.selectedSearchType(),viewModel.searchTerm());
            },500);


        }
    }
};

$(function(){
    ko.applyBindings(viewModel);
});

viewModel.selectedSearchType.subscribe(function(newValue) {
    carryOutGitHubSearch(newValue,viewModel.searchTerm());
});

function carryOutGitHubSearch(searchType,searchTerm)
{
    if(viewModel.searchTerm()!=null){
        console.log(searchType+" "+searchTerm);
        var url=baseURL+userURL+searchTerm;
        //var url="https://api.github.com?callback=foo&Origin=http://www.scottishcodemonkey.com";
        /*
        $.getJSON(url, function(data){

            if(data.stat == "ok") {
                //console.log(data);
                // Map the results
                //ko.mapping.fromJS(data.user, photoMappingOptions, viewModel.user);
            }
        });*/
        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            jsonpCallback: 'searchCallback',
            contentType: "application/json",
            dataType: 'jsonp',
            success: null,
            error:null
        });
    }
}

function searchCallback(response) {
    var meta = response.meta;
    viewModel.user=ko.mapping.fromJS(response.data);
    console.log(meta);
    console.log(response.data);
    console.log(viewModel.user.email());
}

